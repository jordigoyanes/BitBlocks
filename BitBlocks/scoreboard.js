var updateBalance = require('./rtwireAPI.js').updateBalance;
var currentScore

var Bukkit = org.bukkit.Bukkit;
var manager = Bukkit.getScoreboardManager();
var DisplaySlot = org.bukkit.scoreboard.DisplaySlot


exports.updateScoreboard = function(player, newScore){
var board = manager.getNewScoreboard();
var objective = board.registerNewObjective("test", "dummy");
var score = objective.getScore("Bits: ".gray()); //Get a fake offline player
score.setScore(newScore);
//Setting where to display the scoreboard/objective (either SIDEBAR, PLAYER_LIST or BELOW_NAME)
objective.setDisplaySlot(DisplaySlot.SIDEBAR);
//Setting the display name of the scoreboard/objective
objective.setDisplayName("Bit".gold()+"Blocks".gray());
player.setScoreboard(board);
}









