/* ============================================================
   js/dashboard.js - Sistema EstudoTeca v11.2 (Vestibular Final)
   ============================================================ */

const App = {
    currentDate: new Date(),
    notifications: JSON.parse(localStorage.getItem('et_notifications')) || [],
    atividades: JSON.parse(localStorage.getItem('et_atividades')) || [],
    savedEssays: JSON.parse(localStorage.getItem('et_essays')) || [],

    // --- 1. GRADE CURRICULAR COMPLETA ---
    subjects: [
        { id: 'mat', name: 'Matemática', icon: 'fa-calculator', currentYear: 1, progress: 0 },
        { id: 'por', name: 'Português', icon: 'fa-language', currentYear: 1, progress: 0 },
        { id: 'lit', name: 'Literatura', icon: 'fa-book-open', currentYear: 1, progress: 0 },
        { id: 'qui', name: 'Química', icon: 'fa-vial', currentYear: 1, progress: 0 },
        { id: 'fis', name: 'Física', icon: 'fa-atom', currentYear: 1, progress: 0 },
        { id: 'bio', name: 'Biologia', icon: 'fa-dna', currentYear: 1, progress: 0 },
        { id: 'his', name: 'História', icon: 'fa-scroll', currentYear: 1, progress: 0 },
        { id: 'geo', name: 'Geografia', icon: 'fa-earth-americas', currentYear: 1, progress: 0 },
        { id: 'fil', name: 'Filosofia', icon: 'fa-brain', currentYear: 1, progress: 0 },
        { id: 'soc', name: 'Sociologia', icon: 'fa-users', currentYear: 1, progress: 0 },
        { id: 'ing', name: 'Inglês', icon: 'fa-flag-usa', currentYear: 1, progress: 0 },
        { id: 'esp', name: 'Espanhol', icon: 'fa-flag', currentYear: 1, progress: 0 }
    ],

    // --- 2. LISTA DE VESTIBULARES (BASEADO NOS SEUS ARQUIVOS) ---
    // Os arquivos devem estar na pasta: vestibulares/
    vestibularList: [
        { title: "ENEM 2025 - Dia 1 - Branco", file: "vestibulares/2025_PV_impresso_D1_CD3.pdf" },
        { title: "ENEM 2025 - Dia 2 - Verde", file: "vestibulares/2025_PV_impresso_D2_CD8.pdf" },
        { title: "ENEM 2024 - Dia 1 - Azul", file: "vestibulares/2024_PV_impresso_D1_CD1.pdf" },
        { title: "ENEM 2024 - Dia 2 - Azul", file: "vestibulares/2024_PV_impresso_D2_CD7.pdf" },
        { title: "ENEM 2023 - Dia 1 - Azul", file: "vestibulares/2023_PV_impresso_D1_CD1.pdf" },
        { title: "ENEM 2023 - Dia 2 - Amarelo", file: "vestibulares/2023_PV_impresso_D2_CD5.pdf" }
    ],

    // --- 3. BANCO DE DADOS DE REVISÃO ---
    revisionData: {
        mat: {
            title: "Funções de 1º Grau",
            video: "https://www.youtube.com/embed/f4_X9rX8i5M",
            image: "https://static.todamateria.com.br/upload/fu/nc/funcao-de-primeiro-grau-og.jpg",
            desc: "Estudo das relações entre variáveis onde o maior expoente de x é 1.",
            example: "f(x) = ax + b"
        },
        qui: {
            title: "Tabela Periódica",
            video: "https://www.youtube.com/embed/f-N_N29K0kM",
            image: "https://static.todamateria.com.br/upload/ta/be/tabelaperiodica-og.jpg",
            desc: "Organização dos elementos químicos e suas propriedades.",
            example: "Ex: Metais Alcalinos (Família 1A)"
        }
    },

    // --- 4. BANCO DE QUESTÕES (SIMULADOS) ---
    quizDatabase: {
        mat: [
            { q: "Qual o resultado de 3x + 15 = 30?", options: ["x=5", "x=10", "x=15", "x=2"], correct: 0 }
        ],
        simulado_enem: [
            { q: "Qual destes biomas é conhecido por ter solo ácido e ser a 'caixa d'água' do Brasil?", options: ["Cerrado", "Caatinga", "Amazônia", "Pantanal"], correct: 0 },
            { q: "Quem escreveu 'Dom Casmurro'?", options: ["José de Alencar", "Machado de Assis", "Clarice Lispector", "Monteiro Lobato"], correct: 1 }
        ]
    },

    // --- 5. INICIALIZAÇÃO ---
    async init() {
        if (!localStorage.getItem('token')) { window.location.href = 'login.html'; return; }
        try {
            this.loadUserData();
            this.calculateProgress();
            this.renderSubjects();
            this.renderAtividades();
            this.renderCalendar();
            this.renderSavedEssays();
            this.renderVestibularPDFs();
            this.updateNotifUI();
            this.initEventListeners();
            this.showTab('inicio');
            this.showSubTab('provas');
        } catch (e) { console.error(e); }
        finally { document.getElementById('app-loader').style.display = 'none'; }
    },

    // --- 6. NAVEGAÇÃO E ANOS ---
    showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const target = document.getElementById(`tab-${tabId}`);
        if (target) target.classList.add('active');
        const btn = document.querySelector(`[data-tab="${tabId}"]`);
        if (btn) btn.classList.add('active');
        if (tabId === 'configuracoes') this.syncAccountFields();
    },

    showSubTab(subId) {
        document.querySelectorAll('.sub-content-pane').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.sub-link').forEach(l => l.classList.remove('active'));
        document.getElementById(`sub-${subId}`).classList.remove('hidden');
        event.currentTarget.classList.add('active');
        if(subId === 'simulados') this.startQuiz('simulado_enem');
    },

    changeYear(id, year) {
        this.subjects.find(s => s.id === id).currentYear = year;
        this.renderSubjects();
        notify(`Alterado para o ${year}º Ano`);
    },

    // --- 7. REVISÃO E QUIZ ---
    openRevision(id) {
        const data = this.revisionData[id] || this.revisionData['mat'];
        document.getElementById('rev-title').innerText = data.title;
        document.getElementById('rev-video').src = data.video;
        document.getElementById('rev-desc').innerText = data.desc;
        document.getElementById('rev-img').src = data.image;
        document.getElementById('rev-example').innerText = data.example;
        document.getElementById('revisionModal').classList.add('active');
    },

    closeRevision() {
        document.getElementById('revisionModal').classList.remove('active');
        document.getElementById('rev-video').src = "";
    },

    startQuiz(id) {
        const questions = this.quizDatabase[id] || this.quizDatabase['mat'];
        const box = document.getElementById('quiz-container');
        this.showTab('atividades');
        let html = `<h3>Sessão de Prática: ${id.toUpperCase()}</h3><br>`;
        questions.forEach((q, i) => {
            html += `
                <div class="card" style="padding:20px; margin-bottom:15px; border-left:5px solid var(--accent)">
                    <p><strong>${i+1}. ${q.q}</strong></p>
                    <div class="options-grid">
                        ${q.options.map((opt, idx) => `
                            <button class="opt-btn" onclick="App.handleQuizChoice(this, ${idx}, ${q.correct}, '${id}')">
                                <span class="letter">${String.fromCharCode(65 + idx)}</span> ${opt}
                            </button>`).join('')}
                    </div>
                </div>`;
        });
        box.innerHTML = html;
    },

    tempGrade: { correct: 0, total: 0 },
    handleQuizChoice(btn, selected, correct, subject) {
        const parent = btn.parentElement;
        parent.querySelectorAll('.opt-btn').forEach(b => b.style.pointerEvents = 'none');
        if(selected === correct) { btn.classList.add('correct'); this.tempGrade.correct++; }
        else { btn.classList.add('wrong'); parent.querySelectorAll('.opt-btn')[correct].classList.add('correct'); }
        this.tempGrade.total++;
        if(this.tempGrade.total === (this.quizDatabase[subject] || this.quizDatabase['mat']).length) {
            const grade = Math.round((this.tempGrade.correct / this.tempGrade.total) * 100);
            this.atividades.push({ subject, score: grade, date: new Date().toLocaleDateString() });
            localStorage.setItem('et_atividades', JSON.stringify(this.atividades));
            this.calculateProgress(); this.renderSubjects(); this.renderAtividades();
            notify(`Prática salva! Nota: ${grade}%`, 'success');
            this.tempGrade = { correct: 0, total: 0 };
        }
    },

    // --- 8. REDAÇÃO E PDFs (O QUE VOCÊ PEDIU) ---
    renderVestibularPDFs() {
        const container = document.getElementById('pdf-list-container');
        if(!container) return;
        container.innerHTML = this.vestibularList.map(p => `
            <div class="pdf-card card" onclick="window.open('${p.file}', '_blank')">
                <i class="fa-solid fa-file-pdf"></i>
                <span>${p.title}</span>
                <small style="color:red; font-weight:800">PDF OFICIAL</small>
            </div>`).join('');
    },

    saveEssayAsPDF() {
        const title = document.getElementById('essay-title').value;
        const body = document.getElementById('essay-editor').value;
        if(!title || body.length < 20) return notify("Preencha o título e o texto!", "error");

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(20); doc.text(title, 20, 20);
        doc.setFontSize(12); doc.text(body, 20, 40, { maxWidth: 170 });
        doc.save(`${title}.pdf`);

        this.savedEssays.push({ id: Date.now(), title, date: new Date().toLocaleDateString() });
        localStorage.setItem('et_essays', JSON.stringify(this.savedEssays));
        this.renderSavedEssays();
        notify("Redação exportada e salva em 'Meus Arquivos'!");
    },

    renderSavedEssays() {
        const container = document.getElementById('saved-essays-container');
        if(container) container.innerHTML = this.savedEssays.length ? this.savedEssays.map(e => `
            <div class="pdf-card card">
                <i class="fa-solid fa-file-signature" style="color:var(--accent)"></i>
                <span>${e.title}</span><small>${e.date}</small>
            </div>`).join('') : "<p>Nenhuma redação salva.</p>";
    },

    // --- 9. CRONOGRAMA E NOTIFICAÇÕES ---
    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = "day-cell-elite";
            cell.innerHTML = `<span>${day}</span>`;
            cell.onclick = () => {
                const task = prompt(`📅 O que estudar no dia ${day}?`);
                if(task) {
                    this.notifications.unshift({ id: Date.now(), text: `Meta: ${task}`, date: `${day}/${this.currentDate.getMonth()+1}` });
                    localStorage.setItem('et_notifications', JSON.stringify(this.notifications));
                    this.updateNotifUI(); notify("Tarefa agendada!");
                }
            };
            grid.appendChild(cell);
        }
        document.getElementById('calendar-month-year').innerText = `${this.currentDate.getMonth()+1}/${this.currentDate.getFullYear()}`;
    },

    updateNotifUI() {
        const list = document.getElementById('notif-list');
        const dot = document.getElementById('notif-dot');
        if(!list) return;
        if(this.notifications.length > 0) dot.classList.remove('hidden');
        list.innerHTML = this.notifications.map(n => `
            <div class="notif-item"><i class="fa-solid fa-bell"></i><div><p>${n.text}</p><small>${n.date}</small></div></div>`).join('');
    },

    // --- 10. CONTA ---
    syncAccountFields() {
        document.getElementById('config-name').value = localStorage.getItem('user_name');
        document.getElementById('config-email').value = localStorage.getItem('user_email');
    },

    async updateAccount() {
        const newName = document.getElementById('config-name').value;
        try { await apiService.updateAccount(localStorage.getItem('user_id'), newName); this.loadUserData(); notify("Perfil atualizado!"); }
        catch (e) { notify("Erro ao atualizar", "error"); }
    },

    async deleteAccount() {
        if(!confirm("Deseja realmente excluir sua conta?")) return;
        try { await apiService.deleteAccount(localStorage.getItem('user_id')); apiService.logout(); }
        catch (e) { notify("Erro ao excluir", "error"); }
    },

    // --- UTILS ---
    calculateProgress() {
        this.subjects.forEach(s => {
            const atvs = this.atividades.filter(a => a.subject === s.id);
            s.progress = atvs.length ? Math.round(atvs.reduce((acc, cur) => acc + cur.score, 0) / atvs.length) : 0;
        });
    },

    loadUserData() {
        const name = localStorage.getItem('user_name') || 'Estudante';
        document.getElementById('sidebar-user-name').innerText = name;
        document.getElementById('header-user-name').innerText = `Olá, ${name.split(' ')[0]}`;
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffb703&color=011627&bold=true`;
        document.querySelectorAll('img[id*="avatar"]').forEach(img => img.src = avatar);
    },

    renderSubjects() {
        const grid = document.getElementById('disciplinas-grid');
        if(!grid) return;
        grid.innerHTML = this.subjects.map(s => `
            <div class="subject-card-premium card">
                <div class="year-selector">
                    <button class="year-btn ${s.currentYear === 1 ? 'active' : ''}" onclick="App.changeYear('${s.id}', 1)">1º</button>
                    <button class="year-btn ${s.currentYear === 2 ? 'active' : ''}" onclick="App.changeYear('${s.id}', 2)">2º</button>
                    <button class="year-btn ${s.currentYear === 3 ? 'active' : ''}" onclick="App.changeYear('${s.id}', 3)">3º</button>
                </div>
                <div class="subject-header"><i class="fa-solid ${s.icon}"></i><h3>${s.name}</h3></div>
                <div class="progress-box">
                    <div class="progress-info"><span>Domínio</span><span>${s.progress}%</span></div>
                    <div class="progress-container"><div class="progress-fill" style="width:${s.progress}%"></div></div>
                </div>
                <div class="subject-actions">
                    <button class="btn-card" onclick="App.openRevision('${s.id}')">Revisar</button>
                    <button class="btn-card" onclick="App.startQuiz('${s.id}')">Praticar</button>
                </div>
            </div>`).join('');
    },

    renderAtividades() {
        const list = document.getElementById('atividades-list');
        if(list) list.innerHTML = this.atividades.map(a => `
            <div class="atividade-item card">
                <div class="atv-info"><h4>${a.subject.toUpperCase()}</h4><small>${a.date}</small></div>
                <div class="badge-nota">Nota: ${a.score}%</div>
            </div>`).join('');
    },

    initEventListeners() {
        document.querySelectorAll('.nav-link[data-tab]').forEach(b => b.onclick = () => this.showTab(b.getAttribute('data-tab')));
        document.querySelectorAll('.user-profile-header, .profile-accordion').forEach(el => el.onclick = () => this.showTab('configuracoes'));
        document.getElementById('essay-editor').oninput = (e) => document.getElementById('char-count').innerText = `${e.target.value.length} caracteres`;
    },

    toggleAccordion(id) { document.getElementById(id).classList.toggle('active'); },
    toggleNotifDropdown() { document.getElementById('notifDropdown').classList.toggle('active'); document.getElementById('notif-dot').classList.add('hidden'); },
    clearNotifs() { this.notifications = []; localStorage.setItem('et_notifications', '[]'); this.updateNotifUI(); },
    changeMonth(step) { this.currentDate.setMonth(this.currentDate.getMonth() + step); this.renderCalendar(); }
};

document.addEventListener('DOMContentLoaded', () => App.init());