---
title: Dev setup and CLI tools
description: What's actually installed on my ThinkPad, and why.
date: 2025-09-01
updated: 2026-05-01
tags: [linux, docker, typescript]
items:
  - label: Ubuntu (ThinkPad X1)
    note: DKMS rebuilds after kernel upgrades, see the blog post on IPU6.
  - label: Docker + Docker Compose
    note: Everything Bitcoin/Lightning-related runs in containers, regtest included.
  - label: lncli / bitcoin-cli
    note: Aliased with sane defaults for regtest so I don't retype --network flags.
  - label: Polar
    url: https://lightningpolar.com
    note: For anything needing more than one node.
  - label: ripgrep + fd
    note: Faster than grep/find for anything inside a large checked-out repo.
  - label: git worktree
    note: "See the TIL: beats stashing when reviewing a PR mid-task."
---

Nothing exotic — the actual leverage is in the aliases and small scripts wrapping `bitcoin-cli`/`lncli` for regtest, not the tools themselves.
