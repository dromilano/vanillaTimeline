/*Stablish bases for info storage*/

const jobs= [];
const usersName=[];

//Actual Job object
class Job{
    constructor(place,yearS,yearF,id)
    {
        this.place=place;
        this.yearS=yearS;
        this.yearF=yearF;
        this.id=id;
    };
};

/*Add modal to request user's name*/
function requestName(){
    swal({
        title: "Hola!",
        text: "Cuál es tu nombre?",
        content: "input",
        button: true,
    })
    .then((value) => {
        usersName.push(value);
        localStorage.setItem('username', JSON.stringify(usersName));
        let headTitle = document.getElementById('tlTitle');
        headTitle.innerText = `Línea de tiempo de ${usersName}`;
    });
};
document.addEventListener('DOMContentLoaded', function () {
    usersName.push( JSON.parse(localStorage.getItem("username")));
    console.log(usersName);
    if (usersName.every(value => value === null)){
        usersName.splice(0,usersName.length);
        requestName();
    }else{
        swal({
            title: `Que bueno volver a verte, ${usersName}!`,
            text: "Sigamos armando tu línea de tiempo",
            buttons: ["Vamos!", `No soy ${usersName}`], 
        })
        .then((willDelete) => {
            if (willDelete) {
                usersName.splice(0,usersName.length);
                requestName();
            }
        });
        let headTitle = document.getElementById('tlTitle');
        headTitle.innerText = `Línea de tiempo de ${usersName}`;    
    };
});    

/*Create button to save progress */
const save = document.getElementById('saveBtn');
save.addEventListener('click', () => {
    localStorage.removeItem(savedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(jobs));
    swal({
        text: "Se guardó tu progreso",
        icon: "success",
        button: false,
        timer: 1500,
    });
});

/*Create button to delete all saved items and clear screen */
const del = document.getElementById('delBtn');
del.addEventListener('click', () => {
          swal({
            title: "Estás seguro?",
            text: "Una vez borrado, no vas a poder recuperar tu progreso!",
            icon: "warning",
            buttons: ["Mejor no", "Borrar!"],
            closeOnClickOutside: false,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Tus trabajos fueron borrados", {
                icon: "success",
                button: "Gracias!",
              });
              localStorage.removeItem(savedJobs);
              jobs.splice(0,jobs.length);
              let emptyTl = document.getElementById('timeline');
              while (emptyTl.firstChild) {
                  emptyTl.removeChild(emptyTl.firstChild);
              };
            } else {
              swal("No te preocupes, tu progreso sigue guardado!",{
                button: "Menos mal!",
              });
            }
          });
});

/*Create button to load progress */
const load = document.getElementById('loadBtn');
let savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
savedList();
function savedList(){
    load.addEventListener('click', () => {
        savedJobs.forEach(function (savedJobs) {
                let place = savedJobs.place;
                let yearS = savedJobs.yearS;
                let yearF = savedJobs.yearF;
                let id = savedJobs.id;
                let job = new Job(place, yearS, yearF, id);
                //prevent loading duplicates. //Future-me: Revisit this, could be made into a helper?
                let jobsIndex = jobs.findIndex(function(o){
                    return o.id === savedJobs.id;
                });
                jobsIndex !== -1 ? console.log(`Se cargaron todos los trabajos guardados`):jobs.push(job);
            });
            swal({
                text: "Cargamos tu línea de tiempo!",
                icon: "success",
                button: false,
                timer: 1500,
            });
        createTimeLine();
    });
};

/*add jobs to the object*/
function addJob(){
    let place= document.getElementById('company').value;
    let yearS = document.getElementById('start').value;
    let yearF = document.getElementById('end').value;
    let id = new Date().getTime();
    let job = new Job(place,yearS,yearF,id);
    let warning = document.getElementById('invalid');
    let currentYear = new Date().getFullYear();
    function hideWarning(){
        invalid.style.display='none';
    }
    if (place===''||yearS===''|| yearF===''){
        let text = 'Debe completar todos los campos';
        warning.innerHTML = text;
        warning.style.display = 'block'
        window.setTimeout( hideWarning, 3000 );
    } else if (isNaN(yearS) || isNaN(yearF) || yearF > currentYear) {
        let text = 'Ingrese una fecha válida';
        warning.innerHTML = text;
        warning.style.display = 'block'
        window.setTimeout( hideWarning, 3000 );
    } else{
        jobs.push(job);
        document.getElementById('company').value='';
        document.getElementById('start').value='';
        document.getElementById('end').value=''; 
    };   
};

/*Add events to the buttons*/
const send = document.getElementById('addToTimeline');
send.addEventListener('click', () => {
        addJob();
        createTimeLine();
});

/* Show/Hide the creation form */
document.addEventListener('DOMContentLoaded', function () {
    let checkbox = document.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function () {
        const form = document.getElementById('form');
        checkbox.checked ? form.style.display = 'none': form.style.display = 'block';
    });
});


/*Add functionality to sorting slider*/
document.addEventListener('DOMContentLoaded', function () {
    order.addEventListener('change', function () {
        createTimeLine();
    });
});

/*Sort timeline by dates*/
let order = document.getElementById('sortBtn');
function toggleSort(){
    jobs.sort((a, b) => {
        return a.yearS - b.yearS;
    });
    let msgSort = document.getElementById('sortMessage');
    if (order.checked) {
        jobs.reverse((a, b) => a.yearS - b.yearS);
        msgSort.innerHTML = 'Viendo de más nuevo a más viejo';
    }
    else{
        msgSort.innerHTML = 'Viendo de más viejo a más nuevo';
    };
};

/*Add functionality to individual delete button*/ /*Future-me: Revisit this, theere must be a better way to do it*/
//captures the id from the job to delete
let removed = [];
function deleteData(){
    //This deletes the Job object from the const
    //find the id of object deleted from the DOM matching one on the const
    let jobsIndex = jobs.findIndex(function(o){
        return o.id === removed.at(-1);
    });
    if (jobsIndex !== -1) jobs.splice(jobsIndex, 1);
    //This deletes the Job object from the localStorage
    //find the id of object deleted from the DOM matching one on localStorage
    let sjobsIndex = savedJobs.findIndex(function(o){
        return o.id === removed.at(-1);
    });
    if (sjobsIndex !== -1) savedJobs.splice(jobsIndex, 1);
    savedList();
};

/*Create the timeline on the DOM*/
document.getElementsByClassName('container');

//Iterate through the object
function createTimeLine(){
    const tl = document.getElementById('timeline');
    tl.innerHTML = '';

    toggleSort();

    jobs.forEach((years) => {
        const year = document.createElement("h2");
        year.classList.add('years');
        year.innerText = `${years.yearS}-${years.yearF}`;
        const place = document.createElement("p");
        place.innerText = years.place;

        const container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('name', `${years.id}`);

        const delX = document.createElement('div');
        delX.innerHTML = `<div id="x" class="x" tabindex="0" role="button">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15 15">
                                <path d="M3.25,3.25l8.5,8.5M11.75,3.25l-8.5,8.5"></path>
                            </svg>
                        </div>`
        delX.addEventListener('click', () => {
            delX.parentNode.parentNode.remove();
            removed.push(years.id);
            deleteData();
        });

        const content = document.createElement('div');
        content.classList.add('content');

        //Add jobs to the DOM
        tl.appendChild(container);
        container.appendChild(content);
        content.appendChild(delX);
        content.appendChild(year);
        content.appendChild(place);

        //Arrange timeline
        let arrange = document.querySelectorAll('.container');
        let x = document.querySelectorAll('.x');
        arrange.forEach((item, index) => {(index % 2 == 0) ? item.classList.add('left'):item.classList.add('right')});
        x.forEach((item, index) => {(index % 2 == 0) ? item.classList.add('leftSide'):item.classList.add('rightSide')});
    });
};

 



