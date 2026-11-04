[out:json][timeout:180];
area(id:3610660353)->.batam;
(
  nwr["amenity"~"^(ferry_terminal|fuel|charging_station)$"](area.batam);
  node["highway"="bus_stop"](area.batam);
  nwr["aeroway"="aerodrome"](area.batam);
  relation["route"="bus"](area.batam);
);
out center tags;
