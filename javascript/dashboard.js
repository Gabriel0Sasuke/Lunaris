window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dash").classList.add("active");
});

function sidebar(opcao = 1){
    const dashboard = document.getElementById("dash");
    const edit = document.getElementById("edit");
    const album = document.getElementById("album");
    const scan = document.getElementById("scan");
    const admin = document.getElementById("admin");
    const config = document.getElementById("config");

    switch(opcao){
        case 1:
            dashboard.classList.add("active");
            edit.classList.remove("active");
            album.classList.remove("active");
            scan.classList.remove("active");
            admin.classList.remove("active");
            config.classList.remove("active");
            break;
        case 2:
            edit.classList.add("active");
            dashboard.classList.remove("active");
            album.classList.remove("active");
            scan.classList.remove("active");
            admin.classList.remove("active");
            config.classList.remove("active");
            break;    
        case 3:  
            album.classList.add("active");
            edit.classList.remove("active");
            dashboard.classList.remove("active");
            scan.classList.remove("active");
            admin.classList.remove("active");
            config.classList.remove("active");
            break;   
        case 4: 
            scan.classList.add("active");
            edit.classList.remove("active");
            album.classList.remove("active");
            dashboard.classList.remove("active");
            admin.classList.remove("active");
            config.classList.remove("active");
            break;     
        case 5: 
            admin.classList.add("active");
            edit.classList.remove("active");
            album.classList.remove("active");
            scan.classList.remove("active");
            dashboard.classList.remove("active");
            config.classList.remove("active");
            break;
        case 6: 
            config.classList.add("active");
            edit.classList.remove("active");
            album.classList.remove("active");
            scan.classList.remove("active");
            admin.classList.remove("active");
            dashboard.classList.remove("active");
            break;    
}
}

function recolher() {
    const menu = document.getElementById('menulateral');
    menu.classList.toggle('encolhido');
}
