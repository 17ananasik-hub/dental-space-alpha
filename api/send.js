const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { name, phone } = req.body;

        // ВНИМАНИЕ: Проверь, что в настройках Vercel ключи называются ИМЕННО ТАК
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        const url = `https://telegram.org{token}/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text: `Нова заявка: ${name}, ${phone}`
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        // Это выведет подробную ошибку от Telegram в логи Vercel
        console.error('Telegram Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ ok: false, error: error.message });
    }
};
