

function resolver_equação(a,b,c){
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        return console.log("Um dos valores inseridos não é um número.");
    } else {
        var delta = b**2 - 4*a*c;
    
        if (delta === 0) {
            var raiz = -b / (2*a);
            return console.log("A raiz única é:", raiz);
        } else if (delta > 0) {
            var raiz1 = (-b + Math.sqrt(delta)) / (2*a);
            var raiz2 = (-b - Math.sqrt(delta)) / (2*a);
            return console.log("As raízes são:", raiz1, "e", raiz2);
        } else {
            return console.log("Não existe raiz real.");
        }
    }


}
var a=document.querySelector("#A")
var b=document.querySelector("#B")
var c=document.querySelector("#C")
var botão=document.querySelector("#botao")
botão.addEventListener("click",resolver_equação(a.value,b.value,c.value))




