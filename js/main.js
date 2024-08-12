var engine = {
    "cores": ['green', 'purple', 'pink', 'red', 'yellow', 'black', 'orange', 'gray'],
    "hexadecimais": {
        'green': '#02ef00',
        'purple': '#790093',
        'pink': '#FFC0CB',
        'red': '#e90808',
        'yellow': '#e7d703',
        'black': '#141414',
        'orange': '#f16529',
        'gray': '#ebebeb',
    },
    "moedas": 0
}

const audioMoeda = new Audio('audios/audio_moeda.mp3');
const audioErrou = new Audio('audios/audio_errou.mp3')

var corAnterior = '';

function sortearCor() {
    var indexCorSorteada;
    var nomeCorSorteada;

    do {
        indexCorSorteada = Math.floor(Math.random() * engine.cores.length);
        nomeCorSorteada = engine.cores[indexCorSorteada];
    } while (nomeCorSorteada === corAnterior)

    corAnterior = nomeCorSorteada; // Atualiza a cor anterior

    var legendaCorDaCaixa = document.getElementById('cor-na-caixa');
    legendaCorDaCaixa.innerText = nomeCorSorteada.toUpperCase();

    return engine.hexadecimais[nomeCorSorteada]
}

function aplicarCorNaCaixa(nomeDaCor) {
    var caixaDasCores = document.getElementById('cor-atual');
    caixaDasCores.style.backgroundColor = nomeDaCor;
    caixaDasCores.style.backgroundImage = "url('./img/caixa-fechada.png')";
    caixaDasCores.style.backgroundSize = "100%";
}

function atualizaPontuacao(valor) {
    var pontuacao = document.getElementById('pontuacao-atual');
    engine.moedas += valor;

    if (valor < 0) {
        audioErrou.play()
    } else {
        audioMoeda.play()
    }

    pontuacao.innerText = engine.moedas;

}

aplicarCorNaCaixa(sortearCor())

//Api de reconhecimento de voz

var btnGravador = document.getElementById('btn-responder');
var transcricaoAudio = "";
var respostaCorreta = "";

function limparTranscricao(transcricao) {
    // Remove qualquer pontuação extra e espaços em branco no final
    return transcricao.replace(/[.,?!;:]*$/, '').trim();
}

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    var speechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    var gravador = new speechAPI();

    gravador.continuous = false;
    gravador.lang = "en-US";


    gravador.onstart = function () {
        btnGravador.innerText = "Estou Ouvindo";
        btnGravador.style.backgroundColor = "white";
        btnGravador.style.color = "black";
    }

    gravador.onend = function () {
        btnGravador.innerText = "Responder";
        btnGravador.style.backgroundColor = "transparent";
        btnGravador.style.color = "white";
    }

    gravador.onresult = function (event) {
        transcricaoAudio = limparTranscricao(event.results[0][0].transcript.toUpperCase());
        respostaCorreta = document.getElementById('cor-na-caixa').innerText.toUpperCase();

        console.log(transcricaoAudio);
        console.log(respostaCorreta);


        if (transcricaoAudio === respostaCorreta) {
            atualizaPontuacao(1);
        } else {
            atualizaPontuacao(-1);
        }

        aplicarCorNaCaixa(sortearCor());
    }


} else {
    alert('Não tem suporte')
}

btnGravador.addEventListener('click', function (e) {
    gravador.start();
})