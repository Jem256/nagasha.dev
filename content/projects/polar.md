---
title: Polar
description: A one-click local development environment for Bitcoin and Lightning nodes.
date: 2025-01-15
updated: 2026-07-01
tags: [bitcoin, lightning, polar, lnd, cln, docker, typescript]
status: active
role: Grant-funded contributor (Btrust Starter Grant)
repo: https://github.com/jamaljsr/polar
website: https://lightningpolar.com
order: 1
---

Polar lets developers spin up local Bitcoin and Lightning networks — LND, Core Lightning, and Eclair nodes wired together over Docker — without touching testnet or signet. It's the tool most Lightning app developers reach for when they need a throwaway network to test against.

## My role

I contribute under a **Btrust Starter Grant**, focused mostly on cross-platform reliability: Windows/WSL2 quirks, Docker volume behavior, and node lifecycle handling (locking, unlocking, backup/restore of seeds and channel state). A lot of the work is unglamorous compatibility fixing — the kind of thing that doesn't show up in a changelog headline but determines whether a new contributor's first `docker compose up` actually works.

*Sample milestones below — replace with real PR links before publishing:*

- Fixed Core Lightning unix-socket handling under Docker on Windows hosts (path/volume mapping issue).
- Improved node lock/unlock UX and error messaging when a wallet is already unlocked elsewhere.
- Documented seed phrase and channel backup export/import flow for new node types.
