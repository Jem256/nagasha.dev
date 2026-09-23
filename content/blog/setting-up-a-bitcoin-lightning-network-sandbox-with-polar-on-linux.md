---
title: "Setting Up a Bitcoin/Lightning Network Sandbox with Polar on Linux"
date: "2024-02-06"
tags: ["bitcoin", "polar", "lightning"]
draft: false
canonicalUrl: "https://medium.com/@nagasha/setting-up-a-bitcoin-lightning-network-sandbox-with-polar-on-linux-9bf8ef2f1d5a"
---

![Polar website](https://cdn-images-1.medium.com/max/1024/1*BPMAfFIjwUWt9uwdSJBJ2A.png)

Polar website

The [Bitcoin Lightning Network](https://lightning.network/) is a second-layer scaling solution built on top of the Bitcoin blockchain. It is designed to enable faster and cheaper transactions. Developing and testing Lightning Network applications can be challenging, but tools like [Polar](https://lightningpolar.com/) can simplify the process by providing a user-friendly environment. This article will guide you through the process of setting up a Bitcoin Lightning development environment on Regtest using Polar.

**Prerequisites**

1.  Docker Server (Installation guide [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04))
2.  Docker Compose (Installation guide [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04))

**Installing Polar**

Polar is a tool developed by Lightning Labs to create and manage Lightning Network nodes for development and testing purposes. To install Polar on Linux, follow these steps:

Download the Polar application package from [here](https://lightningpolar.com/).

Because the Polar application is an AppImage package, we will also install the AppImageLauncher to ease the installation of our Polar package.

```
sudo add-apt-repository ppa:appimagelauncher-team/stable
sudo apt-get update
sudo apt-get install appimagelauncher
```

When the above is complete, double-click the _“.AppImage ”_ package you just downloaded and that will launch your polar application.

**Setting Up Lightning Nodes**

When you run Polar, the following welcome screen will appear.

![Polar welcome screen](https://cdn-images-1.medium.com/max/1024/0*yEMyhq1A6v5KeC7Z)

Polar welcome screen

Click either the orange “Create a Lightning Network” button in the middle, or Create Network in the top right corner.

![Create a LIghtning Network](https://cdn-images-1.medium.com/max/1024/1*LMaeMMMAT06VQhmw55xaSw.png)

Create a Lightning Network

After clicking Create Network, the above screen will appear. You can specify how many of each node implementations your network will be composed of. For this guide, create a new Lightning Network with the following parameters:

```
Network Name = My Network
Number of Managed Nodes:
LND = 2
Core Lightning = 0
Eclair = 0
Bitcoin Core = 1
```

**Note:** You will always need at least one Bitcoin Core node!

After clicking the orange Create Network button, Polar will display this new screen.

![New Network](https://cdn-images-1.medium.com/max/1024/1*XhEckN8LanRoJpA043aKiA.png)

New Network

Polar allows you to play with any version for any implementation, including those in beta by providing the Network Designer Tab on the far right in the above screenshot. You can add a node of any version by dragging and dropping it onto the canvas to add it to the network you created.

Initiate your local network by clicking the Start button located in the top right corner, highlighted in orange. Allow a few seconds for the nodes to initialize; you’ll know the process is complete when the indicator lights turn green. After this, select the “Alice” LND node to access the screen tabs below.

![](https://cdn-images-1.medium.com/max/385/1*ji-tJTMJ6T3IrX2JzmP2-g.png)

![](https://cdn-images-1.medium.com/max/385/1*aTjBhEUctDINHLb3mA1g5g.png)

![](https://cdn-images-1.medium.com/max/385/1*TmiOFTTcMzE03hBnPDFuew.png)

Overview of the Info, Connect, and Actions tabs available for each node selected

The details on this screen are mostly straightforward. Currently, the local regtest instance is only at Block Height = 1, resulting in both Alice’s Confirmed Balance and Unconfirmed Balance being 0 sats. To change this, navigate to the Actions tab for Alice, confirm that Deposit Funds is configured to 1,000,000 sats, and then click on Deposit.

Starting with 1,000,000 sats in test environments like our local regtest instance provides a reasonable amount of satoshis for testing various Bitcoin functionalities without needing to worry about small fractions constantly. It offers enough satoshis to facilitate transactions, create different spending scenarios, and observe their effects.

**Polar’s Mining Simulation**

To mine more blocks, click the backend1 node, in the actions tab. A mine button will be visible.

![](https://cdn-images-1.medium.com/max/1024/1*kSzBmpNSKg1HTABm4NuitQ.png)

Mining blocks in Polar

While Polar’s mining simulation might appear similar to real-world mining, it’s not generating real Bitcoin on the main Bitcoin network. Polar creates a regtest environment, which is a separate, simulated network for testing purposes. Regtest coins have no real-world value and cannot be transferred to the main Bitcoin network.

**Create and Pay an Invoice**

Having funded Alice’s on-chain wallet, the next step is to open a channel. Click on “Open Channel” -> “Outgoing,” choose Bob as the destination, keep the default Capacity at 250,000 sats, and then click the orange “Open Channel” button.

After successfully opening the channel, select the new green line connecting Alice and Bob’s LND nodes to view the channel details below.

![Channel Details](https://cdn-images-1.medium.com/max/1024/1*GX2GTL3EzTAQGvTW4Z1ReQ.png)

Channel Details

Hover over the green dot on Alice’s node to reveal “Source,” and over the blue dot on Bob’s node to display “Destination.” This indicates that the side with a Source Balance of 246,530 sats is Alice’s, while the side with a Destination Balance of 0 sats belongs to Bob.

Since Bob currently has no Destination Balance, right-click on his node to open an Actions panel. Choose “Create Invoice,” accept the default Amount of 50,000 sats, and click the orange “Create Invoice” button. If done successfully, this action should generate the following screen.

![](https://cdn-images-1.medium.com/max/1024/1*MjkryY5FD9wdbQxR6oM-YA.png)

Create Invoice

Select “Copy & Close,” then right-click on Alice’s node and choose “Pay Invoice.” Paste the invoice copied into the Bolt 11 Invoice field and click the orange “Pay Invoice” button. Upon completion, the dashboards for Alice, Bob, and the channel will resemble the following:

![](https://cdn-images-1.medium.com/max/387/1*c2R4M1zUOF_t7tIRurRK1Q.png)

![](https://cdn-images-1.medium.com/max/387/1*4FNrAMlXD0ZirkrUzY0NOg.png)

![](https://cdn-images-1.medium.com/max/387/1*2nhNP7EM-UU84uLbilrWCw.png)

Overview of the Info tabs for the Alice, Bob, and bitcoin core nodes after Invoice Payment

Congratulations! You’ve made your first successful Lightning Network payment on regtest!

> You may have noticed a “Launch” button below Terminal in the Actions tab of the different nodes. You can run also cli commands directly on each node you created by launching its terminal.

Polar makes setting up a Bitcoin-Lightning development environment on regtest a breeze. Its intuitive interface and powerful features provide a valuable sandbox for developers to test their applications and gain practical experience working with the Lightning Network.

I hope this article serves as a helpful guide for setting up your Bitcoin-Lightning development environment with Polar. Feel free to explore the additional resources and documentation available within the Lightning ecosystem to further your knowledge and development efforts.
