// Obsługa pierwszego formularza 
document.getElementById('emailForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    fetch('/send-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, type: 'uczestnicy' }) // Dodajemy typ
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd podczas wysyłania kodu');
        }
        return response.text(); 
    })
    .then(data => {
        alert('Kod został wysłany na Twój e-mail');
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('codeForm').style.display = 'block';
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił problem z wysyłką kodu, spróbuj ponownie później.');
    });
});

document.getElementById('codeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const code = document.getElementById('code').value;

    fetch('/verify-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code, type: 'uczestnicy' }) // Dodajemy typ
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Weryfikacja poprawna') {
            alert('Kod poprawny!');
            document.getElementById('verifiedCount').textContent = data.verifiedCount;
        } else {
            alert('Kod niepoprawny, spróbuj ponownie.');
        }
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił problem z weryfikacją kodu, spróbuj ponownie później.');
    });
});

// Obsługa drugiego formularza (nowy kod)
document.getElementById('emailForm_2').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('emailForm_2').querySelector('#email').value;

    fetch('/send-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, type: 'sedziowie' }) // Dodajemy typ
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd podczas wysyłania kodu');
        }
        return response.text(); 
    })
    .then(data => {
        alert('Kod został wysłany na Twój e-mail');
        document.getElementById('emailForm_2').style.display = 'none';
        document.getElementById('codeForm_2').style.display = 'block';
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił problem z wysyłką kodu, spróbuj ponownie później.');
    });
});

document.getElementById('codeForm_2').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('emailForm_2').querySelector('#email').value;
    const code = document.getElementById('codeForm_2').querySelector('#code').value;

    fetch('/verify-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code, type: 'sedziowie' }) // Dodajemy typ
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Weryfikacja poprawna') {
            alert('Kod poprawny!');
            document.getElementById('verifiedCount_2').textContent = data.verifiedCount;
        } else {
            alert('Kod niepoprawny, spróbuj ponownie.');
        }
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił problem z weryfikacją kodu, spróbuj ponownie później.');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/verified-count')
        .then(response => response.json())
        .then(data => {
            // Dla uczestników
            const verifiedCountUczestnicy = data.verifiedCountUczestnicy || 0;
            document.getElementById('verifiedCount').textContent = verifiedCountUczestnicy;

            const progressBar = document.getElementById('progressBar');
            const progressPercentage = Math.min((verifiedCountUczestnicy / 200) * 100, 100);
            progressBar.style.width = progressPercentage + '%';

            // Dla sędziów
            const verifiedCountSedziowie = data.verifiedCountSedziowie || 0;
            document.getElementById('verifiedCount_2').textContent = verifiedCountSedziowie;

            const progressBar_2 = document.getElementById('progressBar_2');
            const progressPercentage_2 = Math.min((verifiedCountSedziowie / 20) * 100, 100);
            progressBar_2.style.width = progressPercentage_2 + '%';
        })
        .catch(error => {
            console.error('Błąd podczas wczytywania liczby zweryfikowanych e-maili:', error);
        });
});

document.querySelectorAll('#main_menu a').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('#main_menu a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

document.getElementById('languageToggle').addEventListener('change', function() {
    if (this.checked) {
        window.location.href = 'Form.html';
    } else {
        window.location.href = 'EnForm.html';
    }
});
document.getElementById('czcionka').addEventListener('click', function(){
    this.classList.toggle('nieczytelne');
    document.querySelectorAll('.changable').forEach(item=>{
        item.classList.toggle('czytelne');
    })
})
