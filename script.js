const letras = document.querySelector(".container-letras")
const linhaBackspaceEnter = document.querySelector("#linhaBackspaceEnter")
const linhaTeclado1 = document.querySelector("#linhaTeclado1")
const linhaTeclado2 = document.querySelector("#linhaTeclado2")
const linhaTeclado3 = document.querySelector("#linhaTeclado3")

const teclasLinha1 = ["Q","W","E", "R" , "T" , "Y" , "U", "I", "O", "P" ]
const teclasLinha2 = ["A","S", "D", "F", "G", "H" , "J", "K", "L", "Ç" ]
const teclasLinha3 = ["Z","X","C","V","B", "N", "M"]

const linhas = 6
const colunas = 5

let linhaAtual = 0
let colunaAtual = 0

const palavrasSecretas = [
    "TORNO", "MOTOR", "FRESA", "LOGIN", "INPUT",
    "DADOS", "CABOS", "BROCA", "VIGAS",
    "VOLTS", "LINUX", "AMIGO", "LIVRO", "ROUPA",
    "BEBER", "COMER", "PORTA"
]
let mapaPalavra = {}
let palavraSecreta = palavrasSecretas[Math.floor(Math.random() * palavrasSecretas.length)]

for(let i = 0; i < palavraSecreta.length; i += 1){
    mapaPalavra[palavraSecreta[i]] = i
}

const palpites = []

for (let l = 0; l < linhas; l += 1) {
    palpites[l] = new Array(colunas)
    const linhasLetras = document.createElement("div")
    linhasLetras.setAttribute("id", "linha" + l)
    linhasLetras.setAttribute("class", "linha-letras")

    for(let c = 0; c < colunas; c += 1) {
        const colunaLetra = document.createElement("div")
        colunaLetra.setAttribute("id", "linha" + l + "coluna" + c)
        colunaLetra.setAttribute("class", l == 0 ? "coluna-letra digitando":"coluna-letra")
        linhasLetras.append(colunaLetra)
        palpites[l][c] = "" 
    }

    letras.append(linhasLetras)
}

function verificarPalpite() {
    const palpite = palpites[linhaAtual].join("")
    if (palpite.length !== colunas) {
        return
    }
    const colunaAtuais = document.querySelectorAll(".digitando")
    for (let i = 0; i < colunas; i += 1) {
        const letra = palpite[i]

        if (mapaPalavra[letra] == undefined) {
            colunaAtuais[i].classList.add("errada")
        } else if (mapaPalavra[letra] == i) {
            colunaAtuais[i].classList.add("certa")
        } else {
            colunaAtuais[i].classList.add("deslocada")
        }
    }

    if (palpite == palavraSecreta) {
        alert("Acertou! Parabéns")
        setTimeout(() => location.reload(), 1500) // Atualiza a página após 1.5 segundos
    } else if (linhaAtual == linhas - 1) {
        if (confirm("Errou! A palavra era: " + palavraSecreta + ". Deseja tentar novamente?")) {
            location.reload()
        }
    } else {
        moverParaProximaLinha()
    }
}



function moverParaProximaLinha(){
    const colunaDigitando = document.querySelectorAll(".digitando")
    colunaDigitando.forEach(col => {
        col.classList.remove("digitando")
    })
    linhaAtual += 1
    colunaAtual = 0

    const novaLinha = document.querySelector("#linha"+linhaAtual)
    const novaColunas = novaLinha.querySelectorAll(".coluna-letra")
    novaColunas.forEach(col => {
        col.classList.add("digitando")
    })
}

function clicarTecla(tecla){
    if (colunaAtual == colunas) {
        return 
    }
    const letraAtual = document.querySelector("#linha" + linhaAtual + "coluna" + colunaAtual)
    letraAtual.textContent = tecla 
    palpites[linhaAtual][colunaAtual] = tecla 
    colunaAtual += 1 
}

function criarLinhaTeclado(teclas, container) {
    teclas.forEach(tecla => {
        const botao = document.createElement("button")
        botao.textContent = tecla
        botao.setAttribute("id", tecla)
        botao.addEventListener("click", () => clicarTecla(tecla))
        container.append(botao)
    })
}

criarLinhaTeclado(teclasLinha1, linhaTeclado1)
criarLinhaTeclado(teclasLinha2, linhaTeclado2)
criarLinhaTeclado(teclasLinha3, linhaTeclado3)

function apagarLetra() {
    if(colunaAtual == 0) {
        return
    }
    colunaAtual -= 1 
    palpites[linhaAtual][colunaAtual] = ""
    const letra = document.querySelector("#linha" + linhaAtual + "coluna" + colunaAtual)
    letra.textContent = ""
}

const botaoApagar = document.createElement("button")
botaoApagar.textContent = "⭠"
botaoApagar.addEventListener("click", apagarLetra)
linhaBackspaceEnter.append(botaoApagar)

const botaoEnter = document.createElement("button")
botaoEnter.textContent = "⭢"
botaoEnter.addEventListener("click", verificarPalpite)
linhaBackspaceEnter.append(botaoEnter)

document.onkeydown = function(evt) {
    if(evt.key == "Enter") {
        verificarPalpite()
    } else if (evt.key == "Backspace") {
        apagarLetra()
    } else {
        clicarTecla(evt.key.toUpperCase())
    }        
}
