
//Para mostrar el fetch como lo hicimos en clase (no es nada fancy, cat facts que se traducen, no es la mejor calidad esa API)

// getFact();

// function getFact() {
//     let container = document.getElementById("appContainer");
//     fetch(`https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1`)
//         .then(res => res.json())
//         .then(data => {
//             let fact = data;

//             let apiUrl = `https://api.mymemory.translated.net/get?q=${fact.text}&langpair=en|es`;
//             fetch(apiUrl)
//             .then(res => res.json())
//             .then(data => {
//             let translation = data;

//             let text = document.createElement('p');
        
//             text.innerHTML = `${translation.responseData.translatedText}`;
//             container.appendChild(text);
//         })
//         })
//          // .catch(err => console.log(err));
// };

// API para mostrar listados de ofertas de empleo

let url = "https://jooble.org/api/";
let key = "16c35eff-150b-4ce5-b3af-c8b34c1d8c3d";
let params = "{ location: 'mexico'}"

let http = new XMLHttpRequest();
http.open("POST", url + key, true);

http.setRequestHeader("Content-type", "application/json",);
	
http.onreadystatechange = function() {
	if(http.readyState == 4 && http.status == 200) {
		let jobList =(JSON.parse(http.responseText));
        let jobs = jobList.jobs;
        jobs.forEach((job)=>{
            const container = document.getElementById("appContainer")
            const titles = document.createElement("h2");
            titles.innerHTML = `<a href="${job.link}" target="_blank"><h4>${job.title}</h4></a>`;     
            container.appendChild(titles);
            const body = document.createElement("p");
            body.innerText = `${job.snippet}`;     
            container.appendChild(body);           
       })
	}
}
http.send(params);

