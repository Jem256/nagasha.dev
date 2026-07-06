---
title: DKMS, kernel upgrades, and the Intel IPU6 camera on my ThinkPad
description: What actually breaks when Ubuntu upgrades the kernel out from under an out-of-tree camera driver, and how to stop dreading it.
date: 2025-06-02
tags: [linux, career]
---

Newer ThinkPads use Intel's IPU6 image processing unit for the built-in camera instead of a plain UVC webcam, which means the camera doesn't work out of the box on Ubuntu without an out-of-tree kernel module — and every kernel upgrade is an opportunity for that module to stop building.

## Why DKMS is in the loop at all

DKMS (Dynamic Kernel Module Support) exists so that out-of-tree modules — ones not shipped in the mainline kernel — get automatically rebuilt against whatever kernel header version is currently installed, instead of being pinned to the exact kernel version they were first compiled against. The IPU6 driver (`ipu6-drivers`, plus the sensor-specific and image-processing userspace pieces) is exactly this kind of module.

Without DKMS, every `apt upgrade` that bumps the kernel would silently leave you with a camera module built for the *previous* kernel — it doesn't error loudly, the module just fails to load, and `lsmod` shows nothing where you expect `intel_ipu6`.

## What actually goes wrong

Two distinct failure modes, both looking identical from the user's side ("camera doesn't show up in Cheese/the browser"):

1. **DKMS rebuild silently fails.** `dkms status` shows the module in an `ERROR` state for the new kernel version, but the system still boots fine using the old module for the old kernel — until you reboot into the new one and it's just absent. Checking `dkms status` after every kernel upgrade, before rebooting, catches this.
2. **Secure Boot signature mismatch.** DKMS-built modules need to be signed to load under Secure Boot. If the MOK (Machine Owner Key) enrollment lapses or the signing step is skipped, the module builds fine but the kernel refuses to load it — a different error, buried in `dmesg`, not in `dkms status`.

## The routine that actually works

```bash
# After any kernel upgrade, before rebooting:
sudo dkms status
sudo dkms autoinstall
# If Secure Boot is on and this is a fresh MOK enrollment:
sudo mokutil --import /var/lib/dkms/mok.pub
```

If `dkms status` shows anything other than `installed` for the current running-and-next kernel versions, don't reboot yet — rebuild first, or you're troubleshooting blind after the fact.

## The general lesson

Out-of-tree kernel modules turn "the distro upgraded my kernel" from a non-event into a checklist item. It's not a reason to avoid newer hardware, but it is a reason to check `dkms status` as a reflex, the same way you'd check a build log before assuming a deploy succeeded.
