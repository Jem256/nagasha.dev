---
title: "How To Build and Broadcast A Bitcoin Transaction Using BitcoinJS (bitcoinjs-lib) on Testnet"
date: "2024-02-29"
tags: ["bitcoin"]
draft: false
canonicalUrl: "https://medium.com/@nagasha/how-to-build-and-broadcast-a-bitcoin-transaction-using-bitcoinjs-bitcoinjs-lib-on-testnet-2d9c8ac725d6"
---

![](https://cdn-images-1.medium.com/max/200/1*vmVa9OwTJ_Ci0168ATJAOw.png)

bitcoinjs-lib

Creating bitcoin transactions can feel like a daunting task. However, the [bitcoin-js library](https://github.com/bitcoinjs/bitcoinjs-lib) stands out as an exceptional Node.js library designed for a variety of Bitcoin operations including building transactions. This open-source library empowers developers to interact with the Bitcoin blockchain through JavaScript/Typescript, making it a versatile tool for creating and manipulating transactions programmatically. In this guide, we’ll explore the process of building a simple transaction using this popular JavaScript library.

> **Important:** **This guide operates on the Testnet bitcoin network. This means that any coins and transactions carried out during this process hold no real-world value.**

### **Prerequisites**

1.  NodeJS
2.  A Bitcoin Core Node configured to run on testnet

### Create an Unspent Transaction Output ( UTXO) to spend

A UTXO refers to the output of a transaction that has not been spent or used in a subsequent transaction. Creating a transaction in Bitcoin means that you are spending a previous transaction. To create a UTXO on Testnet, you need to [create a wallet](https://medium.com/@bitcoindeezy/bitcoin-basics-programming-with-bitcoinjs-lib-4a69218c0431), address and send testnet funds to that address using a [faucet](https://bitcoinfaucet.uo1.net/)

After creating this UTXO, store the following information in a secure .env file

```
privateKeyWIF = 'your_private_key_in_wallet_import_format'
previousTxid = 'transaction_id'
previousHex ='transaction_hex'
```

### Create and Broadcast A Simple Transaction

1.  **Setting Up Your Environment:**  
    Start by installing bitcoinjs-lib in your project. You can use npm (Node Package Manager) for this:

```
npm install bitcoinjs-lib
```

In order to manage SECP256k1 keypairs, you also need to install the ecpair and tiny-secp256k1 modules.

ECPair stands for Elliptic Curve Pair. In Bitcoin, it's commonly used to represent an ECDSA (Elliptic Curve Digital Signature Algorithm) key pair. This library provides methods for creating, importing, and manipulating elliptic curve key pairs, which are essential for cryptographic operations such as digital signatures and public-key encryption.

tiny-secp256k1 is a lightweight library used by BitcoinJS for low-level elliptic curve operations, specifically on the secp256k1 curve. This includes key pair generation, signature generation and verification, public key recovery and others.

To install these libraries in your project, use the node package manager commands below.

```
npm install ecpair

npm install tiny-secp256k1
```

**2\. Import the libraries to your project:**

```
const bitcoin = require('bitcoinjs-lib')
const ECPairFactory = require('ecpair').default;
const ecc = require('tiny-secp256k1');
```

**3\. Set the network and ECPair:**

```
const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.testnet
```

**4\. Create a transaction**

```
// create a simple transaction
async function createTransaction(
privateKeyWIF, 
previousTxid, 
receiverAddress, 
previousHex
) {

//  take the WIF-encoded private key (privateKeyWIF) and network information 
// and create a keyPair that we'll use for signing the transaction
    const keyPair = ECPair.fromWIF(privateKeyWIF, network);

// create a transaction builder and pass the network. The bitcoin-js 
// Psbt class is used to do this. 
    const txb = new bitcoin.Psbt({ network });
    
// while these are default version and locktime values, you can set 
// custom values depending on your transaction
    txb.setVersion(2);
    txb.setLocktime(0);

// add inputs: previous transaction Id, output index of the funding transaction
// and, since this is a non segwit input, we must also pass the full previous 
// transaction hex as a buffer 
    txb.addInput({
        hash: previousTxid,
        index: 0,
        nonWitnessUtxo: Buffer.from(previousHex, 'hex'),
    });

// add outputs as the buffer of receiver's address and the value with amount
// of satoshis you're sending.
    txb.addOutput({
        script: Buffer.from(receiverAddress, 'hex'),
        value: 20000,
    }); // Sending 0.0002 BTC

// sign with the generate keyPair and finalize the transansction 
    txb.signInput(0, keyPair);
    txb.finalizeAllInputs();

//  extract the transaction and get the raw hex serialization
    const tx = txb.extractTransaction();
    return tx.toHex();
}

// this calls and executes the function above and then prints 
// the transaction hex
createTransaction(privateKeyWIF, previousTxid, previousHex, myAddress)
    .then((transactionHex) => {
        console.log('Transaction Hex:', transactionHex);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });
```

Your transaction is now ready to be broadcasted to the Bitcoin network!

**5\. Broadcast a transaction**

Broadcasting a transaction refers to the process of propagating a signed transaction to the network so that it can be included in the next block by miners. Broadcasting is essential for making a transaction visible to the decentralized network of nodes, allowing miners to verify and include it in the blockchain.

To broadcast a transaction on the Bitcoin Testnet, we will use the bitcoin-clicommand-line tool, which is part of the Bitcoin Core software. Ensure that your Bitcoin Core node is configured to run on the Testnet and that it’s fully synced with the Testnet blockchain.

With your bitcoin core node running, open your terminal and run the following command;

```
bitcoin-cli -testnet sendrawtransaction <transactionHex>
```

The _transactionHex_ used above is what we obtained from step 4 of creating a transaction. If the transaction is successfully broadcasted, the command will return a transaction ID (TxID). You can also check the status of your transaction using various blockchain explorers for the Testnet.

Broadcasting a transaction is a essential part of the decentralized nature of the Bitcoin network, ensuring that all participants have visibility into the transactions occurring on the network and facilitating the creation of a consensus-driven, immutable ledger.

### Conclusion

Building a transaction using bitcoinjs-lib provides a hands-on experience in understanding the intricacies of bitcoin transactions. As you explore further and experiment with different inputs, outputs, and transaction structures, you’ll discover the power and flexibility that this library offers.

### Resources:

*   [GitHub - bitcoinjs/bitcoinjs-lib: A javascript Bitcoin library for node.js and browsers.](https://github.com/bitcoinjs/bitcoinjs-lib)
*   [Bitcoin Programming with BitcoinJS, Bitcoin Core and LND](https://bitcoinjs-guide.bitcoin-studio.com/bitcoinjs-guide/v5/part-two-pay-to-public-key-hash/p2pkh/p2pkh_simple_1_1#_creating_utxo_to_spend)
*   [Building Your Own Encrypted Wallet: A Developer’s guide to playing in the mud.](https://medium.com/@idogwuchi/building-your-own-encrypted-wallet-a-developers-guide-to-playing-in-the-mud-61cde41ceed9)
*   [Bitcoin Basics: Programming with bitcoinjs-lib](https://medium.com/@bitcoindeezy/bitcoin-basics-programming-with-bitcoinjs-lib-4a69218c0431)
