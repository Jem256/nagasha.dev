---
title: "bitcoin-cli generatetoaddress needs an address, not just a count"
date: 2026-02-03
tags: [bitcoin, docker]
---

On regtest, `bitcoin-cli generatetoaddress <n> <address>` mines `n` blocks with rewards paid to `<address>` — the address argument is required, unlike the deprecated `generate` RPC. Grab a fresh address first if you don't have one handy:

```
ADDR=$(bitcoin-cli -regtest getnewaddress)
bitcoin-cli -regtest generatetoaddress 101 "$ADDR"
```

101 blocks is the usual number to mine on a fresh regtest chain — coinbase outputs need 100 confirmations before they're spendable, so 101 gets you one spendable coinbase output to work with.
