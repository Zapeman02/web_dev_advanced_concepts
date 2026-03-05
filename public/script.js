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

        // menu bar jkpgcity, login
        // search / filter options
        // venueitems based on search
        // footer
        // if logged button is pressed show login screen
        // default show home with venues

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
    const venues = await fetchAllVenues();
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
    const filters = CURRENT_FILTERS

    if(filters.search){
        result = result.filter(v =>
            v.name.toLowerCase().includes(filters.search.toLowerCase())
        )
    }

    switch(filters.sort){
        case 'nameAsc':
            result.sort((a,b) => a.name.localeCompare(b.name))
            break;
        case 'nameDesc':
            result.sort((a,b) => b.name.localeCompare(a.name))
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
    //TODO login user and return user object and authToken

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
    //TODO logout user make sure authtoken is removed
}

function fetchCreateVenue(name, url, district){
    // fetch create venue route from server and send token with it

    /* example
    fetch('/api/venues/new', {
        method: 'PUT',
        body: JSON.stringify({name, url, district}),
        credentials: 'include'
    })
        if(!res.ok) throw new Error('Invalid Venue Values')
        return res.json()
    */
}
function fetchUpdateVenue(){
    // fetch update venue route from server and send token with it
}
function fetchDeleteVenue(){
    // fetch delete venue route from server and send token with it
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

    filterSelect.appendChild(filterOptionNameAsc);
    filterSelect.appendChild(filterOptionNameDesc);
    
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
// TODO
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

