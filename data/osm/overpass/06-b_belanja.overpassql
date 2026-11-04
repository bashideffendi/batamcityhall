[out:json][timeout:180];
area(id:3610660353)->.batam;
(
  nwr["amenity"="marketplace"](area.batam);
  nwr["shop"~"^(mall|supermarket|convenience|hardware|doityourself|stationery|mobile_phone|fabric|electronics)$"](area.batam);
);
out center tags;
