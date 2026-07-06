---
title: "lncli listchannels has a --private flag you'll want in scripts"
date: 2026-02-18
tags: [lnd, lightning]
---

`lncli listchannels` shows all channels by default. Add `--private` to filter to only private (unannounced) channels — useful when scripting checks against a node that mixes public routing channels with private LSP-style channels, without having to post-process the JSON yourself.

```
lncli listchannels --private | jq '.channels | length'
```
