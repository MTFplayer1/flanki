document.getElementById('languageToggle').addEventListener('change', function() {
    if (this.checked) {
        window.location.href = 'EnHome.html';
    } else {
        window.location.href = 'Home.html';
    }
});
document.getElementById('font_changer_2').addEventListener('click', function(){
    this.classList.toggle('nieczytelne')
    document.querySelectorAll('.opis').forEach(item=>
        item.classList.toggle('czytelne')
    )
})