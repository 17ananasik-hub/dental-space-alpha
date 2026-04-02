const axios = require('axios');

module.exports = async (req, res) => {
    // Настройка CORS (чтобы браузер не ругался)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { name, phone, email, comment } = req.body;

        // Берем данные из настроек Vercel
        const TOKEN = process.env.TELEGRAM_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Простая проверка: если токенов нет, выдаем ошибку в логи
        if (!TOKEN || !CHAT_ID) {
            throw new Error("Токены не настроены в Environment Variables");
        }

        const text = `📩 Нова заявка\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email}\n💬 Коммент: ${comment}`;

        await axios.post(`https://telegram.org{TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: text
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("ОШИБКА:", error.message);
        return res.status(500).json({ ok: false, message: error.message });
    }
};
