  
# How to install:
1. [Download](https://scriptcraftjs.org/) and install the ScriptCraft plugin (it will generate a few folders inside the root folder of the server after you reload)  
2. Download Bitblocks.
[Download the zip](https://github.com/jordigoyanes/BitBlocks/archive/master.zip) and extract it. Paste Bitblocks-master folder inside serverRootFolder/ScriptCraft/plugins  
If you are doing this from terminal, you can do ``` git clone https://github.com/jordigoyanes/BitBlocks.git``` from the serverRootFolder/ScriptCraft/plugins directory.  
Do the ``/reload`` or ``/js refresh`` command to apply changes.
3. Generate a config file. You need to setup Bitblocks with a custom configuration file for your server. 
You can use the online config generator: http://config.netlify.com  
Paste the generated bitblocks-config.json file inside ServerRootFolder. Then reload the server with ``/reload ``

## Breaking down configuration parameters: 
- **RTWire User and RTWire Pass**: You need to setup mainnet credentials inside RTWire's console(must be logged in). Click on Credentials and then on Create to get a new user and pass.  
- **Enable Scoreboard**: Leave selected (true), if you want to show a sidebar scoreboard to the player containing their bitcoin wallet balance. Players can also see their wallet balance and andress with the /wallet command.  
- **Enable Land Market**:
This will enable the Land Market feature where people can buy chunks of land with their bitcoin wallet. The land will be protected from griefing and allows adding friends as co-owners. [Read how to use Land Market commands](https://github.com/jordigoyanes/LandProtect/blob/master/README.md).
If Land Market is enabled, you must setup:  
-- **Price of 1 chunk of land in SATOSHIS** Like it says, this is the price of 1 chunk in SATOSHIS when buying land in the Land Market.  
-- **Account ID for land sales** This is the account ID for the account that will receive all the bitcoins people send when buying a chunk of land.  
- **Enable Villager Market**: This will enable the Villager Market which is a custom inventory that shows up when right clicking a villager that is filled with items player can buy with their bitcoin wallet.  
If Villager Market is enabled, you must setup:  
-- **Account ID for villager market sales** This is the account ID for the account that will receive all the bitcoins people send when buying items using the Villager Market.
