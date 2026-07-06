---
title: "git worktree beats stashing when reviewing a PR mid-task"
date: 2025-12-15
tags: [career]
---

Instead of stashing in-progress work to check out a contributor's branch for review, `git worktree add` gives you a second working directory sharing the same `.git`, checked out to whatever branch you need:

```
git worktree add ../polar-review pr-1234-branch
```

Review in `../polar-review`, keep your own work untouched in the original directory, then `git worktree remove ../polar-review` when done. No stash to forget about later.
