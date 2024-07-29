const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-search-Weather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".user-info-container");
const loadingScreen = document.querySelector(".loading-conatiner");

//initiall vaiable need
let currentTab = userTab;
const API_KEY = "630148e262ddeb3283d091635417ca83";
currentTab.classList.add("current-tab");
getfromSessionStorage();

//
userTab.addEventListener("click",() => {
    switchTab(userTab);
})

searchTab.addEventListener("click",() => {
    switchTab(searchTab);
})
//swithcing tabs

function switchTab(clickTab){
    if(currentTab!=clickTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active"))
    {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
}
//check if coordinates are present or not
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-cooridnates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{

        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API Call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc = document.querySelector("[ data-weatherDes]");
    const weatherIcon  = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-Temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = (`${weatherInfo?.main?.temp}`/10)+5.5;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("NO geolocaton data is available")
    }
}
function showPosition(position)
{
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-cooridnates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
//fetching data of api in search bar
const searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    console.log("****", cityName);
    if(cityName === "" ){
    console.log("****IF", cityName);
        return;
    }
    else{

        console.log("****ELSE", cityName);
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    console.log("fetchSearchWeatherInfo");
    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        console.log("Response*****",response);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("ERROR", err);
    }
}