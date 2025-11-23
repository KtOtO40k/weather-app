
const Validator = {
    
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
    },

    
    validateCityName(cityName) {
        const trimmed = cityName.trim();
        
        if (!trimmed) {
            return { valid: false, message: 'Введите название города' };
        }
        
        if (trimmed.length < 2) {
            return { valid: false, message: 'Название города слишком короткое' };
        }
        
        if (trimmed.length > 100) {
            return { valid: false, message: 'Название города слишком длинное' };
        }
        
        return { valid: true, cityName: trimmed };
    }
};