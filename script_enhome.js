document.getElementById('languageToggle').addEventListener('change', function() {
    if (this.checked) {
        window.location.href = 'Home.html';
    } else {
        window.location.href = 'EnHome.html';
    }
});
document.getElementById('font_changer_2').addEventListener('click', function(){
    this.classList.toggle('nieczytelne')
    document.querySelectorAll('.opis').forEach(item=>
        item.classList.toggle('czytelne')
    )
})