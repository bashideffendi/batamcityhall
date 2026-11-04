/* 3. Cari jejak Trans Batam berdasarkan nama/network/operator */
[out:json][timeout:90];
area(3610660353)->.batam;
(
  nwr["network"~"Trans ?Batam",i](area.batam);
  nwr["operator"~"Trans ?Batam|Dishub",i](area.batam);
  nwr["name"~"Trans ?Batam|Transfer ?point|Halte",i](area.batam);
);
out center tags;
