---
title: Checklist for debugging a flaky multi-node regtest setup
description: A running checklist I use before assuming a bug is in the code rather than the environment.
date: 2025-12-01
tags: [docker, polar, bitcoin]
---

Things to check, in order, before spending real time on a bug that only reproduces in a multi-node Docker/regtest setup:

1. Are all nodes actually on the same regtest chain? (`bitcoin-cli getblockchaininfo` on each — compare `bestblockhash`.)
2. Is the bitcoind node mining blocks anyone's actually connected to, or a fork nobody's following?
3. Are container clocks in sync? Channel timelock logic is sensitive to this in ways that are easy to misdiagnose as a protocol bug.
4. Docker volume boundary — is a socket/FIFO file crossing a filesystem translation layer (WSL2, overlay driver) it shouldn't be?
5. Only after all four: assume the bug is actually in the code under test.

This list exists because I've burned time on all four before finding the "real" bug.
