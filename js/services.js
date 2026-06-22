/* ============================================================
   js/services.js - Central de Integração EstudoTeca v11.0
   ============================================================ */

const API_URL = "http://localhost:3000/api";

/**
 * 1. SISTEMA GLOBAL DE NOTIFICAÇÕES (TOASTS)
 * Exibe alertas visuais elegantes no canto da tela.
 */
function notify(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Ícone baseado no tipo de mensagem
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
 * Objeto centralizado para comunicação com o Servidor Node.js
 */
const apiService = {
    
    // --- AUTENTICAÇÃO E SESSÃO ---
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Falha no login");
            
            this.saveSession(data.token, data.user);
            return data.user;
        } catch (error) { throw error; }
    },

    async register(name, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro no cadastro");
            return data;
        } catch (error) { throw error; }
    },

    logout() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    // --- GERENCIAMENTO DE CONTA (NOVO) ---
    async updateAccount(userId, newName) {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: newName })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao atualizar");
            
            localStorage.setItem('user_name', data.name);
            return data;
        } catch (error) { throw error; }
    },

    async deleteAccount(userId) {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error("Não foi possível excluir a conta");
            return true;
        } catch (error) { throw error; }
    },

    // --- CRONOGRAMA ---
    async getEvents() {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            return await response.json();
        } catch (e) { return []; }
    },

    async saveEvent(eventData) {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventData)
            });
            return await response.json();
        } catch (e) { return null; }
    },

    // --- UTILITÁRIOS ---
    saveSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_email', user.email);
    }
};