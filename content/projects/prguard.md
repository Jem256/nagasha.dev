---
title: PRGuard
description: A GitHub App for pull request review readiness and maintainer triage.
date: 2025-09-20
tags: [typescript, bitcoin]
status: active
role: Creator & maintainer
repo: https://github.com/Jem256/prguard
order: 4
---

PRGuard is a GitHub App that checks whether a pull request is actually ready for review — CI green, checklist items complete, no unresolved review threads — and helps maintainers triage a review queue instead of scanning it manually. It grew out of frustration with how much manual bookkeeping open source maintainers (including Polar's) do just to figure out *which* PR to look at next.

## Status

Functional for single-repo use; multi-repo maintainer dashboards are the next milestone.

*Sample notes — replace with real repo activity:*

- PR readiness checks (CI status, checklist parsing, stale-review detection).
- Basic triage view for maintainers across a repo's open PR queue.
- Considering a Concept-ACK/tACK label helper, based on patterns seen in LND review culture.
