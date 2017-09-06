# BitBlocks

A Minecraft plugin designed to achieve a game economy using Bitcoin. It uses the off-chain [RTWire](https://rtwire.com/) API endpoints to do this, so anyone can setup this for their own server.  
## Instructions
### API setup:
Go to RTWireapi.js and edit the **user** and **pass** variables. You can generate both user and pass in your RTWire console.
The RTWireapi.js file contains basic functions you can use to make infinte use of the RTWire endpoints, for example: *sendTx(Account ID of sender, Account ID or BTC wallet of receiver, amount in satoshis, if receiver is bitoin wallet(boolean))*
### Variable setup:
You need to setup the Market's Account ID, which is where all funds will go and is an integer variable called MarketAccountID in the market.js file.**

## Every player has a wallet
![Screenshot](http://i.imgur.com/Tss5tWT.png)
RTwire uses Account IDs to make off-chain transactions, but it is also able to link each account to a new generated bitcoin address. So **every player has their own wallet to make instant transactions between players and also deposit from an external bitcoin wallet**. Players can withdraw to an external wallet paying the miner fee + small RTwire fee. Obviously the fun point is to make it circulate inside the server.  
 
The balance is shown in a player scoreboard in **bits**  

## Villager Market
![Screenshot](http://i.imgur.com/8aJOBxV.png)
![Screenshot](http://i.imgur.com/7DA1QIH.png)
**Players can open the "Villager Market" by right-clicking any villager.**
I recommend you to use this funds to pay for the expensive server costs, although you can make it circulate to wherever.

**Land Market and Player Trading coming soon.**

## Built on ScriptCraft
Scriptcraft is a java minecraft plugin to bridge our javascript with the Bukkit API. All the player data is stored in a JSON database that comes with ScriptCraft.   
[Download ScripCraft](https://scriptcraftjs.org)  
Once in your server, it will generate a few folders. Put the Bitblocks folder inside serverroot/scriptcraft/plugins.  
If there's anything in this plugin code you don't like or doesn't suit your server idea, you can delete it easily and watch your changes with reloading.
