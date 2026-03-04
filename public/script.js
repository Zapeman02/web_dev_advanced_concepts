
const pages = {
    HOME: 'home',
    LOGIN: 'login'
}
let CURRENT_PAGE = pages.HOME
let CURRENT_USER = null

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
    createAllVenueItems(venues);
}

function loadLogin(){
    createLogin();
}

function reRenderFullPage(){
    CURRENT_PAGE = pages.HOME;
    createHtmlDom();
}


//================== FETCH FUNCTIONS ======================
//fetch från våra egna apier, och html uppbyggnad
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
 //TODO
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

function handleLogout(){
    //TODO fetch logout
    CURRENT_USER = null;
    reRenderFullPage();
}

