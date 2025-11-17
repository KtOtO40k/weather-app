// Объект для работы с картами
const MapManager = {
    maps: {}, // Хранилище карт по widgetId

    // Создаём карту для виджета
    createMap(widgetId, lat, lon, cityName) {
        const mapId = `map-${widgetId}`;
        
        // Небольшая задержка, чтобы DOM успел отрендериться
        setTimeout(() => {
            // Инициализируем карту
            const map = L.map(mapId).setView([lat, lon], 10);

            // Добавляем слой карты (тайлы OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            // Создаём кастомную иконку маркера
            const customIcon = L.divIcon({
                html: '📍',
                className: 'custom-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            // Добавляем маркер на карту
            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            
            // Добавляем popup с информацией
            marker.bindPopup(`
                <strong>${cityName}</strong><br>
                Координаты:<br>
                ${lat.toFixed(4)}, ${lon.toFixed(4)}
            `).openPopup();

            // Сохраняем карту
            this.maps[widgetId] = map;

            // Исправляем размеры карты (важно для Leaflet)
            map.invalidateSize();
        }, 100);
    },

    // Удаляем карту
    removeMap(widgetId) {
        if (this.maps[widgetId]) {
            this.maps[widgetId].remove();
            delete this.maps[widgetId];
        }
    },

    // Генерируем HTML для контейнера карты
    getMapHTML(widgetId) {
        return `<div id="map-${widgetId}" class="widget-map"></div>`;
    }
};