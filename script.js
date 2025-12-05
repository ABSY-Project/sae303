const map = L.map('map').setView([46.603354, 1.888334], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markersCluster = L.markerClusterGroup();

fetch('geo-radar-france.json')
    .then(res => res.json())
    .then(data => {
        data.forEach(r => {
            if (r.latitude && r.longitude) {

                const popup = `
                    <b>Radar n° ${r.numero_de_radar}</b><br>
                    Type : ${r.type_de_radar}<br>
                    Date MS : ${r.date_de_mise_en_service}<br>
                    <b>Vitesse :</b> ${r["vitesse_maximale_autorisee (km/h)"]} km/h
                `;

                const marker = L.marker([r.latitude, r.longitude]).bindPopup(popup);
                markersCluster.addLayer(marker);
            }
        });

        map.addLayer(markersCluster);
    })
    .catch(err => console.error("Erreur JSON :", err));
