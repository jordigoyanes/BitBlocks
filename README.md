<img align="middle" src="https://i.imgur.com/lYWW0YY.png" border="0">
A Minecraft plugin designed to achieve a game economy using Bitcoin. It uses the off-chain RTWire(https://rtwire.com) API endpoints to do this, so anyone can setup this for their own server.  Please read the RTWire docs(https://rtwire.com/docs) for more information.  
Bitblocks needs ScripCraft (https://scriptcraftjs.org) as dependency.

## Every player has a wallet
![Screenshot](http://i.imgur.com/Tss5tWT.png)
RTwire uses Account IDs to make off-chain transactions, but it is also able to link each account to a new generated bitcoin address. So **every player has their own wallet to make instant transactions between players and also deposit from an external bitcoin wallet**. Players can withdraw to an external wallet paying the miner fee + small RTwire fee. Here the fun point is to make it circulate inside the server.  
 
The balance is shown in a player scoreboard in **bits**  

## Villager Market
![Screenshot](http://i.imgur.com/8aJOBxV.png)
![Screenshot](http://i.imgur.com/7DA1QIH.png)
**Players can open the "Villager Market" by right-clicking any villager.**
I recommend you to use the collected funds to pay for the expensive server costs, but you can make it circulate to wherever you want.

## Land Market
Players can buy land with their bitcoin wallet. Claimed land will be protected from griefing. Players can abandon the land. They can also grant building permission to friends they trust (co-owner) but only the original owner can kick.
It basically works by placing a sing on the chunk you want, and typing betwen # characters your desired land name, like #My mansion# and you can use the 4 lines of the sign. Land name is changable.
![Screenshot](https://i.imgur.com/NT9oPL6.png)
Land Market comes from the **LandProtect repository**. Read the [README](https://github.com/jordigoyanes/LandProtect/blob/master/README.md) to learn how to use it. You can also [watch this animated GIF](https://imgur.com/LEMJcMe). 

## Built on ScriptCraft
Scriptcraft is a java minecraft plugin to bridge our javascript with the Bukkit API. **All the player data is stored in a JSON database that comes with ScriptCraft**.  It is called serverdb.json and will be stored in the server's root folder.   
[Download ScriptCraft](https://scriptcraftjs.org)  
## Commands:
**/send [amount in bits] [player  name]** Sends instantly bits to an another online player (no fees).  
**/transfer [amount in bits] [bitcoin address]**(NOT working yet) Sends bits to external bitcoin wallet.
(fees = miner fee + 1% of amount to RTWire).  
**/wallet** Shows bitcoin address in blockhain.info link, shows balance and refreshes the scoreboard if necessary.  
**/bithelp** Shows commands.
## Instructions
1-Download and install ScriptCraft plugin (it will generate a few folders inside the root folder of the server)  
2-Open a terminal, go to serverroot/scriptcraft/plugins and do a git clone so you get latest version of BitBlocks from GitHub.
```
git clone https://github.com/jordigoyanes/BitBlocks.git
```
That should add a folder called BitBlocks containing this full repository, including the README. This is important because a different file structure will make this plugin fail. It is meant to be contained so it's easier to update. And you know, open-source means incoming updates.

3- Now from your minecraft server terminal, execute **/reload** or **/js refresh()** so ScriptCraft enables BitBlocks.  
#### You have to edit a few variables to make this plugin work: 
**var user and var pass**: (Inside rtwireAPI.js) You need to setup mainnet credentials inside RTWire's console(must be logged in). Click on Credentials and then on Create to get a new user and pass. Makes sure it's surrounded by commas when you paste it on the file.  
**var MarketAccountID:**   (Inside market.js) This is the accountID for the account that will receive all the bitcoins people send when buying item using the Market. It's an integer so paste it **without** commas.  
**var landsalesAccID:**  (Inside landmarket.js) This is the accountID for the account that will receive all the bitcoins people send when buying a chunk of land. (Integer).  
**var landPrice:**  (Inside landmarket.js) This is the price of 1 chunk in SATOSHIS. It's set as 200 satoshis (2 bits) by default.  
### Join discord:
[<img src="http://torturedguild.org/wp-content/uploads/2016/08/discord.png" height="100" width="350">](https://discord.gg/hchFcqS)

## LICENSE: [MIT](https://github.com/jordigoyanes/BitBlocks/blob/master/LICENSE)
