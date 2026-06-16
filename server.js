/* ============================================================
   ESTUDOTECA SaaS ELITE - SERVIDOR CENTRAL (v10.0 AI FIXED)
   ============================================================ */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

// --- 1. CONFIGURAÇÕES INICIAIS ---
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// --- 2. VALIDAÇÃO DE ENV VARS (IMPORTANTE) ---
if (!process.env.MONGO_URI) {
    console.error("❌ ERRO: MONGO_URI não definida no .env");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("❌ ERRO: JWT_SECRET não definida no .env");
    process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
    console.error("⚠️ AVISO: GEMINI_API_KEY não definida. IA pode falhar.");
}

// --- 3. CONFIGURAÇÃO DA IA (GEMINI) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 4. CONEXÃO MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ SaaS Database: Conectado com sucesso (2026 Ready)"))
    .catch(err => {
        console.error("❌ Erro de conexão MongoDB:", err.message);
        process.exit(1);
    });

// --- 5. MODELOS DE DADOS ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    plan: { type: String, default: 'Elite Member' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const Event = mongoose.model('Event', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    date: String,
    type: { type: String, default: 'study' }
}));

// --- 6. JWT MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Acesso não autorizado." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Sessão expirada." });
        req.user = user;
        next();
    });
};

// --- 7. AUTH ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hash });
        await newUser.save();

        res.status(201).json({ message: "Conta criada com sucesso!" });

    } catch (err) {
        res.status(500).json({ error: "Erro ao criar conta." });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Credenciais inválidas." });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ error: "Credenciais inválidas." });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        });

    } catch (err) {
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// --- 8. IA ---
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
    try {
        const { prompt } = req.body;

        const systemContext =
            "Você é o Tutor IA da EstudoTeca Elite. Explique de forma didática e objetiva.";

        const result = await model.generateContent(systemContext + prompt);
        const response = await result.response;

        res.json({ response: response.text() });

    } catch (err) {
        res.status(500).json({ error: "Erro na IA." });
    }
});

app.post('/api/ai/analyze-essay', authenticateToken, async (req, res) => {
    try {
        const { essayText } = req.body;

        const prompt = `
Analise esta redação (ENEM).
Dê nota de 0 a 1000 e 3 melhorias:

${essayText}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.json({ analysis: response.text() });

    } catch (err) {
        res.status(500).json({ error: "Erro ao analisar redação." });
    }
});

// --- 9. EVENTOS ---
app.get('/api/events', authenticateToken, async (req, res) => {
    const events = await Event.find({ userId: req.user.id });
    res.json(events);
});

app.post('/api/events', authenticateToken, async (req, res) => {
    const event = new Event({ userId: req.user.id, ...req.body });
    await event.save();
    res.status(201).json(event);
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    await Event.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
    });

    res.json({ message: "Removido!" });
});

// --- 10. UPDATE USER (CORRIGIDO) ---
app.put('/api/user/:id', authenticateToken, async (req, res) => {
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ name: updatedUser.name });
});

// --- 11. START SERVER ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 EstudoTeca Elite rodando em: http://localhost:${PORT}`);
});