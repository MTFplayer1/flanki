const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

const emailFilePathUczestnicy = path.join(__dirname, 'verified_emails.txt');
const emailFilePathSedziowie = path.join(__dirname, 'verified_emails_2.txt');

let emailStorage = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'zapraszamnaflanki@gmail.com',
        pass: '**** **** **** ****'
    }
});

app.post('/send-code', (req, res) => {
    const email = req.body.email;
    const type = req.body.type;
    const emailFilePath = type === 'sedziowie' ? emailFilePathSedziowie : emailFilePathUczestnicy;

    fs.readFile(emailFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Błąd podczas sprawdzania e-maila');
        }

        const emails = data ? data.split('\n').filter(Boolean) : [];
        if (emails.includes(email)) {
            return res.status(400).send('E-mail został już zweryfikowany');
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        emailStorage[email] = verificationCode;

        const mailOptions = {
            from: 'zapraszamnaflanki@gmail.com',
            to: email,
            subject: 'Twój kod weryfikacyjny',
            text: `Twój kod weryfikacyjny to: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Błąd wysyłania:', error);
                return res.status(500).send('Błąd podczas wysyłania e-maila');
            }
            console.log('E-mail wysłany:', info.response);
            res.status(200).send('E-mail wysłany');
        });
    });
});

app.post('/verify-code', (req, res) => {
    const email = req.body.email;
    const code = req.body.code;
    const type = req.body.type;
    const emailFilePath = type === 'sedziowie' ? emailFilePathSedziowie : emailFilePathUczestnicy;

    if (emailStorage[email] && emailStorage[email] === code) {
        fs.appendFile(emailFilePath, `${email}\n`, (err) => {
            if (err) {
                return res.status(500).send('Błąd podczas zapisywania e-maila');
            }

            delete emailStorage[email];

            fs.readFile(emailFilePath, 'utf8', (err, data) => {
                if (err && err.code !== 'ENOENT') {
                    return res.status(500).send('Błąd podczas odczytywania liczby zweryfikowanych e-maili');
                }

                const emails = data ? data.split('\n').filter(Boolean) : [];
                const verifiedCount = emails.length;

                return res.status(200).json({ message: 'Weryfikacja poprawna', verifiedCount });
            });
        });
    } else {
        return res.status(400).send('Kod niepoprawny');
    }
});

app.get('/verified-count', (req, res) => {
    let verifiedCountUczestnicy = 0;
    let verifiedCountSedziowie = 0;

    fs.readFile(emailFilePathUczestnicy, 'utf8', (err, dataUczestnicy) => {
        if (!err && dataUczestnicy) {
            const emailsUczestnicy = dataUczestnicy.split('\n').filter(Boolean);
            verifiedCountUczestnicy = emailsUczestnicy.length;
        }

        fs.readFile(emailFilePathSedziowie, 'utf8', (err, dataSedziowie) => {
            if (!err && dataSedziowie) {
                const emailsSedziowie = dataSedziowie.split('\n').filter(Boolean);
                verifiedCountSedziowie = emailsSedziowie.length;
            }

            res.json({ verifiedCountUczestnicy, verifiedCountSedziowie });
        });
    });
});

app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html'));
});
app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
