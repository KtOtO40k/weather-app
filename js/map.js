
const MapManager = {
    maps: {}, 


    createMap(widgetId, lat, lon, cityName) {
        const mapId = `map-${widgetId}`;
        
        setTimeout(() => {
            try {
                const mapContainer = document.getElementById(mapId);
                if (!mapContainer) return;


                const delta = 0.05; 
                const bbox = [
                    lon - delta,  
                    lat - delta, 
                    lon + delta,  
                    lat + delta   
                ].join(',');

                const iframe = document.createElement('iframe');
                iframe.width = '100%';
                iframe.height = '300';
                iframe.frameBorder = '0';
                iframe.scrolling = 'no';
                iframe.marginHeight = '0';
                iframe.marginWidth = '0';
                iframe.style.borderRadius = '8px';
                iframe.style.border = '2px solid #e0e0e0';
                
          
                iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
                
                
                mapContainer.innerHTML = '';
                mapContainer.appendChild(iframe);

                

                // Сохраняем ссылку
                this.maps[widgetId] = iframe;

            } catch (error) {
                console.error('Ошибка создания карты:', error);
            }
        }, 100);
    },

    // Удаляем карту
    removeMap(widgetId) {
        if (this.maps[widgetId]) {
            try {
                delete this.maps[widgetId];
            } catch (error) {
                console.error('Ошибка удаления карты:', error);
            }
        }
    },

    // Генерируем HTML для контейнера карты
    getMapHTML(widgetId) {
        return `<div id="map-${widgetId}" class="widget-map"></div>`;
    }
};