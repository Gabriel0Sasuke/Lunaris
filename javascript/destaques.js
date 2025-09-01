let currentIndex = 0; 
const destaques = document.querySelector("#destaques"); 
const destaquesItens = document.querySelectorAll(".destaque"); 
const totalDestaques = destaquesItens.length; 


destaques.style.width = `${totalDestaques * 90}vw`;

function mudarDestaque() {
    currentIndex++; 
    if (currentIndex >= totalDestaques) {
        currentIndex = 0; 
    }
    const offset = -currentIndex * 90; 
    destaques.style.transform = `translateX(${offset}vw)`; 
}


setInterval(mudarDestaque, 5000);
