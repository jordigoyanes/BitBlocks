var updateBalance = require('./rtwireAPI.js').updateBalance;
var updateScoreboard = require('./scoreboard.js').updateScoreboard;
var commando = require('../../commando/commando.js').commando;

function claimSign(event) {
    var config = scload("bitblocks-config.json");
    if(config !== null && config.enableLandMarket === true){
        var alldata = scload('serverdb.json');
        var player = event.getPlayer();
        var playerUUID = player.uniqueId;
        var specialCharacter = "#";
        var lines = event.getLines();
        var signText = lines[0] + lines[1] + lines[2] + lines[3];
        var chunk = event.getBlock().getWorld().getChunkAt(event.getBlock().getLocation());
        var x = chunk.getX();
        var z = chunk.getZ();

        var buyProperty = function(cx, cz, name, claimer) {
            var config = scload("bitblocks-config.json");
            var landsalesAccID = config.landSalesAccountID;
            var landPrice = config.pricePerChunkSAT;
            echo(claimer, "Purchasing...".yellow())
            if(landPrice !==0){
                var TxCode = sendTx(alldata.wallets[claimer.uniqueId].AccountID, landsalesAccID, landPrice)[0];
                if (TxCode == 201 || TxCode == 201) {
                    var newBalance = updateBalance(claimer);
                    updateScoreboard(claimer, newBalance)
                    alldata.chunks["x:" + cx + "z:" + cz] = {};
                    alldata.chunks["x:" + cx + "z:" + cz].name = name;
                    alldata.chunks["x:" + cx + "z:" + cz].owner = claimer.uniqueId.toString();
                    alldata.chunks["x:" + cx + "z:" + cz].friends = [];
                    scsave(alldata, 'serverdb.json');
                    echo(claimer, "Congratulations, you are now the owner of ".green() + name + "!")
                } else {
                    echo(claimer, "Purchase Failed. BTC Transaction Error. Code:".red() + TxCode)
                }
            }else{ //if buying land is free:
                var newBalance = updateBalance(claimer);
                updateScoreboard(claimer, newBalance)
                alldata.chunks["x:" + cx + "z:" + cz] = {};
                alldata.chunks["x:" + cx + "z:" + cz].name = name;
                alldata.chunks["x:" + cx + "z:" + cz].owner = claimer.uniqueId.toString();
                alldata.chunks["x:" + cx + "z:" + cz].friends = [];
                scsave(alldata, 'serverdb.json');
                echo(claimer, "Congratulations, you are now the owner of ".green() + name + "!")
            }
        }

        if (signText.length() > 0 && signText.substring(0, 1).equals(specialCharacter) && signText.substring(signText.length() - 1).equals(specialCharacter)) {
            var name = signText.substring(1, signText.length() - 1);
            if (name != "abandon") {
                if (alldata.chunks["x:" + x + "z:" + z] === undefined) {
                    buyProperty(x, z, name, player)
                } else {
                    if (alldata.chunks["x:" + x + "z:" + z].owner == player.uniqueId.toString()) {
                        alldata.chunks["x:" + x + "z:" + z].name = name;
                        scsave(alldata, 'serverdb.json');
                        echo(player, "You renamed this land to ".gold() + name)
                    }
                }
            } else {
                if (alldata.chunks["x:" + x + "z:" + z] === undefined) {
                    echo(player, "You can't name your claim 'abandon'. You do that when you want to abandon claimed land.".red())
                } else {
                    alldata.chunks["x:" + x + "z:" + z] = undefined;
                    scsave(alldata, 'serverdb.json');
                    echo(player, "You abandoned this chunk.".yellow())
                }
            }
        }
    }
}

var canBuild = function(location, player) {
    var alldata = scload('serverdb.json');
    var x = location.getChunk().getX();
    var z = location.getChunk().getZ();
    var currentEnv = location.getWorld().getEnvironment();
    var normalEnv = org.bukkit.World.Environment.NORMAL;
    if (player.isOp()) {
        return true;
    } else {
        if (alldata.chunks["x:" + x + "z:" + z] == undefined) {
            return true;
        } else {
            if (currentEnv.equals(normalEnv) && alldata.chunks["x:" + x + "z:" + z].owner == player.uniqueId) {
                return true;
            } else {
                var friends = alldata.chunks["x:" + x + "z:" + z].friends
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i] == player.uniqueId) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
}

// Anti-griefing functions:
var onInteract = function(event) {
    var b = event.getClickedBlock();
    var p = event.getPlayer();
    if (b != null) {
        if (!canBuild(b.getLocation(), event.getPlayer())) {
            event.setCancelled(true);
            echo(p, "You don't have permission to do that".red());
        }
    }
}
var onBukkitFill = function(event) {
    var p = event.getPlayer();
    if (!canBuild(p.getLocation(), event.getPlayer())) {
        echo(p, "You don't have permission to do that".red());
        event.setCancelled(true);
    }
}
var onBukkitEmpty = function(event) {
    var p = event.getPlayer();
    if (!canBuild(event.getBlockClicked().getLocation(), event.getPlayer())) {
        echo(p, "You don't have permission to do that".red());
        event.setCancelled(true);
    }
}

var showPropertyName = function(event) {
    var alldata = scload('serverdb.json');
    var player = event.getPlayer()
    if (!event.getFrom().getWorld().getName().endsWith("_nether") && !event.getFrom().getWorld().getName().endsWith("_end") && event.getFrom().getChunk() != event.getTo().getChunk()) {
        // announce new area
        var x1 = event.getFrom().getChunk().getX();
        var z1 = event.getFrom().getChunk().getZ();

        var x2 = event.getTo().getChunk().getX();
        var z2 = event.getTo().getChunk().getZ();

        var name1 = alldata.chunks["x:" + x1 + "z:" + z1] !== undefined ? alldata.chunks["x:" + x1 + "z:" + z1].name : "free land";
        var name2 = alldata.chunks["x:" + x2 + "z:" + z2] !== undefined ? alldata.chunks["x:" + x2 + "z:" + z2].name : "free land";

        if (name1 == null) name1 = "free land";
        if (name2 == null) name2 = "free land";

        if (!name1.equals(name2)) {
            if (name2.equals("free land")) {
                echo(player, "".gray() + "[ " + name2 + " ]");
            } else {
                echo(player, "".yellow() + "[ " + name2 + " ]");
            }
        }
    }
}
//commands
commando('chunkadd', function(args, player) {
    var alldata = scload('serverdb.json');
    var host = player;
    var x = host.getLocation().getChunk().getX();
    var z = host.getLocation().getChunk().getZ();
    var chunk = alldata.chunks["x:" + x + "z:" + z]
    var isChunkOwner = chunk == undefined ? false : chunk.owner == host.uniqueId ? true : false;

    if (isChunkOwner) {
        var guest = org.bukkit.Bukkit.getServer().getPlayer(args[0]);
        if (guest != null && host != guest) {
            var friends = alldata.chunks["x:" + x + "z:" + z].friends;
            friends.push(guest.uniqueId.toString());
            scsave(alldata, "serverdb.json");
            echo(host, "You have given building permission to ".green() + guest.name + " for your chunk '" + chunk.name + "'")
            echo(guest, "You have been given permission to build on '".green() + chunk.name + "', property of " + host.name)
        } else {
            echo(host, "That player was not found")
        }
    } else {
        echo(host, "You don't own this chunk".red())
    }
});
commando('chunkkick', function(args, player) {
    var alldata = scload('serverdb.json');
    var host = player;
    var x = host.getLocation().getChunk().getX();
    var z = host.getLocation().getChunk().getZ();
    var friends = alldata.chunks["x:" + x + "z:" + z].friends;
    var chunk = alldata.chunks["x:" + x + "z:" + z]
    var isChunkOwner = chunk == undefined ? false : chunk.owner == host.uniqueId ? true : false;
    var playertoKick = org.bukkit.Bukkit.getServer().getPlayer(args[0]);
    if (isChunkOwner) {
        if (playertoKick != null && host != playertoKick) {
            for (var i = 0; i < friends.length; i++) {
                if (friends[i] == playertoKick.uniqueId) {
                    friends[i] = undefined;
                    scsave(alldata, "serverdb.json");
                    echo(host, "You removed building permission to ".yellow() + playertoKick.name + "!")

                } else {
                    if (i == friends.length - 1) {
                        echo(host, "That player didn't have building permission")
                    }
                }
            }
        } else {
            echo(host, "That player was not found")
        }
    } else {
        echo(host, "You don't own this chunk".red())
    }

});

events.signChange(claimSign);
events.playerBucketEmpty(onBukkitEmpty)
events.playerBucketFill(onBukkitFill)
events.playerInteract(onInteract)
events.playerMove(showPropertyName);
