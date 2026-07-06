---
title: "Polar's CLI can export a running network's node configs for reuse"
date: 2025-11-22
tags: [polar, docker]
---

When debugging an issue that only reproduces with a specific multi-node topology, exporting the network config once and re-importing it beats manually rebuilding the same LND/CLN/Eclair node layout by clicking through the UI every time. Keep exported configs alongside the issue you're debugging so future-you (or another contributor) can reproduce the exact setup.
