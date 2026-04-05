const axios = require('axios');

module.exports = async (req, res) => {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // 1. Получаем данные из формы
        const { name, phone, email, comment } = req.body;
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // 2. ФОРМИРУЕМ ТЕКСТ (без этого будет ошибка "text is not defined")
        const text = `📩 Нова заявка\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email || '-'}\n💬 Коментар: ${comment || '-'}`;

        // 3. ПРАВИЛЬНЫЙ URL (с api. и /bot)
        const url = `https://api.telegram.org/bot8657834343:AAGgJZNjaFprdfn1XR5WX0ea19TAgR5rOO8/sendMessage`;

        if (!token || !chatId) {
            console.error("❌ Ошибка: Ключи не найдены в .env");
            return res.status(500).json({ ok: false, error: "Missing config" });
        }

        // 4. Отправка запроса
        await axios.post(url, {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        });

        console.log("✅ Сообщение успешно отправлено в Telegram!");
        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error('❌ Ошибка API:', error.response ? error.response.data : error.message);
        return res.status(500).json({ ok: false, error: "Telegram API Error" });
    }
};
