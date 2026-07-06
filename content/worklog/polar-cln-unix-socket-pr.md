---
title: Opened PR in Polar for CLN unix socket handling on Windows
date: 2026-03-10
tags: [polar, cln, docker]
project: polar
links:
  - label: "PR #placeholder — CLN unix socket fix"
    url: https://github.com/jamaljsr/polar/pulls
---

Opened a pull request fixing Core Lightning's unix-socket handling under Docker on Windows/WSL2 — moving the RPC socket off `/mnt/c/`-mounted paths and onto a named Docker volume. Full writeup in the [blog post](/blog/cln-unix-sockets-on-windows-docker/). Awaiting review.

*Sample entry — replace the PR link with the real one once opened.*
