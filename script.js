// APIKEY
const KEY = `cf814f2423d144688de041d108bf6c3c`;

//get button and inputs
const btn_search_weather = document.querySelector('button');
const inp_city = document.querySelector('input');

btn_search_weather.addEventListener('click', e => clearHistory()); //clear old search results
btn_search_weather.addEventListener('click', e => getCurrentWeater(inp_city.value, KEY)); //get current weather
btn_search_weather.addEventListener('click', e => get5dayForecast(inp_city.value, KEY)); // get 5 day forecast


// Get info from weatherbit through api key
function getCurrentWeater(city, key){
  
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}&lang=sv`;

    fetch(url) //Send a request to the API
    .then(responseFunction) //When request is fulfilled, get responseFunction 
    .then(getWeather) //When request is fulfilled, run the function getWeather 
    .catch(errorFunction); // When request is not fulfilled this will equal to error
}

function get5dayForecast(city, key){
  
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}&lang=sv`;

    fetch(url) //Send a request to the API
    .then(responseFunction) //When request is fulfilled, get responseFunction 
    .then(getForecast) //When request is fulfilled, run the function getWeather 
    .catch(errorFunction); // When request is not fulfilled this will equal to error
}


// Checks if the response is ok
// If response is ok, parse with json method
// If not, write a message to the console
function responseFunction(response){

    if(response.status>=200 && response.status<300){
        return response.json();
    }
    else{
        displayErrorMsg(response.status);
        throw 'Error';
    }
}

// Get specific data and img from API
function getWeather(data){
  
    const res_desc = document.querySelector('#current-description');
    const res_temperature = document.querySelector('#current-temp');
    const res_wind = document.querySelector('#current-wind');
    const res_humidity = document.querySelector('#current-humidity');
    const img_icon = document.querySelector('#current-weather div img');

    res_desc.innerText = 'Väder: ' + data.data[0].weather.description;
    res_temperature.innerText = "Temperatur " + Math.round(data.data[0].temp) + " °C";
    res_wind.innerText = "Vindhastighet " + Math.round(data.data[0].wind_spd) + " m/s";
    res_humidity.innerText = "Luftfuktighet " + Math.round(data.data[0].rh) + " %";

    img_icon.src = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
    img_icon.alt = '';
    
}

function getForecast(data){
    const forecastDiv = document.querySelectorAll('#forecast-weather > div');
    const forecast = document.querySelectorAll('#forecast-weather');

    for (let i = 0; i < forecast[0].children.length; i++) {
        forecast[0].children[i].children[0].src = `https://www.weatherbit.io/static/img/icons/${data.data[i+1].weather.icon}.png`;
        forecast[0].children[i].children[0].alt = '';
        forecast[0].children[i].children[1].innerText = data.data[i+1].weather.description;
        forecast[0].children[i].children[2].innerText = Math.round(data.data[i+1].temp) + " °C";

        //add weekday
        const p = document.createElement('p');
        p.className = 'weekday';
        p.innerText = getDayOfWeek(data.data[i+1].datetime);
        forecastDiv[i].insertBefore(p, forecastDiv[i].firstChild);
    }

    
}

// Get the days of the week by the Date.parse() method
function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'][dayOfWeek];
  }

//Clear old result and errormessages before new search
function clearHistory(){
    const res_desc = document.querySelector('#current-description');
    const res_temperature = document.querySelector('#current-temp');
    const res_wind = document.querySelector('#current-wind');
    const res_humidity = document.querySelector('#current-humidity');
    const img_icon = document.querySelector('#current-weather div img');
    const forecast = document.querySelectorAll('#forecast-weather');
    const forecast_weekday = document.querySelectorAll('.weekday');

    res_desc.innerText = "";
    res_temperature.innerText = "";
    res_wind.innerText = "";
    res_humidity.innerText = "";

    img_icon.src = "";
    img_icon.alt = "";

    //clear weekday
    for (let i = 0; i < forecast_weekday.length; i++) {
        forecast_weekday[i].remove();  
    }

    //clear forecast
    for (let i = 0; i < forecast[0].children.length; i++) {

        forecast[0].children[i].children[0].src = ``;
        forecast[0].children[i].children[0].alt = "";
        forecast[0].children[i].children[1].innerText = "";
        forecast[0].children[i].children[2].innerText = "";
    }

    displayErrorMsg(''); //reset error messages
}

  //function to add error messages
  function displayErrorMsg(errorText){
    const errorMsg = document.querySelector('#error-message');
    errorMsg.innerText = errorText;
  }

//function displays search-error to user and print error
function errorFunction(error){
    console.log('Error: ' , error);
    displayErrorMsg('Något gick fel, testa igen och dubbelkolla så att du har skrivit rätt stad');
}