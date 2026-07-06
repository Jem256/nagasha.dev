---
title: From civil engineering to Bitcoin open source
description: What actually transferred from surveying sites in Kampala to reviewing Lightning protocol pull requests, and what didn't.
date: 2024-09-14
tags: [career, bitcoin, bitdevs]
featured: true
---

I spent the first part of my career as a civil engineer, working with the Kampala Capital City Authority. If you'd told me then that I'd end up reviewing Lightning Network pull requests for a living, I'd have assumed you meant it as a joke about how different the two fields are. They're less different than I expected — and more different than "just learn to code" advice usually accounts for.

## What actually transferred

**Reading specifications skeptically.** Civil engineering runs on codes and standards — you don't trust that a beam calculation is right because it's written down; you check the load assumptions, the safety factors, the units. Reading a BIP or a BOLT spec rewards the exact same posture: don't trust the prose summary, check the actual numbers and edge cases against what the reference implementation does.

**Site inspections and code review are the same motion.** An inspection is: does the built thing match the drawing, and does the drawing actually satisfy the requirement it claims to? Code review is: does the diff match the stated intent, and does the intent actually solve the problem? The domains don't overlap; the discipline does.

**Working with irreversible constraints.** You can't easily undo poured concrete. You also can't easily undo a mainnet Lightning channel force-close, or a Bitcoin transaction. Both fields train a kind of paranoia about "is this action reversible, and have I actually checked before committing to it" that a lot of software engineering (with its "just redeploy" safety net) doesn't naturally instill.

## What didn't transfer, and had to be learned from zero

Version control, most obviously — but more specifically, the *social* protocol around it: how review culture works, what a Concept ACK means, how to write a commit message someone will thank you for in two years. None of that has a civil-engineering analogue; it had to be learned the slow way, by making the mistakes publicly on real projects.

## The actual path

Self-taught frontend development first — HTML/CSS/JS, freeCodeCamp-style, nights and weekends. Then increasingly drawn into Bitcoin through local meetups, which became BitDevs Kampala. Then, gradually, from "attending the reading group" to "contributing to the software the reading group was reading about" — which is how I ended up on Polar, and eventually into a Btrust Starter Grant that made it a full-time thing rather than a nights-and-weekends one.

If there's a general lesson, it's that a career change doesn't require finding a domain with no prior experience to draw on. It requires being honest about which parts of your prior experience are actually transferable skills, and which parts are just going to have to be learned again from the beginning.
