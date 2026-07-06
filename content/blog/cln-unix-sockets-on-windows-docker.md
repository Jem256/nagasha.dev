---
title: "Core Lightning's unix socket, Docker volumes, and Windows"
description: Why CLN's RPC socket silently breaks inside Docker Desktop on Windows, and what actually fixes it.
date: 2026-03-12
tags: [polar, cln, docker, linux]
featured: true
---

Core Lightning (CLN) talks to `lightning-cli` over a unix domain socket at `lightning-rpc`, sitting inside its data directory. That's an unremarkable design choice on Linux and macOS. On Windows, it's where things get interesting.

## The symptom

Polar mounts each node's data directory as a Docker volume so state survives container restarts. On Linux hosts, this works exactly as you'd expect — the socket file appears on the host filesystem, bind-mounted straight into the container. On Windows, running Docker Desktop with the WSL2 backend, `lightning-cli` inside the container would intermittently fail to connect to its own node, with:

```
lightning-cli: Connecting to 'lightning-rpc': No such file or directory
```

The socket file was there — `ls` inside the container showed it. But not always, and not from a fresh boot.

## Why

Unix domain sockets aren't ordinary files. When a bind mount crosses two different filesystem drivers — the 9P-based filesystem WSL2 uses to expose Windows-side paths into the Linux VM, and the container's overlay filesystem — socket special files can fail to propagate correctly. The file entry shows up, but its `AF_UNIX` semantics don't survive the trip; from inside the container it's often just an empty regular file.

This isn't Docker-specific weirdness on Linux, where bind mounts stay on the same VFS the whole way through. It's specific to the extra translation layer WSL2 introduces for any path that lives under `/mnt/c/...` (a Windows-side path exposed into Linux).

## The fix

Two changes, together:

1. Keep the CLN data directory — and specifically the socket — on the **Linux side** of the WSL2 filesystem (e.g. under `~/.polar/...` inside the WSL2 distro), never under `/mnt/c/`. Docker Desktop's WSL2 integration handles native-Linux-path volumes without crossing the 9P boundary.
2. Where a Windows-side path is unavoidable (some Polar configs default to a path derived from the user's home directory), have CLN bind its RPC socket to a fixed in-container path instead of inheriting the host-relative one, using `--rpc-file` as an explicit CLN startup flag.

```yaml
services:
  cln:
    volumes:
      - cln-data:/home/clightning/.lightning # named volume, not a bind mount to a Windows path
    command: >
      lightningd --network=regtest --rpc-file=/home/clightning/.lightning/lightning-rpc
```

Named Docker volumes are stored inside the Docker VM itself, not translated through a host bind mount at all — which sidesteps the WSL2 socket problem entirely. That's the version that shipped in Polar.

## The general lesson

If a Docker volume misbehaves specifically on Windows and specifically for socket or FIFO files, suspect the filesystem translation layer before suspecting your application. `docker exec` into the container and check `stat` on the file — a regular file where you expect a socket is the tell.
