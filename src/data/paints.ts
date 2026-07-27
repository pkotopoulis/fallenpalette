import { Paint, PaintGroup } from "./types";

export const PAINT_GROUPS: PaintGroup[] = [
  // ═══ BLACKS ═══
  {family:"Black",paints:[
    {brand:"citadel",name:"Abaddon Black",hex:"#000000",type:"Base"},
    {brand:"vallejo_gc",name:"Black (72.051)",hex:"#000000",type:"Game Color"},
    {brand:"vallejo_mc",name:"Black (70.950)",hex:"#231d1d",type:"Model Color"},
    {brand:"army_painter",name:"Matt Black",hex:"#000000",type:"Fanatic"},
    {brand:"ak",name:"Black (AK11002)",hex:"#0a0a0a",type:"3rd Gen"},
    {brand:"scale75",name:"Black (SC-00)",hex:"#0f0f0f",type:"Scalecolor"},
    {brand:"ttc",name:"Soulless Grey Shadow",hex:"#0e0e10",type:"Shadow"},
    {brand:"proacryl",name:"Coal Black",hex:"#080808",type:"Base Set"},
  ]},
  {family:"Black",paints:[
    {brand:"citadel",name:"Corvus Black",hex:"#171314",type:"Base"},
    {brand:"vallejo_mc",name:"Black (70.950)",hex:"#231d1d",type:"Model Color"},
    {brand:"army_painter",name:"Matt Black",hex:"#000000",type:"Fanatic"},
  ]},

  // ═══ WHITES ═══
  {family:"White",paints:[
    {brand:"citadel",name:"Corax White",hex:"#ffffff",type:"Base"},
    {brand:"vallejo_gc",name:"Dead White (72.001)",hex:"#ffffff",type:"Game Color"},
    {brand:"vallejo_mc",name:"White (70.951)",hex:"#ffffff",type:"Model Color"},
    {brand:"army_painter",name:"Matt White",hex:"#ffffff",type:"Fanatic"},
    {brand:"ak",name:"White (AK11001)",hex:"#fafafa",type:"3rd Gen"},
    {brand:"scale75",name:"White (SC-01)",hex:"#f8f8f8",type:"Scalecolor"},
    {brand:"ttc",name:"Summoned Bone Highlight",hex:"#faf8f0",type:"Highlight"},
    {brand:"proacryl",name:"Bold Titanium White",hex:"#fcfcfc",type:"Base Set"},
  ]},
  {family:"White",paints:[
    {brand:"citadel",name:"Wraithbone",hex:"#dbd1b2",type:"Base"},
    {brand:"vallejo_gc",name:"Elfic Flesh (72.098)",hex:"#ead7b9",type:"Game Color"},
    {brand:"vallejo_mc",name:"Ivory (70.918)",hex:"#ebe2d1",type:"Model Color"},
    {brand:"army_painter",name:"Ancient Stone",hex:"#d4caa8",type:"Fanatic"},
    {brand:"proacryl",name:"Bright Ivory",hex:"#e0d8c0",type:"Base Set"},
  ]},
  {family:"White",paints:[
    {brand:"citadel",name:"Pallid Wych Flesh",hex:"#ebdfc6",type:"Layer"},
    {brand:"vallejo_gc",name:"Bone White (72.034)",hex:"#cabf8e",type:"Game Color"},
    {brand:"army_painter",name:"Skeleton Bone",hex:"#c8bd88",type:"Fanatic"},
    {brand:"proacryl",name:"Ivory",hex:"#d8d0b8",type:"Base Set"},
  ]},
  {family:"White",paints:[
    {brand:"citadel",name:"Ushabti Bone",hex:"#c9be8b",type:"Layer"},
    {brand:"vallejo_gc",name:"Bone White (72.034)",hex:"#cabf8e",type:"Game Color"},
    {brand:"army_painter",name:"Tomb King Tan",hex:"#ab9b7d",type:"Fanatic"},
    {brand:"ttc",name:"Summoned Bone Midtone",hex:"#b5a67a",type:"Midtone"},
  ]},
  {family:"White",paints:[
    {brand:"citadel",name:"Wrack White",hex:"#d3d0cf",type:"Dry"},
    {brand:"vallejo_gc",name:"Wolf Grey (72.047)",hex:"#c3d1d1",type:"Game Color"},
    {brand:"army_painter",name:"Brigade Grey",hex:"#d7d8d9",type:"Fanatic"},
  ]},

  // ═══ GREYS ═══
  {family:"Grey",paints:[
    {brand:"citadel",name:"Mechanicus Standard Grey",hex:"#39484a",type:"Base"},
    {brand:"vallejo_gc",name:"Charcoal (72.155)",hex:"#363638",type:"Game Color"},
    {brand:"vallejo_mc",name:"Field Blue (70.964)",hex:"#4d5256",type:"Model Color"},
    {brand:"proacryl",name:"Dark Grey Blue",hex:"#3a4550",type:"Base Set"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Administratum Grey",hex:"#989c94",type:"Layer"},
    {brand:"vallejo_gc",name:"Stonewall Grey (72.049)",hex:"#9c9384",type:"Game Color"},
    {brand:"army_painter",name:"Grey Castle",hex:"#9a9a8f",type:"Fanatic"},
    {brand:"ttc",name:"Soulless Grey Highlight",hex:"#9a9a98",type:"Highlight"},
    {brand:"proacryl",name:"Bright Warm Grey",hex:"#9c968e",type:"Base Set"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Dawnstone",hex:"#697068",type:"Layer"},
    {brand:"vallejo_gc",name:"Neutral Grey (72.050)",hex:"#6f6d61",type:"Game Color"},
    {brand:"army_painter",name:"Uniform Grey",hex:"#727880",type:"Fanatic"},
    {brand:"ttc",name:"Soulless Grey Midtone",hex:"#6c6e68",type:"Midtone"},
    {brand:"proacryl",name:"Dark Warm Grey",hex:"#686460",type:"Base Set"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Grey Seer",hex:"#a2a5a7",type:"Base"},
    {brand:"vallejo_mc",name:"Sky Grey (70.989)",hex:"#aaabad",type:"Model Color"},
    {brand:"army_painter",name:"Ash Grey",hex:"#8e9293",type:"Fanatic"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Celestra Grey",hex:"#8ba3a3",type:"Base"},
    {brand:"vallejo_gc",name:"Steel Grey (72.102)",hex:"#7993a2",type:"Game Color"},
    {brand:"vallejo_mc",name:"Pale Blue (70.906)",hex:"#90a3a9",type:"Model Color"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Rakarth Flesh",hex:"#9c998d",type:"Base"},
    {brand:"vallejo_gc",name:"Stonewall Grey (72.049)",hex:"#9c9384",type:"Game Color"},
    {brand:"army_painter",name:"Grey Castle",hex:"#9a9a8f",type:"Fanatic"},
  ]},

  // ═══ REDS ═══
  {family:"Red",paints:[
    {brand:"citadel",name:"Mephiston Red",hex:"#9a1115",type:"Base"},
    {brand:"vallejo_gc",name:"Gory Red (72.011)",hex:"#7d1f1f",type:"Game Color"},
    {brand:"vallejo_mc",name:"Carmine Red (70.908)",hex:"#97211f",type:"Model Color"},
    {brand:"army_painter",name:"Resplendent Red",hex:"#992425",type:"Fanatic"},
    {brand:"ak",name:"Blood Red (AK11089)",hex:"#961015",type:"3rd Gen"},
    {brand:"scale75",name:"Blood Red",hex:"#9e1420",type:"Scalecolor"},
    {brand:"ttc",name:"Doomfire Red Midtone",hex:"#981218",type:"Midtone"},
    {brand:"proacryl",name:"Bold Pyrrole Red",hex:"#a01520",type:"Base Set"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Khorne Red",hex:"#650001",type:"Base"},
    {brand:"vallejo_gc",name:"Scarlet Red (72.012)",hex:"#761e1d",type:"Game Color"},
    {brand:"vallejo_mc",name:"Red (70.926)",hex:"#792825",type:"Model Color"},
    {brand:"ak",name:"Dark Red (AK11086)",hex:"#6B1018",type:"3rd Gen"},
    {brand:"scale75",name:"Deep Red",hex:"#70111C",type:"Scalecolor"},
    {brand:"ttc",name:"Doomfire Red Shadow",hex:"#620008",type:"Shadow"},
    {brand:"proacryl",name:"Burnt Red",hex:"#6e1510",type:"Base Set"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Evil Sunz Scarlet",hex:"#c21a18",type:"Layer"},
    {brand:"vallejo_gc",name:"Bloody Red (72.010)",hex:"#c42520",type:"Game Color"},
    {brand:"vallejo_mc",name:"Vermillion (70.909)",hex:"#c82a20",type:"Model Color"},
    {brand:"army_painter",name:"Pure Red",hex:"#b90118",type:"Fanatic"},
    {brand:"ak",name:"Scarlet Red (AK11087)",hex:"#C01C16",type:"3rd Gen"},
    {brand:"ttc",name:"Doomfire Red Highlight",hex:"#c52018",type:"Highlight"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Jokaero Orange",hex:"#f0641e",type:"Base"},
    {brand:"vallejo_gc",name:"Hot Orange (72.009)",hex:"#e23a20",type:"Game Color"},
    {brand:"army_painter",name:"Molten Lava",hex:"#ea4226",type:"Fanatic"},
    {brand:"proacryl",name:"Orange",hex:"#f0661f",type:"Base Set"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Astorath Red",hex:"#a9311e",type:"Layer"},
    {brand:"vallejo_gc",name:"Scarlet Blood (72.106)",hex:"#c22222",type:"Game Color"},
    {brand:"vallejo_mc",name:"Dark Vermilion (70.947)",hex:"#b52a27",type:"Model Color"},
    {brand:"army_painter",name:"Pure Red",hex:"#b90118",type:"Fanatic"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Screamer Pink",hex:"#7a0e44",type:"Base"},
    {brand:"vallejo_gc",name:"Warlord Purple (72.014)",hex:"#862351",type:"Game Color"},
    {brand:"army_painter",name:"Moldy Wine",hex:"#81344d",type:"Fanatic"},
    {brand:"proacryl",name:"Magenta",hex:"#bd3a76",type:"Base Set"},
  ]},

  // ═══ ORANGES ═══
  {family:"Orange",paints:[
    {brand:"citadel",name:"Ryza Rust",hex:"#f16c23",type:"Dry"},
    {brand:"vallejo_gc",name:"Orange Fire (72.008)",hex:"#eb5b1e",type:"Game Color"},
    {brand:"vallejo_mc",name:"Light Orange (70.911)",hex:"#ed7326",type:"Model Color"},
    {brand:"army_painter",name:"Burning Ore",hex:"#ec5717",type:"Fanatic"},
  ]},
  {family:"Orange",paints:[
    {brand:"citadel",name:"Troll Slayer Orange",hex:"#f36b2b",type:"Layer"},
    {brand:"vallejo_gc",name:"Hot Orange (72.009)",hex:"#e23a20",type:"Game Color"},
    {brand:"army_painter",name:"Molten Lava",hex:"#ea4226",type:"Fanatic"},
    {brand:"ttc",name:"Fire Wyrm Midtone",hex:"#f06828",type:"Midtone"},
  ]},

  // ═══ YELLOWS ═══
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Averland Sunset",hex:"#fbb81c",type:"Base"},
    {brand:"vallejo_gc",name:"Moon Yellow (72.005)",hex:"#eeb800",type:"Game Color"},
    {brand:"vallejo_mc",name:"Flat Yellow (70.953)",hex:"#f6ba35",type:"Model Color"},
    {brand:"army_painter",name:"Inner Light",hex:"#fdca52",type:"Fanatic"},
    {brand:"ak",name:"Deep Yellow (AK11041)",hex:"#F9B41E",type:"3rd Gen"},
    {brand:"scale75",name:"Sol Yellow",hex:"#FAB820",type:"Scalecolor"},
    {brand:"ttc",name:"Smouldering Flame Midtone",hex:"#f8b620",type:"Midtone"},
    {brand:"proacryl",name:"Golden Yellow",hex:"#f0b018",type:"Base Set"},
  ]},
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Yriel Yellow",hex:"#ffd900",type:"Layer"},
    {brand:"vallejo_gc",name:"Toxic Yellow (72.109)",hex:"#e8d457",type:"Game Color"},
    {brand:"army_painter",name:"Warped Yellow",hex:"#ffd434",type:"Fanatic"},
    {brand:"ttc",name:"Smouldering Flame Highlight",hex:"#ffd600",type:"Highlight"},
  ]},
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Flash Gitz Yellow",hex:"#fff300",type:"Layer"},
    {brand:"vallejo_gc",name:"Bile Green (72.122)",hex:"#d5d900",type:"Game Color"},
    {brand:"army_painter",name:"Vivid Volt",hex:"#d1da38",type:"Fanatic"},
    {brand:"ak",name:"Lemon Yellow (AK11038)",hex:"#FFF100",type:"3rd Gen"},
  ]},

  // ═══ BROWNS ═══
  {family:"Brown",paints:[
    {brand:"citadel",name:"Rhinox Hide",hex:"#462f30",type:"Base"},
    {brand:"vallejo_gc",name:"Charred Brown (72.045)",hex:"#422a26",type:"Game Color"},
    {brand:"vallejo_mc",name:"Dark Rust (70.771)",hex:"#3b2625",type:"Model Color"},
    {brand:"army_painter",name:"Bootstrap Brown",hex:"#4b322c",type:"Fanatic"},
    {brand:"ak",name:"Burnt Umber (AK11103)",hex:"#482810",type:"3rd Gen"},
    {brand:"scale75",name:"Burnt Umber",hex:"#4B2910",type:"Scalecolor"},
    {brand:"ttc",name:"Nomad Flesh Shadow",hex:"#48302a",type:"Shadow"},
    {brand:"proacryl",name:"Dark Umber",hex:"#402820",type:"Base Set"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Mournfang Brown",hex:"#490f06",type:"Base"},
    {brand:"vallejo_gc",name:"Nocturnal Red (72.111)",hex:"#551c22",type:"Game Color"},
    {brand:"army_painter",name:"Dryad Brown",hex:"#643b2e",type:"Fanatic"},
    {brand:"proacryl",name:"Mahogany",hex:"#501810",type:"Base Set"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"XV-88",hex:"#6c4811",type:"Base"},
    {brand:"vallejo_gc",name:"Beasty Brown (72.043)",hex:"#7f5525",type:"Game Color"},
    {brand:"vallejo_mc",name:"English Uniform (70.921)",hex:"#6f532b",type:"Model Color"},
    {brand:"army_painter",name:"Leather Brown",hex:"#694333",type:"Fanatic"},
    {brand:"proacryl",name:"Golden Brown",hex:"#7a5020",type:"Base Set"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Balor Brown",hex:"#875408",type:"Layer"},
    {brand:"vallejo_gc",name:"Beasty Brown (72.043)",hex:"#7f5525",type:"Game Color"},
    {brand:"army_painter",name:"Desert Yellow",hex:"#88743f",type:"Fanatic"},
    {brand:"proacryl",name:"Light Umber",hex:"#8a6030",type:"Base Set"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Baneblade Brown",hex:"#8f7c68",type:"Layer"},
    {brand:"vallejo_gc",name:"Khaki (72.061)",hex:"#9a7b4c",type:"Game Color"},
    {brand:"army_painter",name:"Dusty Skull",hex:"#91846e",type:"Fanatic"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Zandri Dust",hex:"#988e56",type:"Base"},
    {brand:"vallejo_gc",name:"Camouflage Green (72.031)",hex:"#8b7732",type:"Game Color"},
    {brand:"army_painter",name:"Wasteland Clay",hex:"#a98b4d",type:"Fanatic"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Steel Legion Drab",hex:"#584e2d",type:"Base"},
    {brand:"vallejo_gc",name:"Cayman Green (72.067)",hex:"#595528",type:"Game Color"},
    {brand:"army_painter",name:"Tundra Taupe",hex:"#52533b",type:"Fanatic"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Dryad Bark",hex:"#2b2a24",type:"Base"},
    {brand:"vallejo_gc",name:"Charcoal (72.155)",hex:"#363638",type:"Game Color"},
    {brand:"army_painter",name:"Brigandine Brown",hex:"#2c241f",type:"Fanatic"},
  ]},

  // ═══ FLESH ═══
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Bugman's Glow",hex:"#804c43",type:"Base"},
    {brand:"vallejo_gc",name:"Tan (72.066)",hex:"#95604e",type:"Game Color"},
    {brand:"vallejo_mc",name:"Cavalry Brown (70.982)",hex:"#84443a",type:"Model Color"},
    {brand:"army_painter",name:"Fur Brown",hex:"#7d4742",type:"Fanatic"},
    {brand:"ak",name:"Base Flesh (AK11052)",hex:"#C26B4E",type:"3rd Gen"},
    {brand:"ttc",name:"Nomad Flesh Midtone",hex:"#88504a",type:"Midtone"},
  ]},
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Ratskin Flesh",hex:"#a86648",type:"Layer"},
    {brand:"vallejo_gc",name:"Tan (72.066)",hex:"#95604e",type:"Game Color"},
    {brand:"army_painter",name:"Ruddy Umber",hex:"#9b5b4c",type:"Fanatic"},
    {brand:"proacryl",name:"Tan Flesh",hex:"#a06848",type:"Base Set"},
  ]},
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Kislev Flesh",hex:"#d1a570",type:"Layer"},
    {brand:"vallejo_gc",name:"Pale Flesh (72.003)",hex:"#caa47f",type:"Game Color"},
    {brand:"army_painter",name:"Amber Skin",hex:"#c6a482",type:"Fanatic"},
    {brand:"ak",name:"Light Flesh (AK11053)",hex:"#D4A27A",type:"3rd Gen"},
    {brand:"ttc",name:"Nomad Flesh Highlight",hex:"#d0a872",type:"Highlight"},
  ]},
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Eldar Flesh",hex:"#e8c07f",type:"Layer"},
    {brand:"vallejo_mc",name:"Pale Sand (70.837)",hex:"#e3c28d",type:"Model Color"},
    {brand:"army_painter",name:"Barren Dune",hex:"#ddbc6b",type:"Fanatic"},
  ]},

  // ═══ BLUES ═══
  {family:"Blue",paints:[
    {brand:"citadel",name:"Kantor Blue",hex:"#02134e",type:"Base"},
    {brand:"vallejo_gc",name:"Imperial Blue (72.020)",hex:"#252a47",type:"Game Color"},
    {brand:"vallejo_mc",name:"Dark Blue (70.930)",hex:"#273461",type:"Model Color"},
    {brand:"army_painter",name:"Triumphant Navy",hex:"#1b2b51",type:"Fanatic"},
    {brand:"ak",name:"Dark Blue (AK11178)",hex:"#062550",type:"3rd Gen"},
    {brand:"scale75",name:"Abyssal Blue",hex:"#052348",type:"Scalecolor"},
    {brand:"ttc",name:"Knight's Oath Shadow",hex:"#081048",type:"Shadow"},
    {brand:"proacryl",name:"Dark Blue",hex:"#0a1850",type:"Expansion"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Macragge Blue",hex:"#0f3d7c",type:"Base"},
    {brand:"vallejo_mc",name:"Royal Blue (70.809)",hex:"#1a427d",type:"Model Color"},
    {brand:"army_painter",name:"Ultramarine Blue",hex:"#254486",type:"Fanatic"},
    {brand:"ak",name:"Ultramarine (AK11070)",hex:"#12407E",type:"3rd Gen"},
    {brand:"scale75",name:"Adriatic Blue",hex:"#104080",type:"Scalecolor"},
    {brand:"ttc",name:"Baron's Cloak Midtone",hex:"#143C78",type:"Midtone"},
    {brand:"proacryl",name:"Faded Ultramarine",hex:"#1A4080",type:"Base Set"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Caledor Sky",hex:"#366699",type:"Base"},
    {brand:"vallejo_gc",name:"Magic Blue (72.021)",hex:"#006aa8",type:"Game Color"},
    {brand:"army_painter",name:"Stratos Blue",hex:"#31628d",type:"Fanatic"},
    {brand:"ak",name:"Medium Blue (AK11074)",hex:"#376DB2",type:"3rd Gen"},
    {brand:"ttc",name:"Baron's Cloak Highlight",hex:"#386898",type:"Highlight"},
    {brand:"proacryl",name:"Blue",hex:"#2060A0",type:"Base Set"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Alaitoc Blue",hex:"#2f4f85",type:"Layer"},
    {brand:"vallejo_gc",name:"Elfic Blue (72.117)",hex:"#50617d",type:"Game Color"},
    {brand:"army_painter",name:"Thunderous Blue",hex:"#355477",type:"Fanatic"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"The Fang",hex:"#405b71",type:"Base"},
    {brand:"vallejo_gc",name:"Sombre Grey (72.048)",hex:"#535d69",type:"Game Color"},
    {brand:"army_painter",name:"Thunderous Blue",hex:"#355477",type:"Fanatic"},
    {brand:"ttc",name:"Cold Corpse Blue Shadow",hex:"#3E5870",type:"Shadow"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Thousand Sons Blue",hex:"#00506f",type:"Base"},
    {brand:"vallejo_mc",name:"Turquoise (70.966)",hex:"#0c425a",type:"Model Color"},
    {brand:"army_painter",name:"Abyssal Blue",hex:"#004e6a",type:"Fanatic"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Lothern Blue",hex:"#34a0ce",type:"Layer"},
    {brand:"vallejo_gc",name:"Electric Blue (72.023)",hex:"#4399b2",type:"Game Color"},
    {brand:"army_painter",name:"Arctic Gem",hex:"#0090cd",type:"Fanatic"},
    {brand:"proacryl",name:"Sky Blue",hex:"#3098C8",type:"Base Set"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Baharroth Blue",hex:"#54bdca",type:"Layer"},
    {brand:"vallejo_gc",name:"Sunrise Blue (72.118)",hex:"#73c9ec",type:"Game Color"},
    {brand:"army_painter",name:"Aquamarine",hex:"#5cc0c7",type:"Fanatic"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Hoeth Blue",hex:"#4c78af",type:"Layer"},
    {brand:"vallejo_gc",name:"Magic Blue (72.021)",hex:"#006aa8",type:"Game Color"},
    {brand:"army_painter",name:"Wolf Grey",hex:"#577ca4",type:"Fanatic"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Ahriman Blue",hex:"#00708a",type:"Layer"},
    {brand:"vallejo_mc",name:"Light Turquoise (70.840)",hex:"#006989",type:"Model Color"},
    {brand:"army_painter",name:"Deep Azure",hex:"#006978",type:"Fanatic"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Stegadon Scale Green",hex:"#06455d",type:"Base"},
    {brand:"vallejo_mc",name:"Turquoise (70.966)",hex:"#0c425a",type:"Model Color"},
    {brand:"army_painter",name:"Abyssal Blue",hex:"#004e6a",type:"Fanatic"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Etherium Blue",hex:"#9eb5ce",type:"Dry"},
    {brand:"vallejo_gc",name:"Glacier Blue (72.095)",hex:"#cdd9f1",type:"Game Color"},
    {brand:"army_painter",name:"Frost Blue",hex:"#a4c1dd",type:"Fanatic"},
  ]},

  // ═══ GREENS ═══
  {family:"Green",paints:[
    {brand:"citadel",name:"Caliban Green",hex:"#003d15",type:"Base"},
    {brand:"vallejo_gc",name:"Angel Green (72.123)",hex:"#324d2c",type:"Game Color"},
    {brand:"army_painter",name:"Angel Green",hex:"#1f3e2b",type:"Fanatic"},
    {brand:"ak",name:"Dark Green (AK11144)",hex:"#044020",type:"3rd Gen"},
    {brand:"scale75",name:"Black Forest Green",hex:"#053E1E",type:"Scalecolor"},
    {brand:"ttc",name:"Orc Skin Shadow",hex:"#083818",type:"Shadow"},
    {brand:"proacryl",name:"Dark Camo Green",hex:"#0E3820",type:"Expansion"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Warpstone Glow",hex:"#1b8c2e",type:"Base"},
    {brand:"vallejo_gc",name:"Scorpy Green (72.032)",hex:"#4f8436",type:"Game Color"},
    {brand:"army_painter",name:"Eternal Hunt",hex:"#169239",type:"Fanatic"},
    {brand:"ak",name:"Lime Green (AK11139)",hex:"#1C8C2C",type:"3rd Gen"},
    {brand:"scale75",name:"Sherwood Green",hex:"#1A8828",type:"Scalecolor"},
    {brand:"ttc",name:"Orc Skin Midtone",hex:"#1E8A2E",type:"Midtone"},
    {brand:"proacryl",name:"Green",hex:"#188830",type:"Base Set"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Castellan Green",hex:"#264715",type:"Base"},
    {brand:"vallejo_gc",name:"Angel Green (72.123)",hex:"#324d2c",type:"Game Color"},
    {brand:"army_painter",name:"Woodland Camo",hex:"#3e4b34",type:"Fanatic"},
    {brand:"proacryl",name:"Camo Green",hex:"#304820",type:"Base Set"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Deathworld Forest",hex:"#556229",type:"Layer"},
    {brand:"vallejo_gc",name:"Goblin Green (72.030)",hex:"#576033",type:"Game Color"},
    {brand:"army_painter",name:"Army Green",hex:"#4d5f37",type:"Fanatic"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Death Guard Green",hex:"#6d774d",type:"Base"},
    {brand:"vallejo_mc",name:"Bright Green (70.758)",hex:"#6f8348",type:"Model Color"},
    {brand:"army_painter",name:"Camouflage Green",hex:"#627147",type:"Fanatic"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Niblet Green",hex:"#378c35",type:"Layer"},
    {brand:"vallejo_gc",name:"Scorpy Green (72.032)",hex:"#4f8436",type:"Game Color"},
    {brand:"army_painter",name:"Eternal Hunt",hex:"#169239",type:"Fanatic"},
    {brand:"ttc",name:"Orc Skin Highlight",hex:"#3E9038",type:"Highlight"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Nurgling Green",hex:"#7e975e",type:"Layer"},
    {brand:"vallejo_mc",name:"Green Sky (70.974)",hex:"#7a9165",type:"Model Color"},
    {brand:"army_painter",name:"Olive Drab",hex:"#728451",type:"Fanatic"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Orruk Flesh",hex:"#8cc276",type:"Layer"},
    {brand:"vallejo_gc",name:"Ghost Green (72.121)",hex:"#83c192",type:"Game Color"},
    {brand:"army_painter",name:"Ferocious Green",hex:"#75bc68",type:"Fanatic"},
    {brand:"proacryl",name:"Jade",hex:"#68B870",type:"Base Set"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Waaagh! Flesh",hex:"#0b3b36",type:"Base"},
    {brand:"vallejo_gc",name:"Scurvy Green (72.027)",hex:"#1e4d43",type:"Game Color"},
    {brand:"army_painter",name:"Angel Green",hex:"#1f3e2b",type:"Fanatic"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Incubi Darkness",hex:"#082e32",type:"Base"},
    {brand:"vallejo_mc",name:"Black Green (70.980)",hex:"#29352b",type:"Model Color"},
    {brand:"army_painter",name:"Scarab Green",hex:"#1e3c41",type:"Fanatic"},
  ]},

  // ═══ PURPLES ═══
  {family:"Purple",paints:[
    {brand:"citadel",name:"Naggaroth Night",hex:"#3b2b50",type:"Base"},
    {brand:"vallejo_gc",name:"Hexed Lichen (72.015)",hex:"#4b2753",type:"Game Color"},
    {brand:"army_painter",name:"Terrestrial Titan",hex:"#363146",type:"Fanatic"},
    {brand:"ak",name:"Royal Purple (AK11068)",hex:"#3E2458",type:"3rd Gen"},
    {brand:"scale75",name:"Violet",hex:"#3C2250",type:"Scalecolor"},
    {brand:"ttc",name:"Sorceror's Cloak Shadow",hex:"#3A2850",type:"Shadow"},
    {brand:"proacryl",name:"Dark Purple",hex:"#382450",type:"Expansion"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Phoenician Purple",hex:"#440052",type:"Base"},
    {brand:"vallejo_gc",name:"Hexed Lichen (72.015)",hex:"#4b2753",type:"Game Color"},
    {brand:"army_painter",name:"Diabolic Plum",hex:"#56276a",type:"Fanatic"},
    {brand:"proacryl",name:"Purple",hex:"#4a2060",type:"Base Set"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Xereus Purple",hex:"#6c1f82",type:"Layer"},
    {brand:"vallejo_gc",name:"Warlord Purple (72.014)",hex:"#862351",type:"Game Color"},
    {brand:"army_painter",name:"Wizard Orchid",hex:"#702485",type:"Fanatic"},
    {brand:"ak",name:"Magenta (AK11067)",hex:"#6D2082",type:"3rd Gen"},
    {brand:"ttc",name:"Sorceror's Cloak Midtone",hex:"#6E2080",type:"Midtone"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Gal Vorbak Red",hex:"#4b213c",type:"Base"},
    {brand:"vallejo_gc",name:"Deep Magenta (72.113)",hex:"#622640",type:"Game Color"},
    {brand:"army_painter",name:"Mulled Berry",hex:"#663746",type:"Fanatic"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Daemonette Hide",hex:"#655f81",type:"Layer"},
    {brand:"vallejo_gc",name:"Alien Purple (72.076)",hex:"#7161a8",type:"Game Color"},
    {brand:"army_painter",name:"Cultist Purple",hex:"#6b59a0",type:"Fanatic"},
    {brand:"ttc",name:"Sorceror's Cloak Highlight",hex:"#6A5A88",type:"Highlight"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Lucius Lilac",hex:"#b598c9",type:"Dry"},
    {brand:"vallejo_gc",name:"Lustful Purple (72.114)",hex:"#b78bbc",type:"Game Color"},
    {brand:"army_painter",name:"Violet Coven",hex:"#b19cc7",type:"Fanatic"},
  ]},

  // ═══ METALLICS ═══
  {family:"Metallic",paints:[
    {brand:"citadel",name:"Leadbelcher",hex:"#8a8a8e",type:"Base"},
    {brand:"vallejo_gc",name:"Gunmetal (72.054)",hex:"#888890",type:"Game Color"},
    {brand:"army_painter",name:"Gun Metal",hex:"#86868c",type:"Fanatic"},
    {brand:"ak",name:"Dark Aluminium (AK11207)",hex:"#84848A",type:"3rd Gen"},
    {brand:"scale75",name:"Heavy Metal",hex:"#87878C",type:"Scalecolor Metal"},
    {brand:"ttc",name:"Ancient Silver",hex:"#88888E",type:"Metallic"},
    {brand:"proacryl",name:"Dark Silver",hex:"#82828A",type:"Metallic"},
  ]},
  {family:"Metallic",paints:[
    {brand:"citadel",name:"Ironbreaker",hex:"#a8a8ac",type:"Layer"},
    {brand:"vallejo_gc",name:"Silver (72.052)",hex:"#AAABB0",type:"Game Color"},
    {brand:"army_painter",name:"Shining Silver",hex:"#ACADB0",type:"Fanatic"},
    {brand:"ak",name:"Silver (AK11209)",hex:"#A9AAB0",type:"3rd Gen"},
    {brand:"ttc",name:"Shining Silver",hex:"#AAAAB0",type:"Metallic"},
    {brand:"proacryl",name:"Silver",hex:"#A6A6AE",type:"Metallic"},
  ]},
  {family:"Metallic",paints:[
    {brand:"citadel",name:"Retributor Armour",hex:"#c89830",type:"Base"},
    {brand:"vallejo_gc",name:"Glorious Gold (72.056)",hex:"#C59A32",type:"Game Color"},
    {brand:"army_painter",name:"Greedy Gold",hex:"#CA9C34",type:"Fanatic"},
    {brand:"ak",name:"Old Gold (AK11196)",hex:"#C69830",type:"3rd Gen"},
    {brand:"scale75",name:"Dwarven Gold",hex:"#C79A30",type:"Scalecolor Metal"},
    {brand:"ttc",name:"True Gold",hex:"#C89A30",type:"Metallic"},
    {brand:"proacryl",name:"Rich Gold",hex:"#C09228",type:"Metallic"},
  ]},
  {family:"Metallic",paints:[
    {brand:"citadel",name:"Balthasar Gold",hex:"#9c6828",type:"Base"},
    {brand:"vallejo_gc",name:"Bright Bronze (72.057)",hex:"#9A6A2A",type:"Game Color"},
    {brand:"army_painter",name:"Weapon Bronze",hex:"#9E6C2C",type:"Fanatic"},
    {brand:"ak",name:"Bronze (AK11195)",hex:"#9B6928",type:"3rd Gen"},
    {brand:"ttc",name:"Aged Bronze",hex:"#986828",type:"Metallic"},
    {brand:"proacryl",name:"Bronze",hex:"#986628",type:"Metallic"},
  ]},
  {family:"Metallic",paints:[
    {brand:"citadel",name:"Runelord Brass",hex:"#b0886a",type:"Base"},
    {brand:"proacryl",name:"Light Bronze",hex:"#B08868",type:"Metallic"},
  ]},
  {family:"Metallic",paints:[
    {brand:"proacryl",name:"Copper",hex:"#B06838",type:"Metallic"},
    {brand:"proacryl",name:"White Gold",hex:"#D0C890",type:"Metallic"},
  ]},

  // ═══ PINK ═══
  {family:"Pink",paints:[
    {brand:"citadel",name:"Emperor's Children",hex:"#c0407f",type:"Contrast"},
    {brand:"vallejo_gc",name:"Squid Pink (72.013)",hex:"#b23a6a",type:"Game Color"},
    {brand:"army_painter",name:"Pixie Pink",hex:"#cf5390",type:"Fanatic"},
    {brand:"proacryl",name:"Magenta",hex:"#bd3a76",type:"Base Set"},
  ]},
  {family:"Pink",paints:[
    {brand:"citadel",name:"Fulgrim Pink",hex:"#e783a9",type:"Layer"},
    {brand:"proacryl",name:"Bright Pink",hex:"#e97fa6",type:"Base Set"},
  ]},

  // ═══ ORANGE (bright) ═══
  {family:"Orange",paints:[
    {brand:"citadel",name:"Jokaero Orange",hex:"#f0641e",type:"Layer"},
    {brand:"vallejo_gc",name:"Hot Orange (72.009)",hex:"#e23a20",type:"Game Color"},
    {brand:"army_painter",name:"Lava Orange",hex:"#ef6420",type:"Fanatic"},
    {brand:"proacryl",name:"Orange",hex:"#f0661f",type:"Base Set"},
  ]},

  // ═══ YELLOW (bright) ═══
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Flash Gitz Yellow",hex:"#fff300",type:"Layer"},
    {brand:"vallejo_gc",name:"Sun Yellow (72.006)",hex:"#fbe018",type:"Game Color"},
    {brand:"army_painter",name:"Daemonic Yellow",hex:"#ffdf14",type:"Fanatic"},
    {brand:"proacryl",name:"Yellow",hex:"#ffd400",type:"Base Set"},
  ]},

  // ═══ BONE / IVORY ═══
  {family:"Bone",paints:[
    {brand:"citadel",name:"Ushabti Bone",hex:"#c9be8b",type:"Layer"},
    {brand:"vallejo_gc",name:"Bone White (72.034)",hex:"#cabf8e",type:"Game Color"},
    {brand:"army_painter",name:"Skeleton Bone",hex:"#c8bd88",type:"Fanatic"},
    {brand:"proacryl",name:"Bone",hex:"#cdbf92",type:"Base Set"},
  ]},

  // ╔═══════════════════════════════════════════════════════════════════════╗
  // ║  SPEED PAINTS — transparent one-coat shading paints                   ║
  // ║                                                                        ║
  // ║  Citadel Contrast · Vallejo Xpress Color · Army Painter Speedpaint 2.0 ║
  // ║  · Scale75 Instant Colors                                              ║
  // ║                                                                        ║
  // ║  Deliberately kept in their own groups, separate from the opaque        ║
  // ║  ranges above. These paints only behave correctly over a light         ║
  // ║  undercoat and are not drop-in swaps for a base coat, so pairing them  ║
  // ║  with opaque paints as "direct equivalents" would be misleading.       ║
  // ║                                                                        ║
  // ║  Hex values are approximations of each paint applied over a bone/white ║
  // ║  undercoat. There is no manufacturer-published hex for these ranges,   ║
  // ║  and the apparent colour shifts substantially with the undercoat, so   ║
  // ║  treat them as a matching aid rather than a spec.                      ║
  // ╚═══════════════════════════════════════════════════════════════════════╝

  // ═══ SPEED: OFF-WHITE ═══
  {family:"White",paints:[
    {brand:"citadel",name:"Apothecary White",hex:"#dedbd4",type:"Contrast"},
    {brand:"vallejo_gc",name:"Templar White (72.401)",hex:"#e7e3d8",type:"Xpress Color"},
    {brand:"army_painter",name:"Holy White",hex:"#e4e1d6",type:"Speedpaint"},
    {brand:"army_painter",name:"Blinding Light",hex:"#f0eee8",type:"Speedpaint"},
  ]},
  {family:"Bone",paints:[
    {brand:"vallejo_gc",name:"Mummy White (72.449)",hex:"#dbd2bb",type:"Xpress Color"},
    {brand:"army_painter",name:"Pallid Bone",hex:"#d8cfb4",type:"Speedpaint"},
    {brand:"scale75",name:"Savage Beige",hex:"#ded2ae",type:"Instant Color"},
    {brand:"scale75",name:"Phoenix Egg",hex:"#f0d0b4",type:"Instant Color"},
  ]},
  {family:"Bone",paints:[
    {brand:"citadel",name:"Skeleton Horde",hex:"#c9a96a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Bag of Bones (72.450)",hex:"#c8b48a",type:"Xpress Color"},
    {brand:"army_painter",name:"Bony Matter",hex:"#cbbb92",type:"Speedpaint"},
    {brand:"scale75",name:"Zombie Skin",hex:"#c4b896",type:"Instant Color"},
  ]},

  // ═══ SPEED: GREYS ═══
  {family:"Grey",paints:[
    {brand:"citadel",name:"Gryph-Charger Grey",hex:"#93a3ab",type:"Contrast"},
    {brand:"vallejo_gc",name:"Iceberg Grey (72.463)",hex:"#a8b4bc",type:"Xpress Color"},
    {brand:"army_painter",name:"Runic Grey",hex:"#9aa4aa",type:"Speedpaint"},
    {brand:"scale75",name:"Spectral Wolf",hex:"#b0a8b4",type:"Instant Color"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Space Wolves Grey",hex:"#66849a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Space Grey (72.422)",hex:"#5c6a74",type:"Xpress Color"},
    {brand:"army_painter",name:"Battleship Grey",hex:"#7a848c",type:"Speedpaint"},
    {brand:"vallejo_gc",name:"Starship Steel (72.462)",hex:"#6a7076",type:"Xpress Color"},
  ]},
  {family:"Grey",paints:[
    {brand:"vallejo_gc",name:"Landser Grey (72.469)",hex:"#6e7268",type:"Xpress Color"},
    {brand:"army_painter",name:"Gravelord Grey",hex:"#6a6a6a",type:"Speedpaint"},
    {brand:"army_painter",name:"Ashen Stone",hex:"#8a8578",type:"Speedpaint"},
    {brand:"scale75",name:"Golem Grey",hex:"#4a4a4c",type:"Instant Color"},
  ]},
  {family:"Grey",paints:[
    {brand:"citadel",name:"Basilicanum Grey",hex:"#4a4c50",type:"Contrast"},
    {brand:"vallejo_gc",name:"Viking Grey - Intense (72.483)",hex:"#565c60",type:"Xpress Color"},
    {brand:"scale75",name:"Black Shadow",hex:"#4a4a3e",type:"Instant Color"},
  ]},

  // ═══ SPEED: BLACKS ═══
  {family:"Black",paints:[
    {brand:"citadel",name:"Black Legion",hex:"#16181c",type:"Contrast"},
    {brand:"citadel",name:"Black Templar",hex:"#1e2228",type:"Contrast"},
    {brand:"vallejo_gc",name:"Black Lotus (72.423)",hex:"#1a1a1e",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Hospitallier Black - Intense (72.484)",hex:"#101014",type:"Xpress Color"},
    {brand:"army_painter",name:"Grim Black",hex:"#17171a",type:"Speedpaint"},
  ]},
  {family:"Black",paints:[
    {brand:"vallejo_gc",name:"Greasy Black (72.476)",hex:"#24241e",type:"Xpress Color"},
    {brand:"citadel",name:"Ratling Grime",hex:"#2e2218",type:"Contrast"},
    {brand:"army_painter",name:"Desolate Brown",hex:"#3a2a1e",type:"Speedpaint"},
  ]},

  // ═══ SPEED: REDS ═══
  {family:"Red",paints:[
    {brand:"citadel",name:"Baal Red",hex:"#b4181c",type:"Contrast"},
    {brand:"vallejo_gc",name:"Plasma Red (72.406)",hex:"#c01c20",type:"Xpress Color"},
    {brand:"army_painter",name:"Bright Red",hex:"#c41f22",type:"Speedpaint"},
    {brand:"army_painter",name:"Poppy Red",hex:"#cc2a24",type:"Speedpaint"},
    {brand:"scale75",name:"Dragon Blood",hex:"#c8141c",type:"Instant Color"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Blood Angels Red",hex:"#9c1418",type:"Contrast"},
    {brand:"vallejo_gc",name:"Velvet Red (72.407)",hex:"#a01e26",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Seraph Red - Intense (72.479)",hex:"#a8121a",type:"Xpress Color"},
    {brand:"army_painter",name:"Blood Red",hex:"#a81f24",type:"Speedpaint"},
    {brand:"army_painter",name:"Slaughter Red",hex:"#96181e",type:"Speedpaint"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Flesh Tearers Red",hex:"#6e0e14",type:"Contrast"},
    {brand:"citadel",name:"Sigvald Burgundy",hex:"#6a1826",type:"Contrast"},
    {brand:"army_painter",name:"Murder Scene",hex:"#6c1218",type:"Speedpaint"},
    {brand:"army_painter",name:"Dusk Red",hex:"#7a2028",type:"Speedpaint"},
    {brand:"scale75",name:"Grizzly Brown",hex:"#5c1c18",type:"Instant Color"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Gore-Grunta Fur",hex:"#7a3a24",type:"Contrast"},
    {brand:"vallejo_gc",name:"Copper Brown (72.421)",hex:"#8a4a2a",type:"Xpress Color"},
    {brand:"army_painter",name:"Burnished Red",hex:"#8a3226",type:"Speedpaint"},
    {brand:"army_painter",name:"Ruddy Fur",hex:"#8e4426",type:"Speedpaint"},
    {brand:"scale75",name:"Rage Brown",hex:"#8a3a18",type:"Instant Color"},
    {brand:"scale75",name:"Demon Brown",hex:"#8a4a3a",type:"Instant Color"},
  ]},
  {family:"Red",paints:[
    {brand:"army_painter",name:"Carmine Dragon",hex:"#a8203a",type:"Speedpaint"},
    {brand:"scale75",name:"Life Red",hex:"#d2401c",type:"Instant Color"},
    {brand:"scale75",name:"Health Red",hex:"#d8541e",type:"Instant Color"},
  ]},

  // ═══ SPEED: ORANGES ═══
  {family:"Orange",paints:[
    {brand:"citadel",name:"Gryph-Hound Orange",hex:"#d2691e",type:"Contrast"},
    {brand:"vallejo_gc",name:"Martian Orange (72.405)",hex:"#d4661c",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Phoenix Orange - Intense (72.478)",hex:"#e0631a",type:"Xpress Color"},
    {brand:"army_painter",name:"Fire Giant Orange",hex:"#d86a20",type:"Speedpaint"},
    {brand:"scale75",name:"Frenzy Orange",hex:"#e8801c",type:"Instant Color"},
  ]},
  {family:"Orange",paints:[
    {brand:"citadel",name:"Magmadroth Flame",hex:"#d84a1c",type:"Contrast"},
    {brand:"vallejo_gc",name:"Chameleon Orange (72.455)",hex:"#d2521e",type:"Xpress Color"},
    {brand:"army_painter",name:"Fire Drake",hex:"#cc4a1e",type:"Speedpaint"},
    {brand:"scale75",name:"Ragweed Orange",hex:"#e0704a",type:"Instant Color"},
  ]},
  {family:"Orange",paints:[
    {brand:"citadel",name:"Aggaros Dunes",hex:"#b8863c",type:"Contrast"},
    {brand:"vallejo_gc",name:"Desert Ochre (72.454)",hex:"#b4863e",type:"Xpress Color"},
    {brand:"army_painter",name:"Ochre Clay",hex:"#b0803a",type:"Speedpaint"},
    {brand:"army_painter",name:"Sand Golem",hex:"#c09850",type:"Speedpaint"},
    {brand:"army_painter",name:"Howling Sand",hex:"#c8a874",type:"Speedpaint"},
    {brand:"scale75",name:"Ogre Brown",hex:"#c08a3a",type:"Instant Color"},
    {brand:"scale75",name:"Drain Life",hex:"#eaa054",type:"Instant Color"},
  ]},

  // ═══ SPEED: YELLOWS ═══
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Bad Moon Yellow",hex:"#f2d21e",type:"Contrast"},
    {brand:"vallejo_gc",name:"Nuclear Yellow (72.404)",hex:"#f4d81c",type:"Xpress Color"},
    {brand:"army_painter",name:"Maize Yellow",hex:"#eed028",type:"Speedpaint"},
    {brand:"scale75",name:"Full Healing",hex:"#f6e02a",type:"Instant Color"},
    {brand:"scale75",name:"Estus Yellow",hex:"#f4ea6a",type:"Instant Color"},
  ]},
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Iyanden Yellow",hex:"#eeb818",type:"Contrast"},
    {brand:"citadel",name:"Imperial Fist",hex:"#f0c024",type:"Contrast"},
    {brand:"vallejo_gc",name:"Imperial Yellow (72.403)",hex:"#eeba1c",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Dreadnought Yellow - Intense (72.477)",hex:"#f0c018",type:"Xpress Color"},
    {brand:"army_painter",name:"Zealot Yellow",hex:"#eab822",type:"Speedpaint"},
    {brand:"scale75",name:"Rotten Pus",hex:"#f0b83a",type:"Instant Color"},
  ]},
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Nazdreg Yellow",hex:"#d89418",type:"Contrast"},
    {brand:"citadel",name:"Ironjawz Yellow",hex:"#c8881c",type:"Contrast"},
    {brand:"vallejo_gc",name:"Military Yellow (72.453)",hex:"#c8a03c",type:"Xpress Color"},
    {brand:"army_painter",name:"Ancient Honey",hex:"#c8901e",type:"Speedpaint"},
    {brand:"army_painter",name:"Nuclear Sunrise",hex:"#e8a020",type:"Speedpaint"},
  ]},
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Creed Camo",hex:"#8a8c54",type:"Contrast"},
    {brand:"vallejo_gc",name:"Khaki Drill (72.451)",hex:"#a89460",type:"Xpress Color"},
    {brand:"army_painter",name:"Gunner Camo",hex:"#8a8a52",type:"Speedpaint"},
    {brand:"army_painter",name:"Mummified Grime",hex:"#9a9060",type:"Speedpaint"},
    {brand:"scale75",name:"Corrupted Stamina",hex:"#9aa03c",type:"Instant Color"},
    {brand:"scale75",name:"Sulfur Yellow",hex:"#dcd82a",type:"Instant Color"},
  ]},

  // ═══ SPEED: GREENS ═══
  {family:"Green",paints:[
    {brand:"citadel",name:"Warp Lightning",hex:"#7ab52a",type:"Contrast"},
    {brand:"citadel",name:"Striking Scorpion Green",hex:"#6ec81e",type:"Contrast"},
    {brand:"citadel",name:"Hexwraith Flame",hex:"#b4c84a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Plague Green (72.419)",hex:"#7aa82c",type:"Xpress Color"},
    {brand:"army_painter",name:"Charming Chartreuse",hex:"#a8c82e",type:"Speedpaint"},
    {brand:"scale75",name:"Acid Green",hex:"#a8d24a",type:"Instant Color"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Karandras Green",hex:"#2a8c3a",type:"Contrast"},
    {brand:"citadel",name:"Aeldari Emerald",hex:"#109a5a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Snake Green (72.417)",hex:"#3a8c46",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Lizard Green (72.418)",hex:"#5a9a3e",type:"Xpress Color"},
    {brand:"army_painter",name:"Shamrock Green",hex:"#2e8c42",type:"Speedpaint"},
    {brand:"army_painter",name:"Forest Sprite",hex:"#4a8a4e",type:"Speedpaint"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Ork Flesh",hex:"#4a8a3e",type:"Contrast"},
    {brand:"citadel",name:"Mantis Warriors Green",hex:"#3a7a42",type:"Contrast"},
    {brand:"vallejo_gc",name:"Troll Green (72.416)",hex:"#4e8a3e",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Orc Skin (72.415)",hex:"#6a8a4a",type:"Xpress Color"},
    {brand:"army_painter",name:"Orc Skin",hex:"#5a8a44",type:"Speedpaint"},
    {brand:"army_painter",name:"Ghoul Green",hex:"#6aa03e",type:"Speedpaint"},
    {brand:"scale75",name:"Toad Green",hex:"#6a8a5a",type:"Instant Color"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Dark Angels Green",hex:"#12452a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Forest Green (72.465)",hex:"#1a4a2e",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Monastic Green - Intense (72.482)",hex:"#16543a",type:"Xpress Color"},
    {brand:"army_painter",name:"Absolution Green",hex:"#1c5232",type:"Speedpaint"},
    {brand:"scale75",name:"Basilisk Green",hex:"#3a4a40",type:"Instant Color"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Militarum Green",hex:"#4a5a2e",type:"Contrast"},
    {brand:"vallejo_gc",name:"Armor Green (72.466)",hex:"#46543a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Camouflage Green (72.467)",hex:"#5a6a42",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Commando Green (72.468)",hex:"#4a5a3a",type:"Xpress Color"},
    {brand:"army_painter",name:"Camo Cloak",hex:"#55603a",type:"Speedpaint"},
    {brand:"army_painter",name:"Burnt Moss",hex:"#5a6038",type:"Speedpaint"},
    {brand:"scale75",name:"Zucchini Skin",hex:"#4a5a2a",type:"Instant Color"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Plaguebearer Flesh",hex:"#a8b06a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Rotten Flesh (72.452)",hex:"#a8b47a",type:"Xpress Color"},
    {brand:"army_painter",name:"Malignant Green",hex:"#8aa054",type:"Speedpaint"},
    {brand:"army_painter",name:"Algae Green",hex:"#7a9a4a",type:"Speedpaint"},
    {brand:"scale75",name:"Belladona Green",hex:"#b4dca8",type:"Instant Color"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Garaghak's Sewer",hex:"#4a4a2a",type:"Contrast"},
    {brand:"army_painter",name:"Brownish Decay",hex:"#6a5a3a",type:"Speedpaint"},
    {brand:"army_painter",name:"Ghillie Dew",hex:"#7a8a4a",type:"Speedpaint"},
  ]},

  // ═══ SPEED: TEALS / TURQUOISE ═══
  {family:"Green",paints:[
    {brand:"citadel",name:"Akhelian Green",hex:"#147a70",type:"Contrast"},
    {brand:"citadel",name:"Terradon Turquoise",hex:"#1a9490",type:"Contrast"},
    {brand:"citadel",name:"Kroxigor Scales",hex:"#189888",type:"Contrast"},
    {brand:"vallejo_gc",name:"Caribbean Turquoise (72.414)",hex:"#1a8c8a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Heretic Turquoise - Intense (72.481)",hex:"#12807e",type:"Xpress Color"},
    {brand:"army_painter",name:"Caribbean Ocean",hex:"#1a8a86",type:"Speedpaint"},
    {brand:"army_painter",name:"Lizardfolk Cyan",hex:"#2aa0a0",type:"Speedpaint"},
    {brand:"scale75",name:"Elixir Green",hex:"#2a8a7a",type:"Instant Color"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Stormfiend",hex:"#10504e",type:"Contrast"},
    {brand:"citadel",name:"Nighthaunt Gloom",hex:"#6a9a94",type:"Contrast"},
    {brand:"army_painter",name:"Raging Sea",hex:"#1a5a6a",type:"Speedpaint"},
    {brand:"scale75",name:"Dark Kraken",hex:"#2a7a8a",type:"Instant Color"},
    {brand:"scale75",name:"Undead Dragon",hex:"#a8b4a8",type:"Instant Color"},
  ]},

  // ═══ SPEED: BLUES ═══
  {family:"Blue",paints:[
    {brand:"citadel",name:"Talassar Blue",hex:"#1a6ab4",type:"Contrast"},
    {brand:"citadel",name:"Celestium Blue",hex:"#1a74c0",type:"Contrast"},
    {brand:"vallejo_gc",name:"Mystic Blue (72.411)",hex:"#2a5aa0",type:"Xpress Color"},
    {brand:"army_painter",name:"Magic Blue",hex:"#1a68b8",type:"Speedpaint"},
    {brand:"scale75",name:"Paralyze Blue",hex:"#2a74c8",type:"Instant Color"},
    {brand:"scale75",name:"Magic Blue",hex:"#1a8ac4",type:"Instant Color"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Ultramarines Blue",hex:"#1e4a92",type:"Contrast"},
    {brand:"citadel",name:"Asurmen Blue",hex:"#1a4488",type:"Contrast"},
    {brand:"vallejo_gc",name:"Storm Blue (72.412)",hex:"#24467e",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Legacy Blue - Intense (72.480)",hex:"#1a3c7a",type:"Xpress Color"},
    {brand:"army_painter",name:"Highlord Blue",hex:"#24509c",type:"Speedpaint"},
    {brand:"army_painter",name:"Beowulf Blue",hex:"#1e4288",type:"Speedpaint"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Leviadon Blue",hex:"#1a2e56",type:"Contrast"},
    {brand:"vallejo_gc",name:"Omega Blue (72.413)",hex:"#1c2c50",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Wagram Blue (72.464)",hex:"#26405e",type:"Xpress Color"},
    {brand:"army_painter",name:"Tyrian Navy",hex:"#1a2c52",type:"Speedpaint"},
    {brand:"scale75",name:"Remove Mana",hex:"#2a3a4e",type:"Instant Color"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Aethermatic Blue",hex:"#7aa8c4",type:"Contrast"},
    {brand:"citadel",name:"Frostheart",hex:"#b4ccd8",type:"Contrast"},
    {brand:"citadel",name:"Briar Queen Chill",hex:"#a8c4c8",type:"Contrast"},
    {brand:"citadel",name:"Pylar Glacier",hex:"#6aa4c0",type:"Contrast"},
    {brand:"army_painter",name:"Cloudburst Blue",hex:"#7aa4c0",type:"Speedpaint"},
    {brand:"scale75",name:"Grey Spell",hex:"#b8c8d4",type:"Instant Color"},
    {brand:"scale75",name:"Mana Regeneration",hex:"#8ab4d8",type:"Instant Color"},
  ]},
  {family:"Blue",paints:[
    {brand:"army_painter",name:"Plasmatic Bolt",hex:"#2ab4d8",type:"Speedpaint"},
    {brand:"army_painter",name:"Thunderbird Blue",hex:"#2a7ac0",type:"Speedpaint"},
    {brand:"army_painter",name:"Tidal Wave",hex:"#1a8aa8",type:"Speedpaint"},
    {brand:"scale75",name:"Leviathan Blue",hex:"#0a8ca8",type:"Instant Color"},
    {brand:"scale75",name:"Ancestral Blue",hex:"#4a8ab0",type:"Instant Color"},
  ]},
  {family:"Blue",paints:[
    {brand:"scale75",name:"Fairy Blood",hex:"#3a5ad8",type:"Instant Color"},
    {brand:"scale75",name:"Replenish Blue",hex:"#4a4ac0",type:"Instant Color"},
    {brand:"army_painter",name:"Pastel Indigo",hex:"#9aa8cc",type:"Speedpaint"},
  ]},

  // ═══ SPEED: PURPLES ═══
  {family:"Purple",paints:[
    {brand:"citadel",name:"Shyish Purple",hex:"#5a2a72",type:"Contrast"},
    {brand:"citadel",name:"Luxion Purple",hex:"#6a2a9a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Deep Purple (72.409)",hex:"#4a2a6a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Wicked Purple (72.456)",hex:"#5a2a7a",type:"Xpress Color"},
    {brand:"army_painter",name:"Purple Alchemy",hex:"#5a2a80",type:"Speedpaint"},
    {brand:"army_painter",name:"Purple Swarm",hex:"#4a2a6e",type:"Speedpaint"},
    {brand:"army_painter",name:"Periwinkle Purple",hex:"#7a72b4",type:"Speedpaint"},
    {brand:"scale75",name:"Arcane Purple",hex:"#4a1a6a",type:"Instant Color"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Magos Purple",hex:"#3a1a4e",type:"Contrast"},
    {brand:"citadel",name:"Leviathan Purple",hex:"#4a2260",type:"Contrast"},
    {brand:"vallejo_gc",name:"Gloomy Violet (72.410)",hex:"#3a2a52",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Vampiric Purple (72.461)",hex:"#422a5a",type:"Xpress Color"},
    {brand:"army_painter",name:"Royal Robes",hex:"#3a2a6a",type:"Speedpaint"},
    {brand:"army_painter",name:"Hive Dweller Purple",hex:"#4a2a5a",type:"Speedpaint"},
  ]},

  // ═══ SPEED: PINKS / MAGENTA ═══
  {family:"Pink",paints:[
    {brand:"citadel",name:"Volupus Pink",hex:"#b02866",type:"Contrast"},
    {brand:"citadel",name:"Doomfire Magenta",hex:"#c81a7a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Fluid Pink (72.459)",hex:"#d84a8a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Cardinal Purple (72.408)",hex:"#7a2a52",type:"Xpress Color"},
    {brand:"army_painter",name:"Familiar Pink",hex:"#d04a8a",type:"Speedpaint"},
    {brand:"scale75",name:"Love Affair",hex:"#c81a6a",type:"Instant Color"},
  ]},
  {family:"Pink",paints:[
    {brand:"citadel",name:"Dreadful Visage",hex:"#c4a0a8",type:"Contrast"},
    {brand:"vallejo_gc",name:"Twilight Rose (72.460)",hex:"#b06a7a",type:"Xpress Color"},
    {brand:"army_painter",name:"Moody Mauve",hex:"#8a6a7a",type:"Speedpaint"},
    {brand:"army_painter",name:"Moonlake Coral",hex:"#d07a7a",type:"Speedpaint"},
    {brand:"scale75",name:"Dead Flesh",hex:"#c8a8a0",type:"Instant Color"},
    {brand:"scale75",name:"Salmon Fury",hex:"#e0607a",type:"Instant Color"},
  ]},
  {family:"Pink",paints:[
    {brand:"army_painter",name:"Princess Pink",hex:"#e88ab4",type:"Speedpaint"},
    {brand:"army_painter",name:"Pastel Salmon",hex:"#f0b8a8",type:"Speedpaint"},
    {brand:"army_painter",name:"Pastel Lavender",hex:"#c4b4d8",type:"Speedpaint"},
    {brand:"scale75",name:"Phoenix Feather",hex:"#f08a6a",type:"Instant Color"},
  ]},

  // ═══ SPEED: FLESH ═══
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Guilliman Flesh",hex:"#d09878",type:"Contrast"},
    {brand:"citadel",name:"Gutrippa Flesh",hex:"#d8b088",type:"Contrast"},
    {brand:"vallejo_gc",name:"Fairy Skin (72.457)",hex:"#e0b49a",type:"Xpress Color"},
    {brand:"army_painter",name:"Crusader Skin",hex:"#d09a72",type:"Speedpaint"},
    {brand:"army_painter",name:"Peachy Flesh",hex:"#e0ac8a",type:"Speedpaint"},
    {brand:"army_painter",name:"Goddess Glow",hex:"#e8bc9a",type:"Speedpaint"},
    {brand:"scale75",name:"Human Flesh",hex:"#e8b4a8",type:"Instant Color"},
  ]},
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Darkoath Flesh",hex:"#b47850",type:"Contrast"},
    {brand:"citadel",name:"Fyreslayer Flesh",hex:"#b06848",type:"Contrast"},
    {brand:"vallejo_gc",name:"Dwarf Skin (72.402)",hex:"#c88a5a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Tanned Skin (72.471)",hex:"#a86a42",type:"Xpress Color"},
    {brand:"army_painter",name:"Warrior Skin",hex:"#a8703a",type:"Speedpaint"},
    {brand:"army_painter",name:"Noble Skin",hex:"#c08a5a",type:"Speedpaint"},
    {brand:"scale75",name:"Evil Root",hex:"#d88a6a",type:"Instant Color"},
    {brand:"scale75",name:"Wild Beast",hex:"#c08a7a",type:"Instant Color"},
  ]},
  {family:"Flesh",paints:[
    {brand:"vallejo_gc",name:"Zombie Flesh (72.470)",hex:"#8a9a6a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Demonic Skin (72.458)",hex:"#7a8a5a",type:"Xpress Color"},
    {brand:"army_painter",name:"Maggot Skin",hex:"#c8b8a0",type:"Speedpaint"},
    {brand:"army_painter",name:"Rigor Mortis",hex:"#a8a890",type:"Speedpaint"},
  ]},

  // ═══ SPEED: BROWNS ═══
  {family:"Brown",paints:[
    {brand:"citadel",name:"Snakebite Leather",hex:"#8a5a2a",type:"Contrast"},
    {brand:"vallejo_gc",name:"Wasteland Brown (72.420)",hex:"#7a5a3a",type:"Xpress Color"},
    {brand:"army_painter",name:"Hardened Leather",hex:"#8a6038",type:"Speedpaint"},
    {brand:"army_painter",name:"Satchel Brown",hex:"#6a4a30",type:"Speedpaint"},
    {brand:"scale75",name:"Endurance Brown",hex:"#9a6a4a",type:"Instant Color"},
    {brand:"scale75",name:"Werewolf Brown",hex:"#a8946a",type:"Instant Color"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Cygor Brown",hex:"#5a3a22",type:"Contrast"},
    {brand:"citadel",name:"Wyldwood",hex:"#3a2618",type:"Contrast"},
    {brand:"vallejo_gc",name:"Mahogany (72.472)",hex:"#5a2e22",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Battledress Brown (72.473)",hex:"#5a4a2a",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Willow Bark (72.474)",hex:"#4a3a28",type:"Xpress Color"},
    {brand:"vallejo_gc",name:"Muddy Ground (72.475)",hex:"#4a4030",type:"Xpress Color"},
    {brand:"army_painter",name:"Dark Wood",hex:"#4a3424",type:"Speedpaint"},
    {brand:"army_painter",name:"Aged Hide",hex:"#6a4a32",type:"Speedpaint"},
  ]},

  // ═══ SPEED: METALLICS (Speedpaint 2.0 metallic subset) ═══
  {family:"Metallic",paints:[
    {brand:"army_painter",name:"Broadsword Silver",hex:"#9a9aa0",type:"Speedpaint"},
    {brand:"army_painter",name:"Polished Silver",hex:"#b4b4ba",type:"Speedpaint"},
    {brand:"army_painter",name:"Enchanted Steel",hex:"#8a8a94",type:"Speedpaint"},
  ]},
  {family:"Metallic",paints:[
    {brand:"army_painter",name:"Hoplite Gold",hex:"#c8a44a",type:"Speedpaint"},
    {brand:"army_painter",name:"Glittering Loot",hex:"#d8b854",type:"Speedpaint"},
    {brand:"army_painter",name:"Golden Armour",hex:"#b4903a",type:"Speedpaint"},
    {brand:"army_painter",name:"Aztec Gold",hex:"#c8a038",type:"Speedpaint"},
  ]},
  {family:"Metallic",paints:[
    {brand:"army_painter",name:"Talos Bronze",hex:"#a87a3a",type:"Speedpaint"},
    {brand:"army_painter",name:"Hoard Bronze",hex:"#98703a",type:"Speedpaint"},
    {brand:"army_painter",name:"Brazen Copper",hex:"#b06a3a",type:"Speedpaint"},
  ]},

  // ═══ SPEED: PASTELS / MISC ═══
  {family:"Yellow",paints:[
    {brand:"army_painter",name:"Pastel Yellow",hex:"#f0e8a8",type:"Speedpaint"},
    {brand:"army_painter",name:"Pastel Seafoam",hex:"#a8e0cc",type:"Speedpaint"},
    {brand:"army_painter",name:"Occultist Cloak",hex:"#4a3a52",type:"Speedpaint"},
  ]},

  // ═══ SPEED: MEDIUMS (colourless thinners for the speed ranges) ═══
  {family:"Medium",paints:[
    {brand:"citadel",name:"Contrast Medium",hex:"#e8e8e8",type:"Technical"},
    {brand:"vallejo_gc",name:"Xpress Medium (72.448)",hex:"#e8e8e8",type:"Xpress Color"},
    {brand:"army_painter",name:"Speedpaint Medium",hex:"#e8e8e8",type:"Speedpaint"},
    {brand:"citadel",name:"Lahmian Medium",hex:"#e8e8e8",type:"Technical"},
  ]},

  // ╔═══════════════════════════════════════════════════════════════════════╗
  // ║  WASHES & SHADES — recess shading, applied over any base coat          ║
  // ║  Hex values describe the wash pooled in a recess, not the bottle.     ║
  // ╚═══════════════════════════════════════════════════════════════════════╝

  {family:"Black",paints:[
    {brand:"citadel",name:"Nuln Oil",hex:"#1a1a1e",type:"Shade"},
    {brand:"citadel",name:"Soulblight Grey",hex:"#2a2a2e",type:"Shade"},
    {brand:"vallejo_gc",name:"Black Wash (73.201)",hex:"#1a1a1a",type:"Game Wash"},
    {brand:"army_painter",name:"Dark Tone",hex:"#1a1a1a",type:"Quickshade Wash"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Agrax Earthshade",hex:"#3a2a1a",type:"Shade"},
    {brand:"vallejo_gc",name:"Umber Wash (73.203)",hex:"#4a3020",type:"Game Wash"},
    {brand:"army_painter",name:"Strong Tone",hex:"#4a3020",type:"Quickshade Wash"},
    {brand:"army_painter",name:"Mid Brown",hex:"#5a3a24",type:"Quickshade Wash"},
  ]},
  {family:"Brown",paints:[
    {brand:"citadel",name:"Seraphim Sepia",hex:"#7a5a2a",type:"Shade"},
    {brand:"vallejo_gc",name:"Sepia Wash (73.200)",hex:"#6a4a2a",type:"Game Wash"},
    {brand:"army_painter",name:"Soft Tone",hex:"#6a5a3a",type:"Quickshade Wash"},
    {brand:"army_painter",name:"Light Tone",hex:"#7a6a4a",type:"Quickshade Wash"},
  ]},
  {family:"Flesh",paints:[
    {brand:"citadel",name:"Reikland Fleshshade",hex:"#8a4a30",type:"Shade"},
    {brand:"vallejo_gc",name:"Flesh Wash (73.204)",hex:"#8a5a4a",type:"Game Wash"},
    {brand:"army_painter",name:"Flesh Wash",hex:"#8a4a3a",type:"Quickshade Wash"},
  ]},
  {family:"Red",paints:[
    {brand:"citadel",name:"Carroburg Crimson",hex:"#7a1a2a",type:"Shade"},
    {brand:"citadel",name:"Berserker Bloodshade",hex:"#8a1418",type:"Shade"},
    {brand:"citadel",name:"Targor Rageshade",hex:"#5a1a2a",type:"Shade"},
    {brand:"vallejo_gc",name:"Red Wash (73.206)",hex:"#7a1a1a",type:"Game Wash"},
    {brand:"army_painter",name:"Red Tone",hex:"#7a1a1a",type:"Quickshade Wash"},
  ]},
  {family:"Blue",paints:[
    {brand:"citadel",name:"Drakenhof Nightshade",hex:"#1a2a4a",type:"Shade"},
    {brand:"citadel",name:"Tyran Blue",hex:"#1a3a5a",type:"Shade"},
    {brand:"vallejo_gc",name:"Blue Wash (73.207)",hex:"#1a2a4a",type:"Game Wash"},
    {brand:"army_painter",name:"Blue Tone",hex:"#1a2a4a",type:"Quickshade Wash"},
  ]},
  {family:"Purple",paints:[
    {brand:"citadel",name:"Druchii Violet",hex:"#3a1a4a",type:"Shade"},
    {brand:"vallejo_gc",name:"Violet Wash (73.209)",hex:"#3a1a4a",type:"Game Wash"},
    {brand:"army_painter",name:"Purple Tone",hex:"#3a1a4a",type:"Quickshade Wash"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Biel-Tan Green",hex:"#1a4a2a",type:"Shade"},
    {brand:"citadel",name:"Athonian Camoshade",hex:"#3a4a2a",type:"Shade"},
    {brand:"citadel",name:"Mortarion Grime",hex:"#4a4a2a",type:"Shade"},
    {brand:"citadel",name:"Poxwalker",hex:"#6a6a3a",type:"Shade"},
    {brand:"army_painter",name:"Green Tone",hex:"#2a4a2a",type:"Quickshade Wash"},
    {brand:"army_painter",name:"Military Shader",hex:"#3a4a3a",type:"Quickshade Wash"},
  ]},
  {family:"Green",paints:[
    {brand:"citadel",name:"Coelia Greenshade",hex:"#1a4a4a",type:"Shade"},
    {brand:"citadel",name:"Kroak Green",hex:"#1a5a4a",type:"Shade"},
  ]},
  {family:"Yellow",paints:[
    {brand:"citadel",name:"Casandora Yellow",hex:"#b48a1a",type:"Shade"},
    {brand:"citadel",name:"Fuegan Orange",hex:"#a04a1a",type:"Shade"},
    {brand:"vallejo_gc",name:"Yellow Wash (73.208)",hex:"#b4901a",type:"Game Wash"},
  ]},

  // ╔═══════════════════════════════════════════════════════════════════════╗
  // ║  CITADEL TECHNICAL — texture, effect and varnish products              ║
  // ║  Grouped by effect rather than colour; cross-brand equivalents are     ║
  // ║  approximate since these are formulations, not just pigments.         ║
  // ╚═══════════════════════════════════════════════════════════════════════╝

  {family:"Effect",paints:[
    {brand:"citadel",name:"Blood For The Blood God",hex:"#6a0a0e",type:"Technical"},
    {brand:"citadel",name:"Spiritstone Red",hex:"#c81a2a",type:"Technical"},
  ]},
  {family:"Effect",paints:[
    {brand:"citadel",name:"Nurgles Rot",hex:"#6a7a3a",type:"Technical"},
    {brand:"citadel",name:"Typhus Corrosion",hex:"#2a2418",type:"Technical"},
    {brand:"citadel",name:"Mordant Earth",hex:"#6a5a4a",type:"Technical"},
  ]},
  {family:"Effect",paints:[
    {brand:"citadel",name:"Nihilakh Oxide",hex:"#7ac0b4",type:"Technical"},
    {brand:"citadel",name:"Waystone Green",hex:"#1aa05a",type:"Technical"},
    {brand:"citadel",name:"Tesseract Glow",hex:"#4ae0d0",type:"Technical"},
    {brand:"citadel",name:"Soulstone Blue",hex:"#1a5ac8",type:"Technical"},
  ]},
  {family:"Effect",paints:[
    {brand:"citadel",name:"Valhallan Blizzard",hex:"#f0f0f0",type:"Technical"},
    {brand:"citadel",name:"Astrogranite",hex:"#4a4a4e",type:"Technical"},
    {brand:"citadel",name:"Armageddon Dust",hex:"#8a7a5a",type:"Technical"},
    {brand:"citadel",name:"Stirland Mud",hex:"#5a4a30",type:"Technical"},
  ]},
  {family:"Effect",paints:[
    {brand:"citadel",name:"Martian Ironcrust",hex:"#8a4a2a",type:"Technical"},
    {brand:"citadel",name:"Martian Ironearth",hex:"#a05a2a",type:"Technical"},
    {brand:"citadel",name:"Agrellan Badland",hex:"#a8845a",type:"Technical"},
    {brand:"citadel",name:"Agrellan Earth",hex:"#8a6a4a",type:"Technical"},
  ]},
  {family:"Varnish",paints:[
    {brand:"citadel",name:"Ardcoat",hex:"#f4f4f4",type:"Technical"},
    {brand:"citadel",name:"Stormshield",hex:"#f0f0f0",type:"Technical"},
  ]},
];

/**
 * Stable identity for a paint. Names are unique within a brand, so this also
 * doubles as the key used to persist a collection — do not change its shape
 * without migrating stored collections.
 */
export const paintId = (p: Paint) => `${p.brand}::${p.name}`;

/**
 * Every paint exactly once, in catalog order.
 *
 * A paint can legitimately belong to more than one equivalence group — a
 * red-orange sits in both the Red and Orange slots — so flattening
 * PAINT_GROUPS yields duplicates (649 entries for 621 distinct paints).
 * Anything user-facing must read from here, otherwise the same paint shows up
 * twice in search results and gets counted twice in collection stats.
 */
export const ALL_PAINTS: Paint[] = (() => {
  const seen = new Map<string, Paint>();
  for (const g of PAINT_GROUPS) {
    for (const p of g.paints) {
      const id = paintId(p);
      if (!seen.has(id)) seen.set(id, p);
    }
  }
  return [...seen.values()];
})();

/**
 * Curated equivalents of a paint, unioned across every group it belongs to.
 *
 * Taking only the first matching group (the previous behaviour) silently hid
 * equivalents: Citadel Ushabti Bone appears in both a White and a Bone group,
 * and only ever showed the White one's partners.
 */
export function equivalentsOf(paint: Paint): Paint[] {
  const id = paintId(paint);
  const out = new Map<string, Paint>();
  for (const g of PAINT_GROUPS) {
    if (!g.paints.some(p => paintId(p) === id)) continue;
    for (const p of g.paints) {
      const pi = paintId(p);
      if (pi !== id && !out.has(pi)) out.set(pi, p);
    }
  }
  return [...out.values()];
}
