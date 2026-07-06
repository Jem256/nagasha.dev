---
title: Reproducing BlueWallet's Android build from a Windows machine
description: Getting a bit-for-bit reproducible BlueWallet APK using Docker on WSL2 — proxy TLS, line endings, and Gradle config, in that order of pain.
date: 2025-08-19
tags: [reproducible-builds, docker, linux, career]
featured: true
---

Reproducible builds matter for wallet software specifically because users are trusting a binary, not source code, with their keys. If two people running the documented build steps get byte-different APKs, that trust has a hole in it. Verifying BlueWallet's Android reproducible build pipeline from a Windows laptop — instead of the native Linux environment it's designed for — surfaced three unrelated problems, in this order.

## Problem 1: corporate proxy TLS breaks the Docker build

The reproducible build runs entirely inside Docker, pinning exact package and NDK versions. On a network behind a TLS-inspecting corporate proxy, `apt-get`/`npm` calls inside the container failed with certificate verification errors — the proxy's own CA cert isn't in the container's trust store, and it has no way to be, since the whole point of the pinned Docker image is that it doesn't fetch arbitrary configuration from the host.

Fix: export the corporate root CA and inject it explicitly via a Docker build-arg / `COPY` step scoped to a local override, kept *out* of the reproducible build's own Dockerfile so it doesn't affect anyone else's rebuild:

```dockerfile
# local-override.Dockerfile — not part of the reproducible pipeline itself
FROM bluewallet-build-base
COPY corporate-ca.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
```

## Problem 2: line endings

Git on Windows defaults to `core.autocrlf=true`, silently converting `LF` to `CRLF` on checkout. Some of the shell scripts the Docker build invokes started failing with `bad interpreter` errors — the shebang line looked fine to the eye but had a trailing `\r` that `/bin/sh` doesn't strip.

```
git config core.autocrlf false
git config core.eol lf
```

set *before* cloning (a `.gitattributes` fix after the fact doesn't retroactively fix files already checked out with the wrong line endings — you need a fresh checkout or an explicit re-normalize).

## Problem 3: Gradle inside WSL2 vs. Docker Desktop's WSL2 backend

The Gradle build cache directory defaulted to a path under the Windows-side home directory (`/mnt/c/Users/...`) rather than the WSL2 Linux filesystem. Gradle daemon start-up times went from seconds to multiple minutes, because every cache read/write crossed the 9P filesystem boundary between Windows and the WSL2 VM — the same boundary that caused the CLN unix-socket issue I wrote about separately.

Moving `GRADLE_USER_HOME` to a path under the native WSL2 filesystem (`~/.gradle`, not `/mnt/c/Users/.../gradle`) fixed it entirely.

## Verifying the result

After all three fixes, `sha256sum` on the built APK matched the checksum published against the tagged release — the actual point of the exercise. None of the three problems were specific to BlueWallet's build; they're the standard tax of running a Linux-first reproducible-build pipeline from Windows, and worth knowing about before you assume a build script itself is broken.
