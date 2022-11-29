// API para mostrar listados de ofertas de empleo

let url = "https://jooble.org/api/";
let key = "";
let params = "{ location: 'mexico'}"

let http = new XMLHttpRequest();
http.open("POST", url + key, true);

http.setRequestHeader("Content-type", "application/json",);
	
http.onreadystatechange = function() {
	if(http.readyState == 4 && http.status == 200) {
		let jobList =(JSON.parse(http.responseText));
        let jobs = jobList.jobs;
        jobs.forEach((job)=>{
            const container = document.getElementById("joblist")
            const titles = document.createElement("h2");
            titles.innerHTML = `</br><a href="${job.link}" target="_blank"><h4>${job.title}</h4></a></br>`;     
            container.appendChild(titles);
            const body = document.createElement("p");
            body.innerHTML = `${job.snippet}`;     
            container.appendChild(body);           
       })
	}
}
http.send(params);


//API Weather (using fetch)

// Declaring the variables
let lon;
let lat;
let temperature = document.querySelector(".temp");
let summary = document.querySelector(".summary");
let loc = document.querySelector(".location");
let icon = document.querySelector(".icon");
const kelvin = 273;

//Getting the location
window.addEventListener("load", () => {
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition((position) => {
	lon = position.coords.longitude;
	lat = position.coords.latitude;
	const key = "36f68383de53b2227f6e94d1996ee330";
	const url =`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&`+`lon=${lon}&appid=${key}`;

	// Calling the API
	fetch(url)
		.then((response) => {
		return response.json();
		})
		.then((data) => {
            console.log(data)
            temperature.textContent = Math.floor(data.main.temp - kelvin) + "°C |";
            summary.textContent = data.weather[0].description + " | ";
            loc.textContent = data.name + " | " + data.sys.country;
            icon.innerHTML = `<img class="city-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
		});
	});
}
});
