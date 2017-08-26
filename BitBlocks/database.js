var alldata = scload('serverdb.json');
var getNewAccount = require('./rtwireAPI.js').getNewAccount;
var getNewBtcAddress = require('./rtwireAPI.js').getNewBtcAddress;
var updateBalance = require('./rtwireAPI.js').updateBalance;

var WelcomeMsg = function(player, btcAddress){
		echo(player, "WELCOME TO BITBLOCKS!".bold().gold())
		echo(player, "BITCOIN ADDRESS: https://blockchain.info/address/" + btcAddress);
		echo(player, "Official Website: https://bitblocks.herokuapp.com");
}



var playerJoin = function(event){
  if(alldata == undefined) {
      alldata = {};
      alldata.chunks = {};
      alldata.wallets = {};
      scsave(alldata, 'serverdb.json');
  }

	var player = event.getPlayer()
	var playerUUID = player.uniqueId;

	if(alldata.wallets[playerUUID] == null){
		var newAccID = getNewAccount();
		var btcAddress = getNewBtcAddress(newAccID);
		alldata.wallets[playerUUID] = {};
		alldata.wallets[playerUUID].AccountID = newAccID;
		alldata.wallets[playerUUID].BTCaddress = btcAddress;
		scsave(alldata, 'serverdb.json');
		WelcomeMsg(player, alldata.wallets[playerUUID].BTCaddress);
		var newBalance = updateBalance(player)
		updateScoreboard(player, newBalance)
	}else{
		var newBalance = updateBalance(player)
		WelcomeMsg(player, alldata.wallets[playerUUID].BTCaddress);
		updateScoreboard(player, newBalance)
	}
}

events.playerJoin(playerJoin);
