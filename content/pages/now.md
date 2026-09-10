---
title: Now
updated: 2026-09-10
---

*What I'm currently doing — inspired by [nownownow.com](https://nownownow.com/about).*

## Working on

I'm working full-time on Bitcoin open source.

Most of my time goes into [Polar](https://github.com/jamaljsr/polar), a desktop application for spinning up local Bitcoin and Lightning Network environments. My current focus areas are:

- **Core Lightning on Windows:** improving the reliability of CLN nodes on Windows, particularly around Docker, filesystem differences, and the platform-specific issues that make local development harder.
- **Node locking and unlocking:** improving how Polar handles LND wallet state, so node lifecycle actions behave predictably and accurately reflect the underlying node state.
- **Seed phrases and channel backups:** making recovery flows easier to exercise locally, so developers can test wallet restoration and channel recovery safely on regtest.

## Reading / learning

**Bitcoin**

- The [Service Discovery (SeD) Protocol](https://github.com/OpenBitcoinAfrica/ServiceDiscoveryProtocol/pull/3) draft from Open Bitcoin Africa. It's a Nostr-based spec that lets Bitcoin financial services advertise what they offer in each region and build reputation through attestations, without touching settlement itself.
- Going deeper into Lightning implementations LND, Core Lightning and Eclair
- Following Bitcoin Core PRs and softfork proposals, and learning how activation actually works in practice

**Books**

- [*Where Rivers Go to Die*](https://www.goodreads.com/book/show/60657552-where-rivers-go-to-die) by Dilman Dila
- [*I Who Have Never Known Men*](https://www.goodreads.com/book/show/11996.I_Who_Have_Never_Known_Men) by Jacqueline Harpman

## BitDevs Kampala

I organise [BitDevs Kampala](https://www.bitdevskla.org/), a monthly Socratic-style reading group where we work through recent Bitcoin and Lightning technical developments: mailing list posts, BIPs, notable PRs, and research.

Going to the very first meetup is what pulled me into Bitcoin open source full-time, so keeping it going matters a lot to me.