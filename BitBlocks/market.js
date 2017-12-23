var alldata = scload('serverdb.json');
var updateBalance = require('./rtwireAPI.js').updateBalance;
var updateScoreboard = require('./scoreboard.js').updateScoreboard;
var sendTx = require('./rtwireAPI.js').sendTx;
var root = "https://api.rtwire.com/v1/mainnet";
var Bukkit = org.bukkit.Bukkit;
var Inventory = org.bukkit.inventory.Inventory;
var ItemStack = org.bukkit.inventory.ItemStack;
var Material = org.bukkit.Material;
var ItemMeta = org.bukkit.inventory.meta.ItemMeta;
var Player = org.bukkit.entity.Player;
var EntityType = org.bukkit.entity.EntityType;
var Villager = org.bukkit.entity.Villager;

var OpenMarket = function(event) {
    var config = scload("bitblocks-config.json");
    var MarketName = config.villagerMarketTitle;
    if(config !== null && config.enableVillagerMarket == true){
        var addItem = function(item, price) {
            var meta = item.getItemMeta();
            var pricedItem = item;
            var lore = [];
            lore.push("Price:");
            lore.push(price.toString());
            meta.setLore(lore);
            pricedItem.setItemMeta(meta);
            marketInv.addItem(pricedItem);
        };
        if(event.getRightClicked().getType().equals(EntityType.VILLAGER)) {
            event.setCancelled(true);
            var marketInv = Bukkit.createInventory(null, 54, MarketName);
            addItem(new ItemStack(Material.COMPASS, 1), 1)
            addItem(new ItemStack(Material.BED, 16), 5)
            addItem(new ItemStack(Material.IRON_INGOT, 64), 300)
            addItem(new ItemStack(Material.CLAY_BALL, 16), 500)
            addItem(new ItemStack(Material.COOKED_BEEF, 16), 50)
            addItem(new ItemStack(Material.EYE_OF_ENDER, 1), 2)
            addItem(new ItemStack(Material.FENCE, 16), 10)
            addItem(new ItemStack(Material.GLASS, 32), 15)
            addItem(new ItemStack(Material.HAY_BLOCK, 16), 12)
            addItem(new ItemStack(Material.LEATHER, 16), 50)
            addItem(new ItemStack(Material.OBSIDIAN, 8), 2500)
            addItem(new ItemStack(Material.RAILS, 16), 750)
            addItem(new ItemStack(Material.SANDSTONE, 16), 1500)
            addItem(new ItemStack(Material.RED_SANDSTONE, 16), 2500)
            addItem(new ItemStack(Material.SMOOTH_BRICK, 16), 2500)
            addItem(new ItemStack(Material.BLAZE_ROD, 2), 50)
            addItem(new ItemStack(Material.CHORUS_FLOWER, 2), 150)
            addItem(new ItemStack(Material.DIAMOND, 12), 75)
            addItem(new ItemStack(Material.ENDER_STONE, 4), 50)
            addItem(new ItemStack(Material.IRON_BLOCK, 8), 50)
            addItem(new ItemStack(Material.IRON_INGOT, 16), 1500)
            addItem(new ItemStack(Material.NETHERRACK, 8), 50)
            addItem(new ItemStack(Material.QUARTZ, 16), 1750)
            addItem(new ItemStack(Material.SOUL_SAND, 8), 50)
            addItem(new ItemStack(Material.SPONGE, 2), 50)
            addItem(new ItemStack(Material.LOG, 16), 500)
            addItem(new ItemStack(Material.WOOL, 16), 2500)
            addItem(new ItemStack(Material.PAPER, 16), 1250)
            addItem(new ItemStack(Material.PACKED_ICE, 16), 50)
            addItem(new ItemStack(Material.GOLD_BLOCK, 4), 175)
            addItem(new ItemStack(Material.GOLDEN_APPLE, 1), 50)
            addItem(new ItemStack(Material.ARROW, 16), 500)
            addItem(new ItemStack(Material.PRISMARINE, 16), 750)
            addItem(new ItemStack(Material.QUARTZ_BLOCK, 16), 75)
            addItem(new ItemStack(Material.SEA_LANTERN, 16), 75)
            addItem(new ItemStack(Material.GLOWSTONE, 16), 75)
            addItem(new ItemStack(Material.ANVIL, 1), 2500)
            addItem(new ItemStack(Material.ENDER_PEARL, 1), 10)
            addItem(new ItemStack(Material.EMERALD_BLOCK, 10), 90)
            addItem(new ItemStack(Material.NETHER_STALK, 4), 50)
            addItem(new ItemStack(Material.LAPIS_ORE, 4), 50)
            addItem(new ItemStack(Material.SADDLE, 1), 300)
            addItem(new ItemStack(Material.SLIME_BALL, 4), 250)
            addItem(new ItemStack(Material.GOLDEN_APPLE, 3, 1), 300)
            addItem(new ItemStack(Material.APPLE, 16), 50)
            addItem(new ItemStack(Material.ELYTRA, 1), 100)
            addItem(new ItemStack(Material.PURPLE_SHULKER_BOX, 1), 1000)
            addItem(new ItemStack(Material.BOOK_AND_QUILL, 4), 100)
            addItem(new ItemStack(Material.CAKE, 4), 25)
            addItem(new ItemStack(Material.DRAGONS_BREATH, 2), 100)
            addItem(new ItemStack(Material.EMPTY_MAP, 3), 200)
            event.getPlayer().openInventory(marketInv);
        }
    }
}

var buyMarketItem = function(event) {
    var config = scload("bitblocks-config.json")
    var MarketName = config.villagerMarketTitle;
    var MarketAccountID = config.marketSalesAccountID;
    var inventory = event.getInventory();
    try {
        if (inventory.getName().equalsIgnoreCase(MarketName)) {
            if (!event.isShiftClick()) {
                var buyer = event.getWhoClicked()
                var clicked = event.getCurrentItem();
                if (clicked != null && clicked.getType() !== Material.AIR) {
                    event.setCancelled(true);
                    var hasOpenSlots;
                    if (buyer.getInventory().firstEmpty() == -1) {
                        hasOpenSlots = false;
                    } else {
                        hasOpenSlots = true;
                    }
                    if (hasOpenSlots == true) {
                        var price = parseInt(clicked.getItemMeta().getLore()[1]);
                        echo(buyer, "Purchasing...".yellow())
                        buyer.closeInventory();
                        var TxCode = sendTx(alldata.wallets[buyer.uniqueId].AccountID, MarketAccountID, price * 100)[0];
                        if (TxCode == 201 || TxCode == 201) {
                            var clickedMeta = clicked.getItemMeta();
                            clickedMeta.setLore(null);
                            clicked.setItemMeta(clickedMeta);
                            echo(buyer, "Item purchased.".green());
                            buyer.getInventory().addItem(clicked);
                            var newBalance = updateBalance(buyer);
                            updateScoreboard(buyer, newBalance)
                        } else {
                            echo(buyer, "Transaction Failed. Code:".red() + TxCode)
                        }
                    } else {
                        buyer.closeInventory();
                        echo(buyer, "Your inventory is full! You must have an empty space.".red())
                    }
                }
            } else {
                event.setCancelled(true) //this stops people from shift clicking market items.
            }
        }
    } catch (e) {
        event.setCancelled(true)
    } //this stops people from depositing their items into the market inventory.
}



var villagerProtection = function(event) {
    try {
        var damager = event.getDamager();
        if (damager instanceof Player) {
            if (event.getEntity() instanceof Villager) {
                event.setCancelled(true);
                echo(damager, "don't hurt the poor guy".red())
            }
        }
    } catch (e) {
        //It says getDamager is not a function, but it works!
    }
}
events.playerInteractEntity(OpenMarket)
events.inventoryClick(buyMarketItem);
events.entityDamageByEntity(villagerProtection);
