---
title: "Driving Polar with MCP: From Prompts to a Custom Agent Skill"
description: "Use Polar's MCP server to spin up regtest Lightning networks from an AI agent, then package your testing workflow as a reusable agent skill."
date: 2026-10-15
tags: [polar, lightning, bitcoin, docker, open-source]
draft: true
---

A while back I wrote about [setting up a Lightning sandbox with Polar on Linux](/blog/setting-up-a-bitcoin-lightning-network-sandbox-with-polar-on-linux). That guide was all clicks: create a network, start it, fund a node, open a channel, mine some blocks, then copy the TLS cert and macaroon into your app's config. It works. But if you're building a Lightning app, you do that same routine over and over, every time you need a clean network to test against.

Polar now ships an MCP server, which means an AI agent like Claude or Cursor can do all of that for you. This post has two parts:

1. **A guide to the Polar MCP**: what it is, how to set it up, and how to drive a network with plain prompts.
2. **Building your own agent skill** on top of it, so your agent runs *your* testing workflow the same way every time. I'll use my `polar-network` skill as the worked example.

## How Polar's MCP works

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is a standard way to give AI agents tools. Polar's MCP setup has three layers:

```
┌──────────────────────────────┐
│ AI agent (Claude, Cursor…)   │
└──────────────┬───────────────┘
               │ stdio
┌──────────────▼───────────────┐
│ @lightningpolar/mcp          │  ← the MCP server, run via npx
└──────────────┬───────────────┘
               │ HTTP, localhost:37373
┌──────────────▼───────────────┐
│ Polar desktop app            │  ← HTTP bridge inside the running app
│ 48 tools: networks, bitcoin, │
│ lightning, taproot assets…   │
└──────────────────────────────┘
```

The MCP server is a thin client. The real work happens inside the Polar app, which runs a small HTTP bridge on `localhost:37373`. **This means Polar has to be open for any of the tools to work.** If your agent says it can't reach Polar, check that first.

The 48 tools cover network management (create, start, stop, add nodes), Bitcoin (mine blocks, deposit funds), Lightning (open and close channels, create and pay invoices) and Taproot Assets. You can read more in Polar's [MCP architecture docs](https://github.com/jamaljsr/polar/blob/master/docs/mcp-architecture.md).

## Setting it up

**Prerequisites**

- Docker and Docker Compose (Polar runs every node in a container)
- [Polar](https://lightningpolar.com/) v4.0.0 or later, installed and running
- Node.js 20+ (for `npx`)

**Add the MCP server to your agent**

In Claude Code:

```bash
claude mcp add polar -- npx -y @lightningpolar/mcp
```

For Claude Desktop, Cursor or any other client that takes a JSON config:

```json
{
  "mcpServers": {
    "polar": {
      "command": "npx",
      "args": ["-y", "@lightningpolar/mcp"]
    }
  }
}
```

The [polar-mcp repo](https://github.com/jamaljsr/polar-mcp) has the official install instructions for each client.

**Check that it works**

With Polar open, run `/mcp` in Claude Code to confirm the `polar` server is connected. Then ask:

> List my Polar networks.

The agent should call `list_networks` and show you whatever networks you already have in Polar.

<!-- TODO screenshot: /mcp showing polar connected -->

## Building a network with prompts

Here's the same setup from my old post, done by prompt instead of by clicking:

> Create a Polar network called `my-app-regtest` with two LND nodes and a bitcoind node, start it, and open a 250,000 sat channel from alice to bob.

Behind the scenes, the agent chains a few tool calls:

```json
// create_network
{ "name": "my-app-regtest",
  "nodes": [{ "implementation": "LND", "count": 2 }, { "implementation": "bitcoind" }] }

// start_network
{ "networkId": 9 }

// open_channel
{ "networkId": 9, "fromNode": "alice", "toNode": "bob", "sats": 250000 }

// mine_blocks: confirms the channel
{ "networkId": 9, "blocks": 6 }
```

Implementations you can use are `LND`, `c-lightning`, `eclair`, `litd`, `tapd` and `bitcoind`. Nodes are named alice, bob, carol and so on, in order. To test a payment:

> Create a 5,000 sat invoice on bob and pay it from alice.

That's `create_invoice` (`networkId`, `nodeName`, `amount`) followed by `pay_invoice` (`networkId`, `fromNode`, `invoice`).

A few things I learned the hard way:

- **`start_network` returns before the network is ready.** The call times out while the containers are still booting. If the agent goes straight to opening a channel, it will fail. It needs to wait until every node reports as started.
- **`open_channel` funds the opener for you.** `autoFund` defaults to true, so the opener gets on-chain funds first. But the opener holds *all* the outbound liquidity. If you need to receive payments on alice too, open a channel in each direction, or pay an invoice across.
- **Ports change from one network to the next.** Polar gives alice's REST API port 8081, bob's 8082, and so on, but a second network gets different ports. Never hard-code them.

## Why plain MCP isn't enough

Prompting works for one-off experiments. Once I started using it every day for testing, the same problems kept coming up:

- **The agent touches networks it shouldn't.** I have older networks in Polar that I care about. Without guidance, an agent asked to "stop the network" may happily stop the wrong one.
- **It guesses argument names.** It might pass `amountSats` when the tool expects `sats`.
- **It reports "ready" too early**, for the reason above.
- **I still have to wire my app up by hand.** The step that actually matters is getting each node's REST URL, TLS cert, macaroon or rune into my app's `.env`, and the MCP tools don't do that for me.

I was giving the agent the same corrections every session. That's what agent skills are for.

## Building a custom skill

A **skill** is a folder with a `SKILL.md` file (plus any scripts it needs) that the agent loads when a task matches it. In Claude Code, personal skills live in `~/.claude/skills/<name>/`. The file starts with a name and a description:

```markdown
---
name: polar-network
description: Use the installed Polar desktop app as a local regtest Lightning
  network for developing ANOTHER Lightning app … Use when asked for a local/regtest
  Lightning network, Lightning test nodes, Polar node connection details, or
  "connect my app to Polar". NOT for developing or reviewing Polar's own code.
---
```

**The description decides when the skill runs**, so write it as a list of the things you'd actually say. The "NOT for…" line keeps it from triggering in situations where it doesn't apply, such as when I'm working on Polar's own code.

The rest of the file is instructions in plain language. Here are the design choices in `polar-network` that made the biggest difference. You can borrow them for your own skill.

### 1. One rule, enforced in code

> Networks the user already has are **read-only**: list and read them, but never start, stop, rename, delete or change them.

Writing a rule in the instructions isn't enough, so the skill enforces it in code. Every network the skill creates is recorded in a small ledger file (`~/.local/state/polar-network/owned.json`). The helper script refuses any change-making tool call on a network that isn't in that ledger.

### 2. A small helper script

The skill ships `polar.py`, a dependency-free Python script that talks to the same HTTP bridge on port 37373:

```bash
X=~/.claude/skills/polar-network/scripts/polar.py

$X up                  # check Docker, start Polar if needed, wait for the bridge
$X owned               # networks this skill created before: reuse one
$X tools open_channel  # the real argument names for a tool
$X call create_network '{"name":"my-app-regtest","nodes":[...]}'
$X call start_network '{"networkId":9}'; $X wait 9
$X connect 9 --check   # .env lines for every node, plus a live API check
```

Each command fixes one of the problems above. `tools` stops the guessing, `wait` polls until every node is actually running, and `owned` means the agent reuses this project's network instead of creating a new one every session.

### 3. Connection details as `.env` lines

`connect` is the command I use most. For every node it prints what an app needs to connect:

```bash
# alice (LND 0.19.x)
ALICE_REST_PORT=8081
ALICE_REST_URL=https://127.0.0.1:8081
ALICE_GRPC_HOST=127.0.0.1:10001
ALICE_TLS_CERT_PATH=/home/you/.polar/networks/9/volumes/lnd/alice/tls.cert
ALICE_ADMIN_MACAROON_HEX=0201036c6e64…
```

With `--check` it also makes a real API call to each node, so I know the credentials work before my app tries them.

### 4. Know how each implementation connects

Every Lightning implementation handles auth differently, and that's where agents (and people) make the most mistakes. The skill includes a table:

| Node | Transport | Auth |
|---|---|---|
| LND / litd | REST `https://127.0.0.1:<rest>` | `Grpc-Metadata-macaroon` header, node's `tls.cert` as CA |
| Core Lightning ≥ 23.08 | clnrest over **plain HTTP** | `Rune` header |
| Eclair | HTTP | basic auth, empty user, password `eclairpw` |
| bitcoind | JSON-RPC | `polaruser` / `polarpass` |

### 5. Say what happens when the session ends

> Leave the network running if the user is still developing against it… Only stop or delete it when the user is done or asks.

Without this, a tidy agent cleans up a network I was about to use again.

### A skeleton for your own skill

You don't need my exact skill. The pattern works for any Lightning project. Here's a starting point to adapt for your app's test flow:

```markdown
---
name: my-lnurl-testnet
description: Spin up the regtest Lightning network my LNURL server is tested
  against, using Polar's MCP tools. Use when asked to test LNURL flows locally,
  reset the test network, or refresh node credentials in .env.
---

## Network
- Reuse the Polar network named `lnurl-regtest` if it exists; never modify any other network.
- Otherwise create it: 1 LND (server), 1 Core Lightning (payer), 1 bitcoind.
- After `start_network`, call `list_networks` until every node is Started.

## Liquidity
- Open 500,000 sats server → payer and 500,000 sats payer → server, then mine 6 blocks.

## Connect
- Write `LND_REST_URL`, `LND_MACAROON_HEX` and `LND_TLS_CERT_PATH` to `.env.local`
  (gitignored). Read ports from Polar every time; never hard-code them.

## Smoke test
- Run `npm run test:lnurl` and report the result.
```

Start small. Each time you correct the agent, add the correction to the skill.

## The workflow now

Before, a fresh test environment took a few minutes of clicking plus copying credentials around. Now I open my app's project and say:

> Give me two LND nodes with a funded channel each way and put alice's connection details in `.env.local`.

The agent finds the skill, reuses this project's network if it already exists, waits until it's ready, sets up liquidity and writes working credentials. It also leaves my other networks alone.

The time saved per run is small. What matters more is that every run is the same, and the setup lives in a file I can share instead of in my head.

<!-- TODO screenshot: the one-prompt run end to end -->

## Get the skill

The `polar-network` skill is on GitHub: **[github.com/Jem256/polar-skills](https://github.com/Jem256/polar-skills)**. To install it, copy its folder into `~/.claude/skills/`. Then open Polar and ask your agent for a Lightning network.

If you build a skill for your own Lightning project, I'd love to see it. And if you hit rough edges in Polar's MCP tools, issues and PRs on [jamaljsr/polar](https://github.com/jamaljsr/polar) are very welcome.
