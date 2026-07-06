---
title: "A Docker healthcheck can't tell LND is unlocked just from the port being open"
date: 2026-01-11
tags: [lnd, docker, polar]
---

LND's gRPC port opens before the wallet is unlocked — it just returns `wallet locked` errors on most calls until you unlock it. A naive Docker healthcheck that only checks "is the port accepting connections" reports healthy long before the node can actually do anything useful.

Better: healthcheck against `lncli getinfo` itself, which fails until the wallet is unlocked and the node is actually ready:

```yaml
healthcheck:
  test: ["CMD", "lncli", "--network=regtest", "getinfo"]
  interval: 2s
  retries: 30
```
