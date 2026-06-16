/* ============================================================
   js/auth.js - Inteligência de Acesso SaaS EstudoTeca
   ============================================================ */

const App = {
    isLoginMode: true,

    // 1. INICIALIZAÇÃO
    init() {
        console.log("🔒 Auth Module v10.0 - Sistema de Acesso Ativo");
        this.setupEventListeners();
        
        // Foca no campo de e-mail ao carregar
        const emailInput = document.getElementById('authEmail');
        if (emailInput) emailInput.focus();
    },

    // 2. ALTERNAR MODO (LOGIN <-> CADASTRO)
    toggleMode() {
        this.isLoginMode = !this.isLoginMode;

        // Seleção de Elementos
        const nameGroup = document.getElementById('nameGroup');
        const title = document.getElementById('auth-title');
        const subtitle = document.getElementById('auth-subtitle');
        const btnText = document.getElementById('btnText');
        const toggleMsg = document.getElementById('toggleMsg');
        const forgotLink = document.getElementById('forgotLink');
        const form = document.getElementById('authForm');

        form.reset(); // Limpa dados ao trocar

        if (!this.isLoginMode) {
            // Configura para MODO CADASTRO
            title.innerText = "Crie sua conta Elite";
            subtitle.innerText = "Junte-se à plataforma mais avançada para vestibulandos.";
            btnText.innerText = "Finalizar Cadastro";
            toggleMsg.innerHTML = 'Já possui uma conta? <a href="javascript:void(0)" onclick="App.toggleMode()">Fazer Login</a>';
            
            nameGroup.classList.remove('hidden');
            forgotLink.classList.add('hidden');
            document.getElementById('regName').required = true;
        } else {
            // Configura para MODO LOGIN
            title.innerText = "Bem-vindo à Elite";
            subtitle.innerText = "Insira suas credenciais para acessar a plataforma.";
            btnText.innerText = "Acessar Plataforma";
            toggleMsg.innerHTML = 'Não tem uma conta? <a href="javascript:void(0)" onclick="App.toggleMode()">Crie uma agora</a>';
            
            nameGroup.classList.add('hidden');
            forgotLink.classList.remove('hidden');
            document.getElementById('regName').required = false;
        }
    },

    // 3. MOSTRAR/ESCONDER SENHA
    togglePassword() {
        const passInput = document.getElementById('authPass');
        const eyeIcon = document.getElementById('eyeIcon');

        if (passInput.type === 'password') {
            passInput.type = 'text';
            eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passInput.type = 'password';
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    },

    // 4. ESCUTADORES DE EVENTOS
    setupEventListeners() {
        const form = document.getElementById('authForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPass').value;
            const name = document.getElementById('regName').value;

            this.setLoading(true);

            try {
                if (this.isLoginMode) {
                    // Executa Login
                    const user = await apiService.login(email, password);
                    notify(`Bem-vindo, ${user.name.split(' ')[0]}! Acessando sistema...`, "success");
                    
                    // Redireciona para o Dashboard após breve delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);

                } else {
                    // Executa Registro
                    if (name.length < 3) throw new Error("Por favor, insira seu nome completo.");
                    
                    await apiService.register(name, email, password);
                    notify("Conta criada! Agora você já pode entrar.", "success");
                    
                    // Retorna para o modo login automaticamente
                    setTimeout(() => {
                        this.toggleMode();
                        this.setLoading(false);
                    }, 1000);
                }
            } catch (error) {
                notify(error.message || "Erro na autenticação.", "error");
                this.setLoading(false);
            }
        });
    },

    // 5. FEEDBACK DE CARREGAMENTO
    setLoading(active) {
        const btn = document.getElementById('btnAuth');
        const btnText = document.getElementById('btnText');

        if (active) {
            btn.disabled = true;
            btn.style.opacity = "0.7";
            btnText.innerText = "Processando...";
        } else {
            btn.disabled = false;
            btn.style.opacity = "1";
            btnText.innerText = this.isLoginMode ? "Acessar Plataforma" : "Finalizar Cadastro";
        }
    }
};

// Iniciar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init());