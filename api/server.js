const axios = require('axios');

module.exports = async (req, res) => {
    // Разрешаем запросы (аналог CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, phone, email, comment } = req.body;

        // Используем переменные окружения вместо прямых токенов!
        const TOKEN = process.env.TELEGRAM_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        const text = `📩 Нова заявка\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email || '-'}\n💬 Коментар: ${comment || '-'}`;

        await axios.post(`https://telegram.org{TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};
