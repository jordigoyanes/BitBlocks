var alldata = scload('serverdb.json');
var configFile = scload('bitblocks-config.json')
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
  if(alldata === null) {
      alldata = {};
      alldata.chunks = {};
      alldata.wallets = {};
      scsave(alldata, 'serverdb.json');
}
var player = event.getPlayer();
var playerUUID = player.uniqueId;
if(alldata.wallets[playerUUID] == null){
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
		var playerUUID = player.uniqueId;
		var btcAddress = alldata.wallets[playerUUID].BTCaddress;
		echo(player, "Deposit Bitcoin Address: https://blockchain.info/address/" + btcAddress);
		// echo(player, "Official Website: https://bitblocks.netlify.com/");
		var newBalance = updateBalance(player);
		echo(player, "Balance: ".bold().gold() + newBalance.toString());

});
