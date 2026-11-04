[out:json][timeout:120];
area(id:3610660353)->.batam;
nwr["amenity"="place_of_worship"](area.batam); out count;
nwr["amenity"="school"](area.batam);           out count;
node["highway"="bus_stop"](area.batam);        out count;
