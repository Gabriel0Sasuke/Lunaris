document.getElementById('nsfw').addEventListener('change', function() {
    var aviso = document.getElementById('aviso');
    if (this.checked) {
        aviso.style.display = 'flex';
    } else {
        aviso.style.display = 'none'; 
    }
});
document.getElementById('avisotroll').addEventListener('change', function() {
    if (this.checked) {
        alert('Mentiroso! Você Certamente Não tem mais de 18 anos... Volte Quando Tiver.');
        this.checked = false;
    }
});

