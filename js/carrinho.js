const buttonTERMAL = document.getElementById('TERMAL-WIND'); 
const buttonMOCHILA = document.getElementById('MOCHILA'); 
const buttonDORMIR = document.getElementById('SACO-DE-DORMIR'); 

let valorDORMIR = localStorage.getItem('saco_dormir_selecionado') || '0';
let valorMOCHILA = localStorage.getItem('mochila_selecionada') || '0';
let valorTERMAL = localStorage.getItem('termal_selecionado') || '0';

buttonTERMAL.innerText = valorTERMAL;
buttonDORMIR.innerText = valorDORMIR;
buttonMOCHILA.innerText = valorMOCHILA;

const buttonCompra = document.getElementById('comprar');
const compraValor = document.getElementById('compraValor');

buttonCompra.addEventListener('click', function() {
    executar()
});

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function executar() {
    
    let valorTotal = (Number(valorTERMAL) * 17280) + 
                     (Number(valorDORMIR) * 4280) + 
                     (Number(valorMOCHILA) * 999);

    if (valorTotal > 0){
        compraValor.innerText = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const containe = document.querySelector('.overlay');
        containe.classList.add('active');
        
        valorTERMAL = 0;
        valorMOCHILA = 0;
        valorDORMIR = 0;

        buttonTERMAL.innerText = 0;
        buttonDORMIR.innerText = 0;
        buttonMOCHILA.innerText = 0;

        localStorage.setItem('saco_dormir_selecionado', '0');
        localStorage.setItem('mochila_selecionada', '0');
        localStorage.setItem('termal_selecionado', '0');
        
        await esperar(2000); 
        
        containe.classList.remove('active')
    } else {

    }


}