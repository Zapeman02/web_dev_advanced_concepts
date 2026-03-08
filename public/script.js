// =========== GLOBAL STATES =================
const pages = {
    HOME: 'home',
    LOGIN: 'login'
}
let CURRENT_PAGE = pages.HOME
let CURRENT_USER = null
let CURRENT_FILTERS = {
    search:'',
    sort: 'nameAsc'
}

// ================== MAIN ENTRY POINT ===================  
async function createHtmlDom(){
// act as main
// build html dom with header then all venues and then footer
    try{
        clearBody();
        createHeader();
        renderMain();

        //TODO if auth token exist make sure to be logged in

    }catch(err){
        console.log('Error building DOM:', err);
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
    main.innerHTML = '';
}
function clearHeader(){
    const header = document.getElementById('header');
    header.innerHTML = '';
}
function clearFooter(){
    const footer = document.getElementById('footer');
    footer.innerHTML = '';
}

function clearBody(){
    clearMain();
    clearHeader();
    clearFooter();
}

async function loadHome() {
    createFilterBar();
    createAdminCrudPanel();
    const venues = await fetchAllVenues();
    console.log('Venues data:', venues)
    const filteredVenues = applyFilters(venues);
    createAllVenueItems(filteredVenues);
}

function loadLogin(){
    createLogin();
}

function reRenderFullPage(){
    CURRENT_PAGE = pages.HOME;
    createHtmlDom();
}

async function reloadVenues(){
    const main = document.getElementById('main');

    const oldContainer = main.querySelector('.venueItemContainer');
    if(oldContainer){
        console.log('removin old venuItems')
        oldContainer.innerHTML = '';
        oldContainer.remove();
    }

    const venues = await fetchAllVenues();
    const filteredVenues = applyFilters(venues);
    createAllVenueItems(filteredVenues);
}

function applyFilters(venues){
    let result = venues;
    const filters = CURRENT_FILTERS;

    if(filters.search){
        result = result.filter(v =>
            v.name.toLowerCase().includes(filters.search.toLowerCase())
        )
    }

    switch(filters.sort){
        case 'nameAsc':
            result.sort((a,b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            result.sort((a,b) => b.name.localeCompare(a.name));
            break;
        case 'districtAsc':
            result.sort((a,b) => {
                distA = a.district || '';
                distB = b.district || '';
                return distA.localeCompare(distB);
            });
            break;
    }

    return result;
}


//================== FETCH FUNCTIONS ======================
// funktionerna ska dubbelchecka input innan request
// throw new Error('beskriva vad som hänt') om fel
// Returnera jsonobject
//tim
async function fetchAllVenues(){
    const res = await fetch('api/venues');
    if(!res.ok) throw new Error('Failed to fetch venues');
    return res.json();
}

async function fetchLogin(username, password){
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username,password}),
        credentials: 'include'
    });
    if(!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Invalid username or password');
    }
    return res.json();
}
async function fetchLogout(){
    const res = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include'
    });
    if(!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Could not log out');
    }
}

function fetchCreateVenue(name, url, district,opening_hours){
    return fetch('api/venues/new', {
        method : 'POST',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify({name,url,district,opening_hours}),
        credentials : 'include'
    })
    .then(res => {
        if(!res.ok){
            return res.json().then(errorData =>{
                throw new Error(errorData.message || 'Failed to create venue')
            })
        }
        return res.json()
    })   
}
function fetchUpdateVenue(id, name, url, district, opening_hours){
    return fetch(`api/venues/${id}`, {
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,url,district,opening_hours}),
        credentials : 'include'
    })
      .then(res => {
        if(!res.ok){
            return res.json().then(errorData =>{
                throw new Error(errorData.message || 'Failed to update venue')
            })
        }
        return res.json()
    })  
}
function fetchDeleteVenue(venueId){
    // fetch delete venue route from server and send token with it

    return fetch(`/api/venues/${venueId}`, {
        method : 'DELETE',
        credentials : 'include'
    })
    .then(res=>{

    if(!res.ok){
        return res.json().then(errorData =>{
            throw new Error(errorData.message || 'Failed to delete venue')
        })
    }
    return res.json()
    })  
    
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
 // TODO
    const main = document.getElementById('main');

    const container = document.createElement('div');
    container.classList.add('filterBarContainer');

    main.appendChild(container);

    const searchInput = document.createElement('input');
    searchInput.classList.add('searchInput')
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeHolder', 'Search for venue');

    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdownContainer');

    const dropdownLabel = document.createElement('label');
    dropdownLabel.classList.add('dropdownLabel');
    dropdownLabel.setAttribute('for', 'filters');
    dropdownContainer.innerText = 'Sort By:';

    const filterSelect = document.createElement('select');
    filterSelect.classList.add('filterSelect');
    filterSelect.setAttribute('name', 'filters');
    filterSelect.setAttribute('id', 'filters');

    const filterOptionNameAsc = document.createElement('option');
    filterOptionNameAsc.setAttribute('value', 'nameAsc');
    filterOptionNameAsc.innerText = 'Name Asc';

    const filterOptionNameDesc = document.createElement('option');
    filterOptionNameDesc.setAttribute('value', 'nameDesc');
    filterOptionNameDesc.innerText = 'Name Desc';

    const filterOptionDistrictAsc = document.createElement('option');
    filterOptionDistrictAsc.setAttribute('value', 'districtAsc');
    filterOptionDistrictAsc.innerText = 'District Asc';

    filterSelect.appendChild(filterOptionNameAsc);
    filterSelect.appendChild(filterOptionNameDesc);
    filterSelect.appendChild(filterOptionDistrictAsc);
    
    dropdownContainer.appendChild(filterSelect);
    dropdownContainer.appendChild(dropdownLabel);

    const button = document.createElement('button');
    button.classList.add('clearSearchButton');
    button.setAttribute('type', 'button');
    button.innerText = "Clear"

    container.appendChild(button);
    container.appendChild(searchInput);
    container.appendChild(dropdownContainer);

    button.addEventListener('click', () => { handleClearClick() })
    searchInput.addEventListener('change', (e) => {handleSearchInput(e.currentTarget)})
    filterSelect.addEventListener('change', (e) => {handleFilterSelect(e.currentTarget)})

}

function handleSearchInput(target){
    CURRENT_FILTERS.search = target.value;
    reloadVenues();
}

function handleFilterSelect(target){
    CURRENT_FILTERS.sort = target.value;
    reloadVenues();
}

function handleClearClick(){
    CURRENT_FILTERS.search = '';
    CURRENT_FILTERS.sort = 'nameAsc';
    navigateTo(pages.HOME)
}

function createAdminCrudPanel(){
    if(CURRENT_USER && CURRENT_USER.isAdmin){
        const container = document.createElement('div');
        container.classList.add('adminCrudPanelContainer');

        const title = document.createElement('h2');
        title.classList.add('crudPanelTitle');
        title.innerText="CRUD Panel";

        container.appendChild(title);

        const crudInputContainer = document.createElement('div');
        crudInputContainer.classList.add('crudInputContainer');
        container.appendChild(crudInputContainer);

        const idInput = createInput(crudInputContainer, "idInput", "Venue ID", "number");
        const nameInput = createInput(crudInputContainer, "nameInput", "Venue Name", "text");
        const urlInput = createInput(crudInputContainer, "urlInput", "Venue URL", "text");
        const districtInput = createInput(crudInputContainer, "districtInput", "Venue District", "text");
        const openingHoursInput = createInput(crudInputContainer, "openingHoursInput", "Opening Hours (Mon-Fri 10-18)", "text");
        
        const crudButtonContainer = document.createElement('div');
        crudButtonContainer.classList.add('crudButtonContainer');
        container.appendChild(crudButtonContainer);

        createButton(crudButtonContainer, "addVenueButton", "Add", () => {addVenueButtonClickHandler(nameInput.value, urlInput.value, districtInput.value,openingHoursInput.value)});
        createButton(crudButtonContainer, "updateVenueButton", "Update", () => {updateVenueButtonClickHandler(idInput.value, nameInput.value, urlInput.value, districtInput.value,openingHoursInput.value)});
        createButton(crudButtonContainer, "deleteVenueButton", "Delete", () => {deleteVenueButtonClickHandler(idInput.value)});


        const main = document.getElementById('main');
        main.appendChild(container);
    }

}

async function deleteVenueButtonClickHandler(id){
    try{
        const res = await fetchDeleteVenue(id);
        alert(`Deleted venue with id:${id} \nRows affected: ${res.rowsAffected}`)
        reloadVenues()
    }catch(err){
        alert('Error deleteing venue:', err.message)
    }
}
async function addVenueButtonClickHandler(name, url, district,opening_hours){
    try{
        const res = await fetchCreateVenue(name,url,district,opening_hours);
        alert(`Added venue: id:${res.result.id}, name:${res.result.name}`)
        reloadVenues()
    }catch(err){
        alert('Error adding venue:', err.message)
    }
}
async function updateVenueButtonClickHandler(id, name, url, district,opening_hours){
    try{
        if (!id) {
            alert('Please enter a Venue ID');
            return;
        }
        
      
        const venues = await fetchAllVenues();
        //get all venues and match the correct id
        const currentVenue = venues.find(v => v.id == id);
        
        if (!currentVenue) {
            alert('Venue not found');
            return;
        }
        
        // create new updated variables and if you dont enter value, keep the old one.
        const updatedName = name || currentVenue.name;
        const updatedUrl = url || currentVenue.url;
        const updatedDistrict = district || currentVenue.district;
        const updatedOpeningHours = opening_hours || currentVenue.opening_hours;
        
        //update the response with updated values
        const res = await fetchUpdateVenue(
            id, 
            updatedName, 
            updatedUrl, 
            updatedDistrict, 
            updatedOpeningHours
        );
        
        alert(`Updated venue: ${res.result.name}`);
        await reloadVenues();
       
       
    }catch(err){
        alert('Error uppdating venue:', err.message)
    }
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
    if (CURRENT_USER && CURRENT_USER.isAdmin) {
        const id = document.createElement("p");
        id.innerText = `ID: ${venue.id}`;
        venueItem.appendChild(id);
    }
    const nameP = document.createElement("p");
    nameP.innerText = venue.name;

    const districtP = document.createElement("p");
    districtP.innerText = venue.district;

    const openingHoursP = document.createElement("p")

    openingHoursP.innerText = venue.opening_hours

    if (venue.opening_hours && venue.opening_hours !== 'More info on website') {
        openingHoursP.innerText = `${venue.opening_hours}`;
    } else {
        openingHoursP.innerText = 'More info on website';
    }
    venueItem.appendChild(nameP);
    venueItem.appendChild(districtP);
    venueItem.appendChild(openingHoursP)
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
    headerText.setAttribute('style', 'cursor: pointer;');

    container.appendChild(headerText);

    const loginContainer = document.createElement('div');

    createLoginButton(loginContainer);
    createLoggedInText(loginContainer);

    container.appendChild(loginContainer)

    const header = document.getElementById('header');
    header.appendChild(container);
}

function createLogin(){
    const container = document.createElement('div');
    container.classList.add('loginFormContainer');

    const form = document.createElement('form');
    form.classList.add('loginForm');

    const text = document.createElement('h2');
    text.classList.add('loginFormText')
    text.innerText = 'Login'
    
    const userNameInput = document.createElement('input');
    userNameInput.classList.add('loginUsernameInput');
    userNameInput.classList.add('input');
    userNameInput.setAttribute('type', 'text');
    userNameInput.setAttribute('placeHolder', 'username');

    const passwordInput = document.createElement('input');
    passwordInput.classList.add('loginUsernameInput');
    passwordInput.classList.add('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('placeHolder', 'password');

    const loginButton = document.createElement('button');
    loginButton.classList.add('loginFormButton');
    loginButton.innerText = "Login";
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleLoginClick(userNameInput.value, passwordInput.value);
    });

    form.appendChild(text);
    form.appendChild(userNameInput);
    form.appendChild(passwordInput);
    form.appendChild(loginButton);

    container.appendChild(form);
    const main = document.getElementById('main');
    main.appendChild(container);
}

function createLoginButton(container){
    const button = document.createElement('button');
    button.classList.add('headerLoginButton');

    if(!CURRENT_USER){
        button.innerText = 'Login';
        button.addEventListener('click', () => navigateTo(pages.LOGIN));
    }else{
        button.innerText = 'Logout';
        button.addEventListener('click', () => handleLogout());
    }

    container.appendChild(button);
}

function createLoggedInText(container){
    if(CURRENT_USER){
        const text = document.createElement('p');
        text.classList.add('loggedInText');
        text.innerText = `logged in as: ${CURRENT_USER.username}`;
        container.appendChild(text);

        if(CURRENT_USER.isAdmin){
        const isAdminText = document.createElement('p');
        isAdminText.classList.add('isAdminText');
        isAdminText.innerText = `isAdmin = true`;
        container.appendChild(isAdminText);
        }
    }
}

function createButton(container, name, text, eventHandler = null){
    const button = document.createElement('button');
    button.classList.add(name);
    button.setAttribute('type', 'button');
    button.innerText = text;
    if(eventHandler){
        button.addEventListener('click', eventHandler);
    }
    container.appendChild(button);
    return button;
}

function createInput(container, name, placeholder, type){
    const input = document.createElement('input');
    input.classList.add(name);
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('type', type);
    container.appendChild(input);

    return input;
}

async function handleLoginClick(username, password){
    try{
        const res = await fetchLogin(username, password);
        CURRENT_USER = res.user;
        console.log('Login successful:', CURRENT_USER);
        reRenderFullPage();
    }catch(err){
        alert('Login failed: ' + err.message);
    }
}

async function handleLogout(){
    //TODO fetch logout
    try{
        const res = await fetchLogout();
        CURRENT_USER = null;
        reRenderFullPage();
    }catch(err){
        alert('error when logging out:', err.message)
    }
}

