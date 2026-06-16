/* ============================================================
   js/dashboard.js - Inteligência SaaS Elite EstudoTeca (v10.4)
   ============================================================ */

const App = {
    currentDate: new Date(),
    notifications: [],
    
    // --- 1. BANCO DE DADOS LOCAL (SIMULADO) ---
    // Todas as disciplinas, incluindo Artes e Educação Física
    subjects: [
        { id: 'por', name: 'Português', icon: 'fa-book', currentYear: 1, progress: 0 },
        { id: 'mat', name: 'Matemática', icon: 'fa-calculator', currentYear: 1, progress: 0 },
        { id: 'fis', name: 'Física', icon: 'fa-atom', currentYear: 1, progress: 0 },
        { id: 'qui', name: 'Química', icon: 'fa-flask', currentYear: 1, progress: 0 },
        { id: 'bio', name: 'Biologia', icon: 'fa-dna', currentYear: 1, progress: 0 },
        { id: 'soc', name: 'Sociologia', icon: 'fa-users', currentYear: 1, progress: 0 },
        { id: 'his', name: 'História', icon: 'fa-landmark', currentYear: 1, progress: 0 },
        { id: 'edf', name: 'Educação Física', icon: 'fa-person-running', currentYear: 1, progress: 0 },
        { id: 'ing', name: 'Inglês', icon: 'fa-language', currentYear: 1, progress: 0 },
        { id: 'geo', name: 'Geografia', icon: 'fa-earth-americas', currentYear: 1, progress: 0 },
        { id: 'art', name: 'Arte', icon: 'fa-palette', currentYear: 1, progress: 0 },
        { id: 'esp', name: 'Espanhol', icon: 'fa-comments', currentYear: 1, progress: 0 },
        { id: 'fil', name: 'Filosofia', icon: 'fa-lightbulb', currentYear: 1, progress: 0 }
    ],

    // Conteúdo das Revisões (Ementas Completas Injetadas)
    revisionData: {
        por: {
            title: "Ementa: Língua Portuguesa",
            video: "https://www.youtube.com/embed/P2XgqQoJmR8",
            image: "https://via.placeholder.com/600x200?text=Literatura+e+Gramatica",
            desc: `
                <strong>1º Ano:</strong> Língua oral e escrita e seus códigos. Gêneros literários. Trovadorismo, Humanismo, Renascimento, Classicismo, Quinhentismo. Figuras de linguagem. Morfologia. Coesão e coerência. Semântica. Fonemas e ortografia. Produção textual.<br><br>
                <strong>2º Ano:</strong> Barroco, Arcadismo, Romantismo, Realismo, Naturalismo, Parnasianismo e Simbolismo. História e cultura africana e indígena. Sintaxe: Relações morfossintáticas. Pontuação, concordância e crase.<br><br>
                <strong>3º Ano:</strong> Pré-Modernismo, Modernismo, Tendências Contemporâneas. Resumo Científico, Resenha, Artigo Científico. Regência, formação de palavras, colocação pronominal. Texto dissertativo-argumentativo.
            `,
            example: "Foco: Prática da leitura, escrita e desenvolvimento do senso crítico argumentativo."
        },
        mat: {
            title: "Ementa: Matemática",
            video: "https://www.youtube.com/embed/f4_X9rX8i5M",
            image: "https://via.placeholder.com/600x200?text=Matematica",
            desc: `
                <strong>1º Ano:</strong> Teoria de Conjuntos, Conjuntos Numéricos, Função Afim, Quadrática, Exponencial, Logaritmo. Matemática Financeira. Estatística, Matrizes, Determinantes e Sistemas Lineares.<br><br>
                <strong>2º Ano:</strong> Progressões (PA e PG). Trigonometria no Triângulo Retângulo e qualquer triângulo. Funções Trigonométricas. Área de Figuras Planas, Geometria Espacial (Poliedros) e Análise Combinatória.<br><br>
                <strong>3º Ano:</strong> Geometria Analítica (retas e circunferência), Números Complexos, Polinômios e Equações Polinomiais.
            `,
            example: "Foco: Modelagem de problemas e raciocínio lógico-quantitativo."
        },
        fis: {
            title: "Ementa: Física",
            video: "https://www.youtube.com/embed/34q2v_W_4O4",
            image: "https://via.placeholder.com/600x200?text=Fisica",
            desc: `
                <strong>1º Ano:</strong> Leis fundamentais do Movimento. Axiomas de Newton. Lei de conservação da quantidade de movimento e da Energia. Conceitos básicos da astronomia.<br><br>
                <strong>2º Ano:</strong> (Abordagem matemática integrada) Teorema de Tales, Pitágoras, Trigonometria aplicada à Física. Geometria Espacial e áreas aplicadas a problemas físicos.<br><br>
                <strong>3º Ano:</strong> Carga elétrica, força elétrica, campo eletromagnético e potencial. Leis de Ampére e Faraday. Introdução à Física Moderna.
            `,
            example: "Foco: Compreensão dos fenômenos naturais através das leis físicas fundamentais."
        },
        qui: {
            title: "Ementa: Química",
            video: "https://www.youtube.com/embed/V5k0t8O8N8g",
            image: "https://via.placeholder.com/600x200?text=Quimica",
            desc: `
                <strong>1º Ano:</strong> Estrutura Atômica; Tabela Periódica; Ligações Químicas; Propriedades da Matéria; Funções Inorgânicas; Reações Químicas e Estequiometria.<br><br>
                <strong>2º Ano:</strong> Soluções; Gases e Propriedades Coligativas; Termoquímica; Eletroquímica; Cinética Química e Equilíbrio Químico.<br><br>
                <strong>3º Ano:</strong> Introdução à Química Orgânica; Estudo do Carbono; Funções, Isomeria e Reações orgânicas; Polímeros e Radioatividade.
            `,
            example: "Foco: Relação entre a estrutura da matéria e as transformações químicas."
        },
        bio: {
            title: "Ementa: Biologia",
            video: "https://www.youtube.com/embed/8-Pndz29P5w",
            image: "https://via.placeholder.com/600x200?text=Biologia",
            desc: `
                <strong>1º Ano:</strong> Origem da vida, características dos seres vivos. Biologia celular: composição química, membranas, organelas, divisão celular e metabolismo. Reprodução, embriologia e histologia.<br><br>
                <strong>2º Ano:</strong> Classificação e nomenclatura. Vírus. Características anatômicas e fisiológicas dos Reinos: Monera, Protista, Fungi, Plantae e Animalia.<br><br>
                <strong>3º Ano:</strong> Genética e Leis de Mendel. Biotecnologia. Evolução biológica. Ecologia: populações, ecossistemas, impactos e desenvolvimento sustentável.
            `,
            example: "Foco: Conhecimento da vida, da célula aos complexos ecossistemas."
        },
        soc: {
            title: "Ementa: Sociologia",
            video: "https://www.youtube.com/embed/Qx4j4y2b5E4",
            image: "https://via.placeholder.com/600x200?text=Sociologia",
            desc: `
                <strong>1º Ano:</strong> O conhecimento humano e científico. Pensamento de Émile Durkheim (fato social). Max Weber (ação social e tipo ideal). Origens do capitalismo e métodos históricos.<br><br>
                <strong>2º Ano:</strong> Pensamento de Karl Marx (alienação, mais-valia, materialismo). Contribuições da Antropologia Social e Estruturalismo. Informática na sociedade e exclusão social no Brasil.
            `,
            example: "Foco: Formação de senso crítico sobre a estrutura da sociedade humana."
        },
        his: {
            title: "Ementa: História",
            video: "https://www.youtube.com/embed/o0Hh7U4-Dxg",
            image: "https://via.placeholder.com/600x200?text=Historia",
            desc: `
                <strong>1º Ano:</strong> Processos políticos, econômicos e culturais em diferentes tempos. Pluralidade epistemológica e tecnológica. Tomada de decisões baseadas em fontes científicas.<br><br>
                <strong>2º Ano:</strong> Trabalho e Sociedade na Idade Moderna. Brasil Colonial e Imperial. Cultura afro-brasileira e indígena. Formação do Estado moderno.<br><br>
                <strong>3º Ano:</strong> Trabalho e Sociedade na Idade Contemporânea. Brasil republicano. História da informática no Brasil. Migrações e desenvolvimento.
            `,
            example: "Foco: Compreender o presente através das transformações do passado."
        },
        edf: {
            title: "Ementa: Educação Física",
            video: "https://www.youtube.com/embed/s3R233_X8cQ",
            image: "https://via.placeholder.com/600x200?text=Educacao+Fisica",
            desc: `
                <strong>Geral:</strong> Atividades corporais e intelectuais: esportes, jogos, dança, lutas e ginástica. Anatomia humana básica (integrada à Biologia) e orientações para a prática de exercícios físicos. Postura e segurança.
            `,
            example: "Foco: Saúde, corpo em movimento e biomecânica corporal."
        },
        ing: {
            title: "Ementa: Inglês",
            video: "https://www.youtube.com/embed/2M9A5L0KkF8",
            image: "https://via.placeholder.com/600x200?text=Ingles",
            desc: `
                <strong>Geral:</strong> Interpretação e tradução de diversos gêneros textuais. Uso de dicionário bilíngue. Vocabulário. Presente simples e contínuo. Modal verbs (can, may, must). Emprego dos advérbios.
            `,
            example: "Foco: Leitura, interpretação instrumental e gramática base."
        },
        geo: {
            title: "Ementa: Geografia",
            video: "https://www.youtube.com/embed/5U7K0sK1A4A",
            image: "https://via.placeholder.com/600x200?text=Geografia",
            desc: `
                <strong>1º Ano:</strong> Cartografia, geotecnologias. Evolução da Terra. Clima, fenômenos climáticos. Vegetação e biomas brasileiros.<br><br>
                <strong>2º Ano:</strong> Recursos naturais e energéticos. Industrialização mundial e brasileira. Geopolítica, Nova Ordem Mundial, Globalização, Conflitos. Demografia, migrações e urbanização.
            `,
            example: "Foco: A relação entre o espaço físico, geopolítico e as ações humanas."
        },
        art: {
            title: "Ementa: Arte",
            video: "https://www.youtube.com/embed/z1H0lDZb7rU",
            image: "https://via.placeholder.com/600x200?text=Artes",
            desc: `
                <strong>Geral:</strong> O papel da arte na formação humana. Música, artes visuais, teatro e dança. Apreciação e criação artística. Arte brasileira e estudo da cultura afro-brasileira e Indígena.
            `,
            example: "Foco: Sensibilidade estética, interpretação e história da arte."
        },
        esp: {
            title: "Ementa: Espanhol",
            video: "https://www.youtube.com/embed/Z5wBkV8sBEE",
            image: "https://via.placeholder.com/600x200?text=Espanhol",
            desc: `
                <strong>Geral:</strong> A língua espanhola no mundo. Portunhol. Saudações. Alfabeto, cores, família, cidades, corpo humano, profissões. Pronomes, Artigos (lo). Verbos ser e estar. Numerais, meses, dias. Interpretação e produção textual.
            `,
            example: "Foco: Vocabulário cotidiano e estrutura base da língua espanhola."
        },
        fil: {
            title: "Ementa: Filosofia",
            video: "https://www.youtube.com/embed/example",
            image: "https://via.placeholder.com/600x200?text=Filosofia",
            desc: `
                <strong>Geral:</strong> Introdução ao pensamento filosófico. Ética, Moral e Política ao longo do tempo. O conhecimento como busca pela verdade. (Integrado de modo reflexivo com as demais áreas humanas).
            `,
            example: "Foco: O questionamento constante e o pensamento crítico."
        }
    },

    // Banco de Questões (Simulado Rápido para não quebrar a tela)
    quizDatabase: {
        por: [{ q: "Qual a figura de linguagem na frase 'A vida é um palco'?", options: ["Metáfora", "Metonímia", "Eufemismo", "Pleonasmo"], correct: 0 }],
        mat: [{ q: "Qual o valor de x na equação 2x + 4 = 10?", options: ["2", "3", "5", "6"], correct: 1 }],
        fis: [{ q: "Qual a fórmula da 2ª Lei de Newton?", options: ["F = m/a", "F = m*a", "E = mc²", "V = d/t"], correct: 1 }],
        qui: [{ q: "A ligação química entre sódio (Na) e cloro (Cl) é do tipo:", options: ["Covalente", "Metálica", "Iônica", "De Hidrogênio"], correct: 2 }],
        bio: [{ q: "Qual o principal organela responsável pela respiração celular?", options: ["Ribossomo", "Estômago", "Mitocôndria", "Complexo de Golgi"], correct: 2 }],
        soc: [{ q: "O conceito de 'Fato Social' foi cunhado por qual sociólogo?", options: ["Karl Marx", "Max Weber", "Émile Durkheim", "Comte"], correct: 2 }],
        his: [{ q: "Em que ano o Brasil foi descoberto?", options: ["1492", "1500", "1532", "1822"], correct: 1 }],
        edf: [{ q: "A corrida de 100 metros rasos é uma atividade de característica:", options: ["Aeróbica", "Anaeróbica", "Isométrica", "Relaxamento"], correct: 1 }],
        ing: [{ q: "What is the correct translation for 'Cachorro'?", options: ["Cat", "Dog", "Bird", "Fish"], correct: 1 }],
        geo: [{ q: "Qual bioma é exclusivamente brasileiro?", options: ["Amazônia", "Cerrado", "Caatinga", "Pampa"], correct: 2 }],
        art: [{ q: "O que caracteriza o 'Renascimento' na arte?", options: ["Movimento do século XX", "Retorno à arte greco-romana", "Arte abstrata", "Uso exclusivo de cores frias"], correct: 1 }],
        esp: [{ q: "Como se diz 'Obrigado' em espanhol?", options: ["Gracias", "Por favor", "Hola", "Adios"], correct: 0 }],
        fil: [{ q: "Quem escreveu o 'Mito da Caverna'?", options: ["Sócrates", "Platão", "Aristóteles", "Kant"], correct: 1 }]
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
        
        // Aqui usamos innerHTML para ler as quebras de linha e o negrito perfeitamente!
        document.getElementById('rev-desc').innerHTML = data.desc;
        
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

    // --- 7. RENDERIZAÇÃO ---
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
                    <button class="btn-card" onclick="App.openRevision('${s.id}')">Ementa</button>
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

// --- FUNÇÃO PARA MANIPULAR O CHAT DA IA DO MENU INFERIOR ---
App.handleAiChatSubmit = async function() {
    const input = document.getElementById('ai-user-input');
    const text = input.value.trim();
    if(!text) return;

    const chatContent = document.getElementById('ai-chat-content');
    
    // Adiciona a msg do usuario na tela
    chatContent.innerHTML += `<div style="text-align:right; margin: 10px 0;">
                                <span style="background:var(--primary); color:var(--secondary); padding:8px 15px; border-radius:15px; display:inline-block;">${text}</span>
                              </div>`;
    input.value = '';
    
    // Mostra 'digitando'
    const typingId = 'typing-' + Date.now();
    chatContent.innerHTML += `<div id="${typingId}" style="text-align:left; margin: 10px 0;">
                                <span style="background:#f1f5f9; padding:8px 15px; border-radius:15px; display:inline-block; font-size:0.9rem;">Processando...</span>
                              </div>`;
    chatContent.scrollTop = chatContent.scrollHeight;

    try {
        const resposta = await apiService.askAI(text);
        document.getElementById(typingId).remove();
        
        chatContent.innerHTML += `<div style="text-align:left; margin: 10px 0;">
                                    <span style="background:#f1f5f9; padding:12px; border-radius:15px; display:inline-block; max-width:90%; font-size:0.95rem;">${resposta}</span>
                                  </div>`;
    } catch (e) {
        document.getElementById(typingId).remove();
        chatContent.innerHTML += `<div style="text-align:left; margin: 10px 0; color:red;">Erro ao contatar a IA. Tente de novo.</div>`;
    }
    chatContent.scrollTop = chatContent.scrollHeight;
};

document.addEventListener('DOMContentLoaded', () => App.init());