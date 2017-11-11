var getNewAccount = require('./rtwireAPI.js').getNewAccount;
var getNewBtcAddress = require('./rtwireAPI.js').getNewBtcAddress;
var updateBalance = require('./rtwireAPI.js').updateBalance;
var commando = require('../../commando/commando.js').commando;

/*
When the player joins, the plugin will check if its Player UUID is in the database.
If not, it requests a new Account ID and Bitcoin address from RTWire and stores it in serverdb.json
Then it shows his scoreboard.
*/
var playerJoin = function(event){
  var player = event.getPlayer();
  var playerUUID = player.uniqueId;
  var alldata = scload('serverdb.json');

  if(alldata === null) {
        print("Bitblocks: Creating database(serverdb.json) to store player data...")
        alldata = {};
        alldata.chunks = {};
        alldata.wallets = {};
        scsave(alldata, 'serverdb.json');
    }

  if(alldata.wallets[playerUUID] == null){
    print("Bitblocks: Creating account id and bitcoin address for new player...")
    var newAccID = getNewAccount();
    var btcAddress = getNewBtcAddress(newAccID);
    alldata.wallets[playerUUID] = {};
    alldata.wallets[playerUUID].AccountID = newAccID;
    alldata.wallets[playerUUID].BTCaddress = btcAddress;
    scsave(alldata, 'serverdb.json');
    WelcomeMsg(player, alldata.wallets[playerUUID].BTCaddress);
    var newBalance = updateBalance(player, alldata)
    updateScoreboard(player, newBalance)

  }else{
    print("Bitblocks: Loading existing wallet from the database(serverdb.json)...")
    var newBalance = updateBalance(player)
    WelcomeMsg(player, alldata.wallets[playerUUID].BTCaddress);
    updateScoreboard(player, newBalance)
  }
}

events.playerJoin(playerJoin);


var WelcomeMsg = function(player, btcAddress){
		echo(player, "WELCOME TO BITBLOCKS!".bold().gold())
		echo(player, "BITCOIN ADDRESS: https://blockchain.info/address/" + btcAddress);
		//echo(player, "Official Website: https://bitblocks.netlify.com/");
}


commando('wallet', function(args, player) {
  var alldata = scload('serverdb.json');
	var playerUUID = player.uniqueId;
	var btcAddress = alldata.wallets[playerUUID].BTCaddress;
  echo(player, "WALLET INFO".bold().green())
  echo(player, "------------------------------------------------".green())
	echo(player, "Deposit Bitcoin Address: https://blockchain.info/address/".aqua() + btcAddress);
	// echo(player, "Official Website: https://bitblocks.netlify.com/");
	var newBalance = updateBalance(player);
	echo(player, "Balance: ".bold().gold() + newBalance.toString());
  updateScoreboard(player, newBalance);
  echo(player, "Use /bithelp for more info".gray())
});
