const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Safy Backend is Live and Running!');
});

app.post('/api/chat', async (req, res) => {
    const { message, language } = req.body;
    try {
        const response = await axios.post('https://openai.com', {
            model: "gpt-4o",
            messages: [{ role: "user", content: `تحدث بلغة ${language || 'العربية'}: ${message}` }]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.SMART_CHAT_API_KEY}` }
        });
        res.json({ reply: response.data.choices.message.content });
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالذكاء الاصطناعي" });
    }
});

app.post('/api/unreal-worker', async (req, res) => {
    const { type, prompt } = req.body;
    try {
        const unrealServerUrl = process.env.UNREAL_SERVER_URL;
        const response = await axios.post(`${unrealServerUrl}/job`, {
            taskType: type,
            description: prompt
        });
        res.json({ success: true, jobId: response.data.jobId });
    } catch (error) {
        res.status(500).json({ error: "سيرفر الـ Unreal غير متصل حالياً" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});