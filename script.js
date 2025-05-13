const btn = document.querySelector("#btn");


btn.addEventListener("click", async (e) => {
    e.preventDefault();
    handleSearch();
});

// Listen for Enter key press
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
    }
});

async function handleSearch()  {
    let cityVal = document.getElementById("input").value;
    console.log(cityVal);

    if(!cityVal){
        cityVal=cityInput.placeholder;
    }

    const apiKey = '4aba37156ed07d3d8bbba9520d61164c'; 
    const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&appid=${apiKey}&units=metric`;
    
    let response = await fetch(apiUrl);

    if(!response.ok){
        alert("city not found");
    }
    let data =  await response.json();
    console.log(data);

    document.getElementById("temp").innerText=data.main.temp + "°C";

    let iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    document.getElementById("image1").src = iconUrl;
    document.getElementById("description").innerText =  data.weather[0].description;
    document.getElementById("city-name").innerText = data.name + " , " + data.sys.country;


    document.getElementById("degrees").innerText=`degrees: `+data.wind.deg;
    document.getElementById("gust").innerText=`gust: `+data.wind.gust;
    document.getElementById("speed").innerText=`speed: `+data.wind.speed;

    const mrng = new Date(data.sys.sunrise * 1000);
    const evng = new Date(data.sys.sunset * 1000);

    document.getElementById("sunr").innerText = `SUNRISE: `+ mrng.toLocaleString();
    document.getElementById("suns").innerText = `SUNSET: `+ evng.toLocaleString();

    document.getElementById("humidity").innerText=data.main.humidity+`%`;
    document.getElementById("pressure").innerText=data.main.pressure +`hPa`;
    document.getElementById("feels").innerText=data.main.feels_like+`°C`;

    const hourUrl=`https://api.openweathermap.org/data/2.5/forecast?q=${cityVal}&appid=${apiKey}&units=metric`;
    let response2 = await fetch(hourUrl);
    let hour_data=await response2.json()
    console.log(hour_data);


    function formatToHourAmPm(dateTimeStr) {
        const date = new Date(dateTimeStr);
        let hours = date.getHours();
        const suffix = hours >= 12 ? 'PM' : 'AM';
      
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
      
        return `${hours}${suffix}`;
      }
      
    let hour_temp=[hour_data.list[0].main.temp, hour_data.list[1].main.temp, hour_data.list[2].main.temp, hour_data.list[3].main.temp, hour_data.list[4].main.temp];
    console.log(hour_temp[0]);

    for (let i = 0; i < hour_temp.length; i++) {
        document.getElementById(`${i+1}`).innerText=formatToHourAmPm(hour_data.list[i].dt_txt);
        document.getElementById(`hour-${i+1}`).innerText= hour_temp[i]+"°C";
    }

    const lastFiveDays = [];

    for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formatted = date.toISOString().split('T')[0];
        lastFiveDays.push(formatted);

    }

    function getEmoji(condition) {
        if (condition.includes("Sunny")) return "☀️";
        if (condition.includes("rain")) return "🌧️";
        if (condition.includes("snow")) return "❄️";
        if (condition.includes("Partly cloudy")) return "⛅";
        if (condition.includes("Cloudy")) return "☁️";
        return "❓";
      }

    let past_api='42f250d8d45942dda4e82739251704';

for (let i = 0; i < lastFiveDays.length; i++) {
    
    let past_Url=`https://api.weatherapi.com/v1/history.json?key=${past_api}&q=${cityVal}&dt=${lastFiveDays[i]}`;
    let res = await fetch(past_Url);
    let past_data= await res.json();
    console.log(past_data);
    
    document.getElementById(`date${i+2}`).innerText=lastFiveDays[i]+":";
    document.getElementById(`temp${i+2}`).innerText=past_data.forecast.forecastday[0].day.maxtemp_c+"°C";
    document.getElementById(`condn${i+2}`).innerText=past_data.forecast.forecastday[0].day.condition.text;
    document.getElementById(`image${i+2}`).innerText = getEmoji(past_data.forecast.forecastday[0].day.condition.text);

}


};

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("input").value = "Hyderabad";  // optional: pre-fill the input
    handleSearch();
});

