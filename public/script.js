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