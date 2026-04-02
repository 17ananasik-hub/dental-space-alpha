const axios = require('axios');

module.exports = async (req, res) => {
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { name, phone, email, comment } = req.body;
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // ПРАВИЛЬНЫЙ URL с api.
        const url = `https://telegram.org{token}/sendMessage`;

        const text = `📩 Нова заявка\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email || '-'}\n💬 Коментар: ${comment || '-'}`;

        await axios.post(url, {
            chat_id: chatId,
            text: text
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Telegram Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ ok: false, error: error.message });
    }
};
