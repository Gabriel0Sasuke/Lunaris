const tendenciaContainer = document.getElementById('tendencias');
const tendenciasEsquerda = document.getElementById('tendenciasesquerda');
const tendenciasDireita = document.getElementById('tendenciasdireita');

function rolarEsquerda() {
    tendenciaContainer.scrollLeft -= tendenciaContainer.offsetWidth / 2;
}

function rolarDireita() {
    tendenciaContainer.scrollLeft += tendenciaContainer.offsetWidth / 2;
}

function rolarComScroll(event) {
    event.preventDefault();
    const delta = event.deltaY < 0 ? -300 : 300;

    if (tendenciaContainer.scrollLeft <= 0 && delta < 0) {
        tendenciaContainer.scrollLeft += 50; 
    } else if (tendenciaContainer.scrollLeft >= tendenciaContainer.scrollWidth - tendenciaContainer.offsetWidth && delta > 0) {
        tendenciaContainer.scrollLeft -= 50;
    } else {
        tendenciaContainer.scrollLeft += delta;
    }
}

tendenciasEsquerda.addEventListener('click', rolarEsquerda);
tendenciasDireita.addEventListener('click', rolarDireita);

// Adicionando o evento de scroll do mouse
tendenciaContainer.addEventListener('wheel', rolarComScroll, { passive: false });
