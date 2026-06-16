/* ============================================================
   js/services.js - Central de Integração SaaS Elite (v10.4)
   ============================================================ */

const API_URL = "http://localhost:3000/api";

/**
 * 1. SISTEMA DE NOTIFICAÇÕES (TOASTS)
 * Exibe alertas elegantes no estilo SaaS Premium.
 */
function notify(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Ícones dinâmicos
    const icon = type === 'success' ? 'fa-circle-check' : 
                 type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove com animação após 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

/**
 * 2. CORE DA API (apiService)
 * Gerencia a comunicação com o servidor e armazenamento de sessão.
 */
const apiService = {
    
    // --- INTELIGÊNCIA ARTIFICIAL (GEMINI) ---
    async askAI(prompt) {
        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "IA Indisponível");
            return data.response;
        } catch (error) {
            console.error("AI Error:", error);
            throw error;
        }
    },

    // --- AUTENTICAÇÃO ---
    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha no login");
        
        this.saveSession(data.token, data.user);
        return data.user;
    },

    async register(name, email, password) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro no cadastro");
        return data;
    },

    logout() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    // --- CRONOGRAMA & EVENTOS ---
    async getEvents() {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            return await response.json();
        } catch (e) {
            return [];
        }
    },

    // --- PERSISTÊNCIA DE SESSÃO ---
    saveSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_email', user.email);
    }
};