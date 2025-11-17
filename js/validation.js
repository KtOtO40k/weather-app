// Объект для валидации координат
const Validator = {
    // Проверяем широту (latitude): от -90 до 90
    validateLatitude(lat) {
        const num = parseFloat(lat);
        
        if (isNaN(num)) {
            return { valid: false, message: 'Широта должна быть числом' };
        }
        
        if (num < -90 || num > 90) {
            return { valid: false, message: 'Широта должна быть от -90 до 90' };
        }
        
        return { valid: true, value: num };
    },

    // Проверяем долготу (longitude): от -180 до 180
    validateLongitude(lon) {
        const num = parseFloat(lon);
        
        if (isNaN(num)) {
            return { valid: false, message: 'Долгота должна быть числом' };
        }
        
        if (num < -180 || num > 180) {
            return { valid: false, message: 'Долгота должна быть от -180 до 180' };
        }
        
        return { valid: true, value: num };
    },

    // Проверяем оба значения сразу
    validateCoordinates(lat, lon) {
        const latResult = this.validateLatitude(lat);
        const lonResult = this.validateLongitude(lon);
        
        if (!latResult.valid) {
            return { valid: false, message: latResult.message };
        }
        
        if (!lonResult.valid) {
            return { valid: false, message: lonResult.message };
        }
        
        return { 
            valid: true, 
            latitude: latResult.value, 
            longitude: lonResult.value 
        };
    }
};