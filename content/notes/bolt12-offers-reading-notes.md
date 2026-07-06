---
title: BOLT12 offers — reading notes
description: Working notes ahead of a BitDevs Kampala session, not a polished explainer.
date: 2026-06-20
tags: [lightning, ldk, bitdevs]
---

Rough notes, not a finished piece — mostly for my own reference before presenting.

- Offers are reusable, unlike BOLT11 invoices — a single offer (encoded as a `lno1...` string) can be paid multiple times by different payers.
- Uses onion messages for the invoice-request/invoice round trip instead of requiring a direct channel or an out-of-band HTTP call.
- Blinded paths hide the actual recipient node behind a chain of intermediate hints — worth comparing directly against how onion routing hides the *payment* path, since it's a related but distinct privacy mechanism.
- Still need to check: how do refunds work when an offer is a "send" rather than a "receive" offer? Follow up before the session.
