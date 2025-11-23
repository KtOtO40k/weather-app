
const App = {
    isLoading: false, 

    
    init() {
        UI.initModeToggle(); 
        this.attachEventListeners();
    },

    
    attachEventListeners() {
        const elements = UI.getFormElements();
        
        
        elements.submitBtn.addEventListener('click', () => {
            this.handleWeatherRequest();
        });

        
        elements.latInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });

        elements.lonInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });

        
        elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });
    },

    
    async handleWeatherRequest() {
       
        if (this.isLoading) {
            console.log('Запрос уже выполняется');
            return;
        }

        
        const inputData = UI.getInputValues();

        let weatherData;
        let coords;

        
        this.isLoading = true;
        
        
        UI.showLoading();

        try {
            
            if (inputData.mode === 'coords') {
                
                const validation = Validator.validateCoordinates(inputData.latitude, inputData.longitude);
                
                if (!validation.valid) {
                    UI.showError(validation.message);
                    return;
                }

                
                weatherData = await WeatherAPI.getWeatherByCoords(
                    validation.latitude, 
                    validation.longitude
                );

                coords = {
                    lat: validation.latitude,
                    lon: validation.longitude
                };

            } else {
                
                const validation = Validator.validateCityName(inputData.cityName);
                
                if (!validation.valid) {
                    UI.showError(validation.message);
                    return;
                }

                
                weatherData = await WeatherAPI.getWeatherByCity(validation.cityName);

                
                coords = weatherData.coordinates;
            }

            
            UI.createWidget(weatherData, coords);

            
            UI.clearInputs();
            
        } catch (error) {
            UI.showError(error.message);
        } finally {
            
            UI.hideLoading();
            this.isLoading = false;
        }
    }
};


document.addEventListener('DOMContentLoaded', () => {
    App.init();
});