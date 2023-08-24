function ano_bissexto(anoDigitado) {
    if (anoDigitado === null || anoDigitado === "") {
        console.log("Entrada inválida");
        return; // Retorna para evitar continuar a execução
    }
    
    var ano = parseInt(anoDigitado);
    
    if (isNaN(ano) || ano < 1582 || ano > 2100) {
        console.log("Entrada inválida");
        return; // Retorna para evitar continuar a execução
    }
    
    if ((ano % 4 == 0 && ano % 100 != 0) || (ano % 400 == 0)) {
        console.log("Esse ano é bissexto");
    } else {
        console.log("Não é um ano bissexto.");
    }
}

var botao = document.querySelector("#botao");
var valor = document.querySelector("#ano");

botao.addEventListener("click", function() {
    var ano = valor.value;
    ano_bissexto(ano);
});










