
cpf=document.querySelector("#valor_cpf")
function validar_cpf(cpf){
    if (cpf.length == 11) {
        var indice = 0;
        var soma1 = 0;
    
        for (let i = 10; i > 1; i--) {
            var operacao1 = cpf[indice] * i;
            soma1 += operacao1;
            indice++;
        }
    
        var resto1 = soma1 % 11;
        var digito1;
        if (resto1 < 2) {
            digito1 = 0;
        } else {
            digito1 = 11 - resto1;
        }
    
        var indice2 = 0;
        var soma2 = 0;
    
        for (let i = 11; i > 1; i--) {
            var operacao2 = cpf[indice2] * i;
            soma2 += operacao2;
            indice2++;
        }
    
        var resto2 = soma2 % 11;
        var digito2;
        if (resto2 < 2) {
            digito2 = 0;
        } else {
            digito2 = 11 - resto2;
        }
    
        if (parseInt(cpf[9]) === digito1 && parseInt(cpf[10]) === digito2) {
            console.log("CPF válido");
        } else {
            console.log("CPF inválido");
        }
    } else {
        console.log("CPF inválido Falta de Números");
    }
    
    



}




var botão=document.querySelector("button")
botão.addEventListener("click",validar_cpf(cpf.value))



