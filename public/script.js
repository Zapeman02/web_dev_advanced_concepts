
//fetch från våra egna apier, och html uppbyggnad
//tim
function fetchAllStores(){
    fetch('api/stores')
    .then(res=>res.json())
    .then(data=>{
        const container = document.getElementById('container')

        container.innerHTML = "<h2>Our stores:</h2>"

        data.forEach(store =>{
            container.innerHTML += `<p>${store.name}</p>`
        })
    })
}
fetchAllStores()


function fetchUser(name){
    fetch('api/users/' + name)
    .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
    })
    .then(data => {
        const userElement = document.getElementById("user")

        userElement.innerText = "Welcome " + name
        console.log("Data from db," + data)
    })
}
fetchUser('testadmin')




//Kasper HTML moduler med js
