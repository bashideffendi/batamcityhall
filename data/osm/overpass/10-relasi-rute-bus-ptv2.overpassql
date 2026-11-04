/* 2. Relasi rute bus (PTv2) beserta anggota & geometri */
[out:json][timeout:120];
area(3610660353)->.batam;
(
  relation["type"="route"]["route"="bus"](area.batam);
  relation["type"="route_master"]["route_master"="bus"](area.batam);
);
out body;
>;
out skel qt;
