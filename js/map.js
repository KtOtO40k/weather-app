
const MapManager = {
    maps: {}, 

    
    createMap(widgetId, lat, lon, cityName) {
        const mapId = `map-${widgetId}`;
        
        
        setTimeout(() => {
            
            const map = L.map(mapId).setView([lat, lon], 10);

            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            
            const customIcon = L.divIcon({
                html: '📍',
                className: 'custom-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            
            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            
            
            marker.bindPopup(`
                <strong>${cityName}</strong><br>
                Координаты:<br>
                ${lat.toFixed(4)}, ${lon.toFixed(4)}
            `).openPopup();

            
            this.maps[widgetId] = map;

            
            map.invalidateSize();
        }, 100);
    },

    
    removeMap(widgetId) {
        if (this.maps[widgetId]) {
            this.maps[widgetId].remove();
            delete this.maps[widgetId];
        }
    },

    
    getMapHTML(widgetId) {
        return `<div id="map-${widgetId}" class="widget-map"></div>`;
    }
};