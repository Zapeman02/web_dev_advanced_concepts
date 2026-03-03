
//fetch från våra egna apier, och html uppbyggnad
//tim
function fetchAllVenues(){
    fetch('api/venues')
    .then(res=>res.json())
    .then(data=>{
       createAllVenueItems(data)
    })

}
fetchAllVenues()


function fetchUser(name){
    fetch('api/users/' + name)
    .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
    })
    .then(data => {
        console.log("Data from db," + data)
    })
}
//fetchUser('testadmin')




//Kasper HTML moduler med js

function createAllVenueItems(venue){
    const main = document.getElementById("main")
    const container = document.createElement("div")
    container.classList.add("venueItemContainer")
    main.appendChild(container)
    
    venue.forEach(venue =>{
            createVenueItem(container, venue)
        });
}

function createVenueItem(container, venue){
    const venueItem = document.createElement("div")
    venueItem.id = `venueItem_${venue.id}`
    venueItem.classList = `venueItem`

    if(venue.url){
        venueItem.addEventListener('click', e => {
            window.location.href = venue.url
        })
        venueItem.setAttribute('style', 'cursor: pointer;')
    }

    const nameP = document.createElement("p")
    nameP.innerText = venue.name

    const districtP = document.createElement("p")
    districtP.innerText = venue.district

    venueItem.appendChild(nameP)
    venueItem.appendChild(districtP)

    container.appendChild(venueItem)

}