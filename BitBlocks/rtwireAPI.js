//you must generate user & password credentials in RTWire's console. (in MAINNET!)
var user = "your_user";
var pass = "your_pass";
var root = "https://api.rtwire.com/v1/mainnet"

/*
Using the RTWIRE API we can handle player-to-player transactions off-chain while still providing
a unique bitcoin address to every player so they can deposit.
Players must pay the transaction fee to withdraw to an exernal wallet.

 */

var Bukkit = org.bukkit.Bukkit;
var Inventory = org.bukkit.inventory.Inventory;
var ItemStack = org.bukkit.inventory.ItemStack;
var Material = org.bukkit.Material;
var ItemMeta = org.bukkit.inventory.meta.ItemMeta;


var updateScoreboard = require("./scoreboard.js").updateScoreboard;
var commando = require('../../commando/commando.js').commando

exports.apirequest = function(reqMethod, url, body) {
    // print("Api REQUEST DATA | body:"+body+"request method: "+reqMethod+url) //this is a debug line
    var auth = user + ":" + pass;
    var Base64 = java.util.Base64;
    var bytes = auth.getBytes();
    var encoded = Base64.getEncoder().encodeToString(bytes);
    //HTTP REQUEST
    conn = new java.net.URL(url).openConnection();
    conn.requestMethod = reqMethod;
    conn.doOutput = true;
    conn.instanceFollowRedirects = false;
    conn.setRequestProperty('Authorization', 'Basic ' + encoded)
    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
    if (conn.requestMethod == 'POST' || conn.requestMethod == 'PUT') {
        conn.doInput = true;
        conn.setDoOutput(true);
        // put each parameter in the outputstream
        conn.setRequestProperty('Content-Type', 'application/json');
        conn.setRequestProperty('Accept', 'application/json');
        conn.useCaches = false;
        var wr = new java.io.DataOutputStream(conn.getOutputStream());
        wr.writeBytes(body);
        if (conn.getOutputStream !== null) {
            wr.flush();
            wr.close();
        }
    }
    var rc = conn.responseCode;
    var response;
    var stream;
    if (rc == 200 || rc == 201) {
        try {
            stream = conn.getInputStream();
            response = new java.util.Scanner(stream).useDelimiter("\\A").next();
        } catch (e) {
            response = "nothing"
        }
    }
    var responseInfo = [rc, response];
    return responseInfo;
}



exports.sendTx = function(senderWalletID, destination, amount, isBTCaddress) {
    var n = {
        "n": 1
    }
    var postInfo = JSON.parse(apirequest('POST', root + '/transactions/', JSON.stringify(n))[1]).payload;
    var txID = postInfo[0].id;
    if (isBTCaddress == undefined) {
        var tx = {
            "id": txID, // Unique transaction ID. See docs below.
            "fromAccountID": senderWalletID,
            // Transfer to an RTWire account.
            "toAccountID": destination,

            "value": amount // Value to transfer in Satoshi.
        }
    } else {
        var tx = {
            "id": txID, // Unique transaction ID.
            "fromAccountID": senderWalletID,
            // Transfer to a Bitcoin Address
            "toAddress": destination,

            "value": amount // Value to transfer in Satoshi.
        }
    }
    var TxInfo = apirequest('PUT', root + '/transactions/', JSON.stringify(tx))
    return TxInfo;
}

exports.getNewAccount = function() {
    var req = apirequest('POST', root + '/accounts/')
    var AccountID = JSON.parse(req[1]).payload[0].id;
    return AccountID;
}

exports.getNewBtcAddress = function(accountID) {
    var req = apirequest('POST', root + '/accounts/' + accountID.toString() + '/addresses/')
    var btcAddress = JSON.parse(req[1]).payload[0].address;
    return btcAddress;
}

exports.updateBalance = function(player) {
    var alldata = scload('serverdb.json');
    var playerUUID = player.uniqueId;
    var AccountID = alldata.wallets[playerUUID].AccountID;
    var req = apirequest('GET', root + '/accounts/' + AccountID.toString())
    var newBalance = JSON.parse(req[1]).payload[0].balance / 100;
    return newBalance;
}


commando('send', function(args, player) {
    var alldata = scload('serverdb.json');
    var amount = parseInt(args[0]);
    var sender = player;
    var senderAccountID = alldata.wallets[sender.uniqueId].AccountID;
    var receiverparam = args[1] //playername or btcAddress

    var pReceiver = Bukkit.getServer().getPlayer(receiverparam);
    if (pReceiver != null && pReceiver != sender) {
        var receiverAccountID = alldata.wallets[pReceiver.uniqueId].AccountID;
        echo(sender, "Sending...".yellow())
        var sendInfo = sendTx(senderAccountID, receiverAccountID, amount * 100);
        if (sendInfo[0] == 201 || sendInfo[0] == 200) {
            newBalanceofSender = updateBalance(sender);
            newBalanceofReceiver = updateBalance(pReceiver);
            updateScoreboard(sender, newBalanceofSender);
            updateScoreboard(pReceiver, newBalanceofReceiver);
            echo(sender, "You sent ".green() + amount.toString() + " bits to " + receiverparam + ".");
            echo(pReceiver, "".green() + player.getName() + " sent you " + amount.toString() + " bit(s).");
        } else {
            echo(sender, "Transaction Failed.".red())
        }
    } else {
        echo(player, "Player not found.".red())
    }
});
/* //TRANSFER TO EXTERNAL WALLET IS NOT WORKING YET
commando('transfer', function(args, player) {
    var alldata = scload('serverdb.json');
    var amount = parseInt(args[0]);
    var sender = player;
    var senderAccountID = alldata.wallets[sender.uniqueId].AccountID;
    var receiverparam = args[1] //playername or btcAddress
    var pReceiver = Bukkit.getServer().getPlayer(receiverparam);
    if (pReceiver != null && pReceiver != sender) {
        var receiverBTCaddress = alldata.wallets[pReceiver.uniqueId].BTCaddress;
        echo(sender, "Sending...".yellow())
        var sendInfo = sendTx(senderAccountID, receiverBTCaddress, amount * 100, true);
        if (sendInfo[0] == 201) {
            echo(sender, "You sent ".green() + amount.toString() + " bits to " + receiverparam + ".");
            echo(pReceiver, "".green() + player.getName() + " sent you " + amount.toString() + " bit(s).");
        } else {
            echo(sender, "Transaction Failed. Remember there is a fee of 100 bits.".red())
        }
    } else {
        echo(player, "Player not found.".red())
    }


});
*/

commando('bithelp', function(args, player) {
    var alldata = scload('serverdb.json');
    echo(player, "Your deposit bitcoin address is: https://blockchain.info/address/".gold() + alldata.wallets[player.uniqueId].BTCaddress)
    echo(player, "Use /send [amount] [player name] to send bits to online players without fees.")
    // echo(player, "Use /transfer [amount] [bitcoin address] to transfer bits to external wallet.");
    echo(player, "Use /wallet to see current balance and to refresh your scoreboard.")
    //echo(player, "Players must pay the miner fee to transfer out.");
});
