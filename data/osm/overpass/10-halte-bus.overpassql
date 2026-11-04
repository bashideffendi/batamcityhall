/* 1. Semua halte bus di Kota Batam (relasi batas 10660353 → area 3610660353) */
[out:json][timeout:90];
area(3610660353)->.batam;
(
  node["highway"="bus_stop"](area.batam);
  node["public_transport"="platform"]["bus"="yes"](area.batam);
  node["public_transport"="stop_position"]["bus"="yes"](area.batam);
);
out body;
