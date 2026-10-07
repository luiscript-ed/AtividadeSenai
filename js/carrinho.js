// 1. Seleciona os elementos do HTML usando as aspas corretas nos IDs
const buttonTERMAL = document.getElementById('TERMAL-WIND'); 
const buttonMOCHILA = document.getElementById('MOCHILA'); 
const buttonDORMIR = document.getElementById('SACO-DE-DORMIR'); 

let valorDORMIR = localStorage.getItem('saco_dormir_selecionado')
let valorMOCHILA = localStorage.getItem('mochila_selecionada')
let valorTERMAL = localStorage.getItem('termal_selecionado')

buttonTERMAL.innerText = valorTERMAL
buttonDORMIR.innerText = valorDORMIR
buttonMOCHILA.innerText = valorMOCHILA