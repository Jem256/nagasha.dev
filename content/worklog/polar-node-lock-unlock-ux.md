---
title: Improved node lock/unlock UX and error messaging in Polar
date: 2026-04-02
tags: [polar, lnd]
project: polar
links:
  - label: "Issue #placeholder — confusing unlock error state"
    url: https://github.com/jamaljsr/polar/issues
---

Fixed a confusing error state where attempting to unlock an already-unlocked wallet surfaced a raw gRPC error instead of a clear message. Also tightened up the lock/unlock button states in the UI so they reflect actual node status rather than assumed status.

*Sample entry — replace the issue link with the real one.*
