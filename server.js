const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = '8657834343:AAGgJZNjaFprdfn1XR5WX0ea19TAgR5rOO8';
const CHAT_ID = '472254072';

app.post('/send', async (req, res) => {
    try {
        const { name, phone, email, comment } = req.body;

        const text = `📩 Нова заявка
👤 Ім'я: ${name}
📞 Телефон: ${phone}
📧 Email: ${email || '-'}
💬 Коментар: ${comment || '-'}`;

        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        await axios.post(url, {
            chat_id: CHAT_ID,
            text
        });

        console.log('✅ Сообщение успешно отправлено в Telegram');
        res.json({ ok: true });
    } catch (error) {
        console.error('❌ Ошибка отправки:', error.response ? error.response.data : error.message);
        res.status(500).json({ ok: false });
    }
});

app.listen(3000, () => console.log('✅ Server is running on http://localhost:3000'));