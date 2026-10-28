---
title: "Using Polar’s MCP to Build a Lightning Testing Environment with AI"
date: "2026-10-24"
tags: ["polar", "lightning", "bitcoin"]
draft: false
---

![](https://cdn-images-1.medium.com/max/1024/0*HZNzOtbUlqbW6ESr)

_Image credit:_ [_PopularAiTools_](https://popularaitools.ai/blog/model-context-protocol-guide-2026)

A while back, I wrote about [setting up a Lightning sandbox with Polar on Linux](/blog/setting-up-a-bitcoin-lightning-network-sandbox-with-polar-on-linux).

That guide walked through creating a network, starting nodes, funding them, opening channels, mining blocks, and configuring an application to connect to those nodes.

It works, but if you’re developing a Lightning application, you end up repeating those steps every time you need a fresh testing environment.

Recently, I started exploring Polar’s MCP server, which lets AI agents interact with Polar through tools. Instead of manually configuring a network, I can describe what I need and let an agent carry out the setup.

In this guide, I’ll show you how to connect an AI agent to Polar, create a local Lightning network using prompts, and test a payment. You don’t need to build your own agent or write automation scripts to get started. You simply need a working Polar installation and an MCP-compatible client.

### What is MCP, and how does Polar use it?

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is a standard that allows AI applications to connect to external tools and services.

An AI agent can understand your request and decide which tools to call, but it needs a way to interact with your local development environment. MCP provides a standard interface for discovering and using those tools.

For example, if you ask an agent to create a Bitcoin regtest network with two Lightning nodes, it can use Polar’s MCP tools to create the network, start the nodes, open a channel, and mine blocks.

Polar’s MCP setup has three main components:

1.  **Your AI agent:** A client such as Claude, Codex and others. This is where you describe what you want to accomplish.
2.  **The Polar MCP server:** A server that exposes Polar’s functionality as tools the agent can call.
3.  **The Polar desktop app:** The application that manages your local Bitcoin and Lightning networks.

The MCP server communicates with Polar through a local HTTP bridge at `localhost:37373`. The server acts as an interface to the functionality provided by the running Polar app.

**One important detail: Polar needs to be open for its MCP tools to work.** If your agent cannot reach Polar, check that the desktop application is running before investigating anything else.

The tools cover network management, Bitcoin operations such as mining blocks and funding nodes, Lightning operations such as opening channels and making payments, and Taproot Assets.

You can find more technical details in [Polar’s MCP architecture documentation](https://github.com/jamaljsr/polar/blob/master/docs/mcp-architecture.md).

### Setting up Polar MCP

Let’s connect Polar to an AI agent.

#### Prerequisites

You’ll need:

*   [Polar](https://lightningpolar.com/) version 4.0.0 or later.
*   Docker and Docker Compose.
*   Node.js 20 or later, for running the MCP server via npx.
*   An MCP-compatible AI client.

Make sure Docker is running and open the Polar desktop application.

#### 1\. Connect your AI agent

If you’re using Claude Code, run:

```
claude mcp add polar -- npx -y @lightningpolar/mcp
```

This registers Polar’s MCP server with Claude Code. The npx command runs the package, downloading it if necessary.

If you’re using Claude Desktop, Cursor, or another client that uses a JSON configuration, the configuration generally looks like this:

```
{
  "mcpServers": {
    "polar": {
      "command": "npx",
      "args": ["-y", "@lightningpolar/mcp"]
    }
  }
}
```

The location of the configuration file and the exact setup process depend on your client. For client-specific instructions, see the [Polar MCP repository](https://github.com/jamaljsr/polar-mcp).

#### 2\. Check that the connection works

With Polar open, use `/mcp` in Claude Code to check whether the polar server is connected.

Then ask the agent:

> List my Polar networks.

The agent should call the `list_networks` tool and return the networks already configured in Polar.

This is a good first test because it verifies that the agent can interact with Polar without creating or modifying anything.

If it doesn’t work, check that Polar is running, confirm the MCP server is configured correctly, and review your client’s connection status.

![](https://cdn-images-1.medium.com/max/782/1*XkBSeEx8I9UQ6WbrqrBA-g.png)

_Claude Code showing the Polar MCP server connected_

### Creating a Lightning network with a prompt

Now for the interesting part.

Suppose we’re developing a Lightning application and need two LND nodes connected through a funded channel.

Normally, we’d open Polar, create a network, configure the nodes, start the network, and open a channel. With MCP, we can describe the outcome we want instead.

Try this prompt:

> Create a Polar network called my-app-regtest with two LND nodes and a bitcoind node. Start the network, open a 250,000 sat channel from Alice to Bob, and mine enough blocks to confirm the channel.

The agent can translate this request into a sequence of tool calls.

For example, the network creation request would look something like this:

```
{
  "name": "my-app-regtest",
  "nodes": [
    {
      "implementation": "LND",
      "count": 2
    },
    {
      "implementation": "bitcoind"
    }
  ]
}
```

After creating the network, the agent needs to start it, wait for the nodes to become ready, open the channel, and mine blocks to confirm it.

The relevant operations include `create_network`, `start_network`, `open_channel`, and `mine_blocks`.

You don’t need to know every tool call before getting started. You describe what you want to accomplish, and the agent uses the available tools to work toward that result.

Polar supports several node implementations, including LND, c-lightning (Core Lightning), eclair, litd, tapd, and bitcoind. The implementations you can use depend on the supported node types and images available in your Polar setup.

Polar assigns names such as Alice, Bob, and Carol to nodes in sequence. You can refer to these names in subsequent prompts.

### Testing a Lightning payment

Once the network is running and the channel is confirmed, let’s test whether payments work.

Ask the agent:

> Create a 5,000 sat invoice on Bob and pay it from Alice. Tell me whether the payment succeeded.

The agent can create an invoice on Bob using `create_invoice` and then pass that invoice to `pay_invoice` to initiate the payment from Alice.

This gives us a simple end-to-end test of the local Lightning network without manually switching between nodes or issuing commands ourselves.

However, the channel needs sufficient usable liquidity for the payment, and the agent needs to check the result rather than simply assume that calling the tool means the payment succeeded.

That’s one of the useful things about working with an AI agent: you can ask it to carry out a sequence of operations and report the outcome. You should still verify important results, especially when building a test workflow you intend to rely on.

### Connecting your application to Polar

Once your network is running, you can use its nodes to test your application. An LND integration, for example, typically needs the node’s REST URL, TLS certificate, and admin macaroon.

Your local configuration might look like this:

```
LND_REST_URL=https://127.0.0.1:8081
LND_TLS_CERT_PATH=/path/to/tls.cert
LND_ADMIN_MACAROON_HEX=...
```

These are illustrative values; retrieve the actual ports and credentials from your Polar network. Core Lightning, Eclair, and Bitcoin Core have different connection and authentication requirements.

Keep credentials in a local configuration file such as .env.local, excluded from version control, and avoid exposing secrets in logs or agent output.

### Making the workflow repeatable

MCP handles individual tasks, but a reliable development workflow often needs more: reusing a specific network, waiting for nodes to become ready, setting up consistent channel liquidity, and preparing connection details before tests run.

That’s where a reusable agent skill helps. It encodes the workflow and its constraints so the agent can follow the same process across sessions.

I built a `polar-network` skill for this purpose, with network-ownership safeguards, node-readiness checks, and a helper script. I’ll cover the implementation in a follow-up article.

Explore the code in the [polar-skills repository](https://github.com/Jem256/polar-skills).

### Bringing it together

Polar’s MCP server makes it possible for an AI agent to create networks, configure channels, and retrieve connection details through natural-language instructions.

Give it a try and explore how an AI agent can simplify your Lightning development workflow. If you encounter rough edges or have ideas for improving the MCP tools, contribute or report an issue in [Polar’s GitHub repository](https://github.com/jamaljsr/polar).
