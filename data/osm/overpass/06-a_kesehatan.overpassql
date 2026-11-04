[out:json][timeout:180];
area(id:3610660353)->.batam;
(
  nwr["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](area.batam);
  nwr["healthcare"~"^(laboratory|physiotherapist|psychotherapist|midwife|centre)$"](area.batam);
);
out center tags;
