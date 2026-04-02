const axios = require('axios');

module.exports = async (req, res) => {
    // 1. Настройка заголовков (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Логика отправки
    try {
        const { name, phone, email, comment } = req.body;
        const TOKEN = process.env.TELEGRAM_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        await axios.post(`https://telegram.org{TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: `📩 Нова заявка\n👤 Имя: ${name}\n📞 Тел: ${phone}`
        });

        res.status(200).json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
};
