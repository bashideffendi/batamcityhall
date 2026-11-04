/* 4. Kerangka jalan utama untuk map-matching jalur koridor */
[out:json][timeout:180];
area(3610660353)->.batam;
way["highway"~"^(trunk|primary|secondary|tertiary)(_link)?$"](area.batam);
out geom;
