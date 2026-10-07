// Seleciona o formulário de busca
const formBusca = document.getElementById('formBusca');
const inputBusca = document.querySelector('.inputText input');
const produtos = document.querySelectorAll('.product');

formBusca.addEventListener('submit', function(event) {
    event.preventDefault();
    const termo = inputBusca.value.trim().toLowerCase();
    
    produtos.forEach(produto => {
        const nomeProduto = produto.querySelector('.product-info h3').textContent.toLowerCase();
        const categoriaProduto = produto.querySelector('.product-info span').textContent.toLowerCase();
        
        if (nomeProduto.includes(termo) || categoriaProduto.includes(termo) || termo === "") {
            produto.classList.remove('escondido');
        } else {
            produto.classList.add('escondido');
        }
    });
});

// 1. Seleciona os elementos do HTML e inicializa os valores numéricos do localStorage
const buttonTERMAL = document.getElementById('TERMAL-WIND');
const buttonMOCHILA = document.getElementById('MOCHILA');
const buttonDORMIR = document.getElementById('SACO-DE-DORMIR');

// Usamos Number() e || 0 para garantir que se o item não existir, comece em zero
let valorTERMAL = Number(localStorage.getItem('termal_selecionado')) || 0;
let valorMOCHILA = Number(localStorage.getItem('mochila_selecionada')) || 0;
let valorDORMIR = Number(localStorage.getItem('saco_dormir_selecionado')) || 0;

// 2. Evento para o botão TERMAL
buttonTERMAL.addEventListener('click', function() {
    valorTERMAL = valorTERMAL + 1; // Sem o "let", atualiza a variável global
    localStorage.setItem('termal_selecionado', valorTERMAL);
    console.log('Equipamento Termal salvo no localStorage! Total:', valorTERMAL);
});

// 3. Evento para o botão MOCHILA
buttonMOCHILA.addEventListener('click', function() {
    valorMOCHILA = valorMOCHILA + 1; // Sem o "let"
    localStorage.setItem('mochila_selecionada', valorMOCHILA);
    console.log('Mochila salva no localStorage! Total:', valorMOCHILA);
});

// 4. Evento para o botão SACO DE DORMIR
buttonDORMIR.addEventListener('click', function() {
    valorDORMIR = valorDORMIR + 1; // Sem o "let"
    localStorage.setItem('saco_dormir_selecionado', valorDORMIR);
    console.log('Saco de dormir salvo no localStorage! Total:', valorDORMIR);
});
