/* ============================================================
   js/dashboard.js - Inteligência SaaS Elite EstudoTeca (v10.4)
   ============================================================ */

const App = {
    currentDate: new Date(),
    notifications: [],
    
    // --- 1. BANCO DE DADOS LOCAL (SIMULADO) ---
    subjects: [
        { id: 'mat', name: 'Matemática', icon: 'fa-calculator', currentYear: 1, progress: 0 },
        { id: 'por', name: 'Português', icon: 'fa-language', currentYear: 1, progress: 0 },
        { id: 'fis', name: 'Física', icon: 'fa-atom', currentYear: 1, progress: 0 }
    ],

    // Conteúdo das Revisões (Vídeo, Imagem, Descrição)
    revisionData: {
        mat: {
            title: "Funções de 1º Grau",
            video: "https://www.youtube.com/embed/f4_X9rX8i5M",
            image: "https://static.todamateria.com.br/upload/fu/nc/funcao-de-primeiro-grau-og.jpg",
            desc: "A função do primeiro grau é toda função escrita na forma y = ax + b.",
            example: "Exemplo: Se a=2 e b=3, a função é f(x) = 2x + 3."
        }
        // Adicionar outros conforme necessário...
    },

    // Banco de Questões para Praticar (Quiz)
    quizDatabase: {
        mat: [
            { q: "Qual o valor de x na equação 2x + 4 = 10?", options: ["2", "3", "5", "6"], correct: 1 },
            { q: "A raiz quadrada de 144 é:", options: ["10", "11", "12", "14"], correct: 2 }
        ]
    },

    atividades: JSON.parse(localStorage.getItem('et_atividades')) || [],

    // --- 2. INICIALIZAÇÃO ---
    async init() {
        console.log("🚀 EstudoTeca Elite v10.4 Ativa.");
        if (!localStorage.getItem('token')) { window.location.href = 'login.html'; return; }

        try {
            this.loadUserData();
            this.calculateProgress();
            this.renderSubjects();
            this.renderPDFs();
            this.renderCalendar();
            this.initEventListeners();
            this.showTab('inicio');
        } catch (e) { console.error(e); }
        finally { 
            const loader = document.getElementById('app-loader');
            if(loader) loader.style.display = 'none';
        }
    },

    // --- 3. NAVEGAÇÃO & UI ---
    showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const target = document.getElementById(`tab-${tabId}`);
        if (target) target.classList.add('active');
        const btn = document.querySelector(`[data-tab="${tabId}"]`);
        if (btn) btn.classList.add('active');
        if (tabId === 'agenda') this.renderCalendar();
    },

    showSubTab(subId) {
        document.querySelectorAll('.sub-content-pane').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.sub-link').forEach(l => l.classList.remove('active'));
        document.getElementById(`sub-${subId}`).classList.remove('hidden');
        event.currentTarget.classList.add('active');
    },

    // --- 4. MÓDULO DE REVISÃO (VIDEO + CONTEÚDO) ---
    openRevision(id) {
        const data = this.revisionData[id] || this.revisionData['mat'];
        const modal = document.getElementById('revisionModal');
        
        document.getElementById('rev-title').innerText = data.title;
        document.getElementById('rev-video').src = data.video;
        document.getElementById('rev-desc').innerText = data.desc;
        document.getElementById('rev-img').src = data.image;
        document.getElementById('rev-example').innerText = data.example;

        modal.classList.add('active');
    },

    closeRevision() {
        document.getElementById('revisionModal').classList.remove('active');
        document.getElementById('rev-video').src = ""; // Para o vídeo ao fechar
    },

    // --- 5. MÓDULO DE PRÁTICA (QUIZ ABCD) ---
    startPractice(id) {
        const questions = this.quizDatabase[id] || this.quizDatabase['mat'];
        const box = document.getElementById('quiz-container');
        this.showTab('atividades');

        let quizHTML = `<h3>Praticando ${id.toUpperCase()}</h3>`;
        questions.forEach((q, i) => {
            quizHTML += `
                <div class="quiz-card card" style="margin-bottom:20px; padding:20px">
                    <p><strong>${i+1}. ${q.q}</strong></p>
                    <div class="options-grid">
                        ${q.options.map((opt, optIdx) => `
                            <button class="opt-btn" onclick="App.selectOption(this, ${i}, ${optIdx}, ${q.correct}, '${id}')">
                                <span class="letter">${String.fromCharCode(65 + optIdx)}</span> ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        quizHTML += `<button class="btn btn-primary" onclick="App.finishQuiz('${id}')">Finalizar e Salvar Média</button>`;
        box.innerHTML = quizHTML;
    },

    tempScore: { correct: 0, total: 0 },
    selectOption(btn, qIdx, selIdx, correctIdx, subjectId) {
        const parent = btn.parentElement;
        parent.querySelectorAll('.opt-btn').forEach(b => b.style.pointerEvents = 'none');
        
        if(selIdx === correctIdx) {
            btn.classList.add('correct');
            this.tempScore.correct++;
        } else {
            btn.classList.add('wrong');
            parent.querySelectorAll('.opt-btn')[correctIdx].classList.add('correct');
        }
        this.tempScore.total++;
    },

    finishQuiz(subjectId) {
        const finalGrade = Math.round((this.tempScore.correct / this.tempScore.total) * 100) || 0;
        const atv = { subject: subjectId, score: finalGrade, date: new Date().toLocaleDateString() };
        
        this.atividades.push(atv);
        localStorage.setItem('et_atividades', JSON.stringify(this.atividades));
        
        this.calculateProgress();
        this.renderSubjects();
        this.tempScore = { correct: 0, total: 0 };
        
        notify(`Simulado concluído! Nota: ${finalGrade}%`, 'success');
        this.showTab('disciplinas');
    },

    calculateProgress() {
        this.subjects.forEach(s => {
            const myAtvs = this.atividades.filter(a => s.id === a.subject);
            if(myAtvs.length > 0) {
                const soma = myAtvs.reduce((acc, cur) => acc + cur.score, 0);
                s.progress = Math.round(soma / myAtvs.length);
            }
        });
    },

    // --- 6. CRONOGRAMA & NOTIFICAÇÕES ---
    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const month = this.currentDate.getMonth();
        const year = this.currentDate.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = "day-cell-elite";
            cell.innerHTML = `<span>${day}</span>`;
            cell.onclick = () => {
                const task = prompt(`Agendar para o dia ${day}:`);
                if(task) this.addNotification(task, day);
            };
            grid.appendChild(cell);
        }
        document.getElementById('calendar-month-year').innerText = `${month+1}/${year}`;
    },

    addNotification(text, day) {
        const n = { id: Date.now(), text: `Meta: ${text}`, day: day };
        this.notifications.unshift(n);
        this.updateNotifUI();
        document.getElementById('notif-dot').classList.remove('hidden');
        notify("Tarefa agendada!");
    },

    updateNotifUI() {
        const list = document.getElementById('notif-list');
        list.innerHTML = this.notifications.map(n => `
            <div class="notif-item">
                <i class="fa-solid fa-calendar-check"></i>
                <div><p>${n.text}</p><small>Dia ${n.day}</small></div>
            </div>
        `).join('');
    },

    // --- 7. RENDERIZAÇÃOsubjects ---
    renderSubjects() {
        const grid = document.getElementById('disciplinas-grid');
        if(!grid) return;
        grid.innerHTML = this.subjects.map(s => `
            <div class="subject-card-premium card">
                <div class="year-selector">
                    <button class="year-btn active">1º Ano</button>
                    <button class="year-btn">2º Ano</button>
                    <button class="year-btn">3º Ano</button>
                </div>
                <div class="subject-header">
                    <i class="fa-solid ${s.icon}"></i>
                    <h3>${s.name}</h3>
                </div>
                <div class="progress-box">
                    <div class="progress-info"><span>Média Global</span><span>${s.progress}%</span></div>
                    <div class="progress-container"><div class="progress-fill" style="width:${s.progress}%"></div></div>
                </div>
                <div class="subject-actions">
                    <button class="btn-card" onclick="App.openRevision('${s.id}')">Revisar</button>
                    <button class="btn-card" onclick="App.startPractice('${s.id}')">Praticar</button>
                    <button class="btn-trilha">Abrir Trilha</button>
                </div>
            </div>
        `).join('');
    },

    renderPDFs() {
        const container = document.getElementById('pdf-list-container');
        if(!container) return;
        const pdfs = [
            { t: "ENEM 2024 - Azul", f: "pdfs/enem24.pdf" },
            { t: "ENEM 2023 - Amarelo", f: "pdfs/enem23.pdf" }
        ];
        container.innerHTML = pdfs.map(p => `
            <div class="pdf-card card" onclick="window.open('${p.f}')">
                <i class="fa-solid fa-file-pdf"></i>
                <span>${p.t}</span>
            </div>
        `).join('');
    },

    loadUserData() {
        const name = localStorage.getItem('user_name') || 'Estudante';
        document.querySelectorAll('.u-name, #header-user-name').forEach(el => el.innerText = name);
        const avatar = `https://ui-avatars.com/api/?name=${name}&background=ffb703&color=011627&bold=true`;
        document.querySelectorAll('img[id*="avatar"]').forEach(img => img.src = avatar);
    },

    initEventListeners() {
        document.querySelectorAll('.nav-link[data-tab]').forEach(btn => {
            btn.onclick = () => this.showTab(btn.getAttribute('data-tab'));
        });
    },

    changeMonth(step) { this.currentDate.setMonth(this.currentDate.getMonth() + step); this.renderCalendar(); },
    toggleNotifDropdown() { document.getElementById('notifDropdown').classList.toggle('active'); document.getElementById('notif-dot').classList.add('hidden'); },
    clearNotifs() { this.notifications = []; this.updateNotifUI(); },
    openAiChat() { document.getElementById('aiChatModal').classList.add('active'); },
    closeAiChat() { document.getElementById('aiChatModal').classList.remove('active'); },
    toggleAccordion(id) { document.getElementById(id).classList.toggle('active'); }
};

document.addEventListener('DOMContentLoaded', () => App.init());