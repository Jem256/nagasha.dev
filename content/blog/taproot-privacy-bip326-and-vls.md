---
title: Taproot privacy, BIP326, and why signing policy matters more than the curve
description: Notes on BIP326 input privacy, Policy-Based Signing (VLS), and what actually leaks when a wallet signs a Taproot input.
date: 2026-01-22
tags: [bitcoin, lightning, ldk, career]
---

Most explanations of Taproot privacy stop at "it makes multisig look like single-sig on-chain." True, but it undersells where the remaining leaks live once you get into Lightning-specific signing.

## What BIP326 actually constrains

BIP326 standardizes the *pubkey/signature ordering* for Taproot multi-party constructions — MuSig2 key aggregation in particular — so that independent implementations produce byte-identical, indistinguishable outputs for the same logical construction. Without a shared convention here, two wallets doing "the same thing" (a 2-of-2 channel funding output, say) could produce subtly different transaction shapes, which chain analysis can use as a fingerprint even though both are technically "just a Taproot output."

The privacy property isn't in the cryptography — Schnorr/MuSig2 already gives you an aggregate key indistinguishable from a single key:

$$P_{agg} = \sum_{i=1}^{n} a_i P_i$$

where each $a_i$ is a MuSig2 coefficient derived from all participants' public keys, not just an equal-weighted sum. It's making sure every implementation *uses* that indistinguishability the same way, so the metadata around it doesn't reintroduce a fingerprint.

## Where VLS (Policy-Based Signing) fits

Validating Lightning Signer (VLS) separates the *signing* operation from the *node logic* — the signer runs on separate, more trusted hardware and enforces a policy (channel state transitions it will and won't sign) independent of what the node software claims. For Taproot channels specifically, this means the policy layer needs its own understanding of what a "valid" MuSig2 nonce/signature exchange looks like for a given channel state, not just "does this look like a normal Taproot spend."

That's a meaningfully bigger policy surface than pre-Taproot channels, where the signer's job was closer to "is this a valid commitment transaction for the current channel state." With MuSig2, the signer also has to reason about nonce reuse across signing rounds — reusing a nonce is catastrophic for Schnorr, not just bad practice — which pushes more state-tracking into the policy engine itself.

## Onion messaging, briefly

Separately from Taproot, onion messages (BOLT 4's messaging layer, used for offers/BOLT12 and gossip-adjacent use cases) route data through the Lightning network without requiring a payment or a channel to the destination. The privacy property here is different from Taproot's: it's about not revealing the messaging *path*, the way regular onion routing hides the payment path. LDK Node's onion messaging support is what made me actually sit down and read BOLT 4 end to end rather than skimming it — implementing something is still the fastest way to find out what you don't understand about a spec.

## The general takeaway

For privacy-relevant Bitcoin work, the interesting bugs are rarely in the math. They're in the places where two correct implementations diverge in some incidental detail — ordering, padding, retry behavior — and that divergence becomes a fingerprint. BIP326 is a good example of a whole BIP whose content is "stop being incidentally distinguishable."
