---
title: "Understanding Output Script Descriptors in Bitcoin"
date: "2024-05-03"
tags: ["bitcoin"]
draft: false
canonicalUrl: "https://medium.com/@nagasha/understanding-output-script-descriptors-in-bitcoin-8af8f20e0008"
---

![](https://cdn-images-1.medium.com/max/579/1*OPTQq0cbCdP5JcIrfUBezQ.jpeg)

[Source](https://www.globalbrandsmagazine.com/a-technical-overview-of-bitcoins-miniscript-descriptors/)

Output descriptors are simple, human-readable strings that fully describe a set of Bitcoin addresses. Descriptors offer a user-friendly approach to managing scriptPubKey, the script that controls how a Bitcoin output can be spent. They contain all the information needed to “solve” (spend) the associated script. This format was proposed to improve upon the existing methods of address generation, which often lacked consistency and required additional information to reproduce accurately.

Descriptors are visible with several commands such as listunspent and getaddressinfo For instance;

```
$ bitcoin-cli getaddressinfo youraddress
{
  "address": "str",
  "scriptPubKey": "hex",
  "ismine": true|false,
  "solvable": true|false,
  "desc": "str",
  "iswatchonly": true|false,
  "isscript": true|false,
  "iswitness": true|false,
  "pubkey": "hex",
  "iscompressed": true|false,
  "ischange": true|false,
  "timestamp": xxx, // numeric
  "hdkeypath": "str",
  "hdseedid": "hex",
  "hdmasterfingerprint": "hex",
  "labels": [
    "str"
  ]
}
```

The "desc" field shows the descriptor of an address.

Example of an output descriptor:

```
pkh([d34db33f/44'/0'/0']03efdee34c0009fd175f3b20b5e5a5517fd5d16746f2e635b44617adafeaebc388)#4ahsl9pk
```

A descriptor is broken into several parts as seen below;

```
function([derivation-path]key)#checksum
```

**Function:** This is the function that is used to create an address from a given key. In this case, we have pkh, which is the standard P2PKH legacy address. Similarly, a P2PK address would use pk and a P2WPKH address would use wpkh.

**Derivation Path:** This describes the specific component being exported from an HD wallet. In our example above, it’s a seed with a fingerprint d34db33f followed by the 0th child of the 0th child of the 44th child (44'/0'/0') of that seed.

It’s important to highlight that while derivation paths typically include a fingerprint, you can make it up if it's not provided. However, maintaining consistency with an existing fingerprint is crucial, as it ensures compatibility when returning to the device that generated it.

**Key:** This refers to the essential data being transferred, which could be a single key or a set of keys. These keys might take various forms, such as an extended public or private key, a public key associated with an address, or a collection of addresses for a multi-signature setup. Regardless of the specific type, these keys serve as the foundational information for the transfer, while the function outlines how to utilize them.

**Checksum:** Descriptors are supposed to be human-transferrable. Attaching a checksum to descriptors protects against typos or copy-paste errors. Every RPC (Remote Procedure Call) in Bitcoin Core will include the checksum in its output. However, only specific RPCs, like deriveaddresses and importmultirequire checksums on input. In cases where a descriptor lacks a checksum, you can compute it using the getdescriptorinfo RPC.

### Usage

Output descriptors are used in several key areas of Bitcoin wallet management:

*   Address Generation: Wallets use descriptors to generate addresses according to the specified script and derivation rules.
*   Wallet Import and Export: Descriptors can be used to export wallet information and import it into another wallet software without loss of fidelity.
*   Backup: By backing up a descriptor along with seed phrases, users ensure they can recover not only their keys but also the exact wallet structure and script information.

### **Resources**

*   [bitcoin/doc/descriptors.md at master · bitcoin/bitcoin](https://github.com/bitcoin/bitcoin/blob/master/doc/descriptors.md)
*   [What are output descriptors?](https://bitcoin.stackexchange.com/questions/99540/what-are-output-descriptors)
*   [RPC API Reference - Bitcoin](https://developer.bitcoin.org/reference/rpc/index.html)
