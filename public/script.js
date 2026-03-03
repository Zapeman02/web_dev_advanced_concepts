
const pages = {
    HOME: 'home',
    LOGIN: 'login'
}
let CURRENT_PAGE = pages.HOME

// ================== MAIN ENTRY POINT ===================  
async function createHtmlDom(){
// act as main
// build html dom with header then all venues and then footer
    try{
        createHeader();
        renderMain();

        // menu bar jkpgcity, login
        // search / filter options
        // venueitems based on search
        // footer
        // if logged button is pressed show login screen
        // default show home with venues

    }catch(err){
        console.log('Error building DOM:', err)
    }
}

createHtmlDom()

// ============ NAVIGATION =======================
async function navigateTo(page){
    CURRENT_PAGE = page;
    clearMain();
    renderMain();
}

// =============== PAGE LOADERS =======================

async function renderMain(){
    switch(CURRENT_PAGE){
    case pages.HOME:
        await loadHome();
        break;
    case pages.LOGIN:
        loadLogin();
        break;
    default:
        await loadHome();
    }
}

function clearMain(){
    const main = document.getElementById('main');
    main.innerHTML = ''
}

async function loadHome() {
    createFilterBar();
    const venues = await fetchAllVenues();
    createAllVenueItems(venues);
}

function loadLogin(){
    const div = document.createElement('div');
    div.innerText = 'Go Home';
    div.addEventListener('click', () => {
        navigateTo(pages.HOME);
    })
    const main = document.getElementById('main');
    main.appendChild(div);
}


//================== FETCH FUNCTIONS ======================
//fetch från våra egna apier, och html uppbyggnad
// funktionerna ska dubbelchecka input innan request
// throw new Error('beskriva vad som hänt') om fel
// Returnera jsonobject
//tim
async function fetchAllVenues(){
    const res = await fetch('api/venues')
    if(!res.ok) throw new Error('Failed to fetch venues')
    return res.json()
}


/*
function fetchUser(name){
    fetch('api/users/' + name)
    .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
    })
    .then(data => {
        console.log("Data from db," + data);
    });
}
//fetchUser('testadmin');*/



// ================== DOM BUILDERS =====================
//Kasper HTML moduler med js

function createFilterBar(){

}

function createAllVenueItems(venue){
    const main = document.getElementById("main");
    const container = document.createElement("div");
    container.classList.add("venueItemContainer");
    main.appendChild(container);

    venue.forEach(venue =>{
            createVenueItem(container, venue);
        });
}

function createVenueItem(container, venue){
    const venueItem = document.createElement("div");
    venueItem.id = `venueItem_${venue.id}`;
    venueItem.classList = `venueItem`;

    if(venue.url){
        venueItem.addEventListener('click', () => handleVenueClick(venue.url));
        venueItem.setAttribute('style', 'cursor: pointer;');
    }

    const nameP = document.createElement("p");
    nameP.innerText = venue.name;

    const districtP = document.createElement("p");
    districtP.innerText = venue.district;

    venueItem.appendChild(nameP);
    venueItem.appendChild(districtP);

    container.appendChild(venueItem);

}

function handleVenueClick(url){
    if(!url.startsWith('http://') && !url.startsWith('https://')){
        url = 'https://'+url;
    }
    window.location.href = url;
}

function createHeader(){
    const container = document.createElement('div');
    container.classList.add('headerContainer');

    const headerText = document.createElement('h1');
    headerText.classList.add('headerText');
    headerText.innerText = "JKPGCITY";
    headerText.addEventListener('click', () => navigateTo(pages.HOME));

    container.appendChild(headerText);

    const button = document.createElement('button');
    button.classList.add('headerLoginButton');
    button.innerText = 'Login';
    button.addEventListener('click', () => navigateTo(pages.LOGIN));

    container.appendChild(button);

    const header = document.getElementById('header');
    header.appendChild(container);
}


