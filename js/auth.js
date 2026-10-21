// Corrigido: Adicionadas as aspas obrigatórias
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const apiLogin = 'http://127.0.0.1:8000/login';
const apiCadastro = 'http://127.0.0.1:8000/cadastro';
const paginaAposLogin = 'http://127.0.0.1:5500/inicial.html';
const paginaAposCadastro = 'http://127.0.0.1:5500/inicial.html';

loginBtn.addEventListener('click', function () {
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

registerBtn.addEventListener('click', function () {
    registerBtn.classList.add('active');
    loginBtn.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const botao = loginForm.querySelector('.submit-btn');
    const dados = {
        email: document.getElementById('loginEmail').value.trim(),
        senha: document.getElementById('loginSenha').value
    };

    botao.disabled = true;
    botao.innerText = 'Entrando...';

    try {
        const resposta = await fetch(apiLogin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.detail || 'Erro ao fazer login');
            return;
        }

        localStorage.setItem('nome', resultado.usuario.nome || '');
        localStorage.setItem('email', dados.email);
        localStorage.setItem('pontos', resultado.usuario.points || 0);
        localStorage.setItem('senha', dados.senha);

        window.location.href = paginaAposLogin;
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    } finally {
        botao.disabled = false;
        botao.innerText = 'Entrar na conta';
    }
});

registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const botao = registerForm.querySelector('.submit-btn');
    const dados = {
        nome: document.getElementById('cadastroNome').value.trim(),
        email: document.getElementById('cadastroEmail').value.trim(),
        senha: document.getElementById('cadastroSenha').value,
        points: 20000 
    };

    botao.disabled = true;
    botao.innerText = 'Cadastrando...';

    try {
        const resposta = await fetch(apiCadastro, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.detail || 'Não foi possível realizar o cadastro.');
            return;
        }

        localStorage.setItem('nome', dados.nome);
        localStorage.setItem('email', dados.email);
        localStorage.setItem('senha', dados.senha);
        localStorage.setItem('pontos', dados.points);

        window.location.href = paginaAposCadastro;
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    } finally {
        botao.disabled = false;
        botao.innerText = 'Criar conta';
    }
});
