[out:json][timeout:240];
area(id:3610660353)->.batam;
(
  nwr["leisure"~"^(pitch|sports_centre)$"]["sport"~"padel|badminton|futsal|soccer|basketball|tennis|volleyball"](area.batam);
  nwr["leisure"~"^(swimming_pool|fitness_centre)$"](area.batam);
  nwr["amenity"="place_of_worship"](area.batam);
  nwr["landuse"="cemetery"](area.batam);
);
out center tags;
