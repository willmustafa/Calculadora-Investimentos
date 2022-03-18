let qtySteps = 1;
var selecionado = '';
var options = {
    prefix: '',
    suffix: '',
    fixed: true,
    fractionDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    emptyOrInvalid: () => {
        return this.SimpleMaskMoney.args.fixed ?
            `0${this.SimpleMaskMoney.args.decimalSeparator}00` :
            `_${this.SimpleMaskMoney.args.decimalSeparator}__`;
    }
};

const textos = [{
        'opcao': 'aplicacaoInicialUnica',
        'texto': {
            'pergunta': 'Se eu investir R$ <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="apInicial"><span class="underline-animation"></span></div> a um juros de <div class="input-name input-sm"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div> % ao mês, quanto terei após <div class="input-name input-sm"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="12" name="tempo"><span class="underline-animation"></span></div> meses?',
            'resposta': 'Você terá <span class="fw-bold">R$ {valorFinal}</span> na sua carteira após {tempo} meses, investindo apenas R$ {apInicial} a um juros de {juros} % ao mês.'
        }
    },
    {
        'opcao': 'aplicaHojeValorDesejadoFuturo',
        'texto': {
            'pergunta': 'Quanto preciso investir hoje para conseguir R$ <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="valorDesejado"><span class="underline-animation"></span></div> em <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="12" name="tempo"><span class="underline-animation"></span></div> meses a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div>  % ao mês?',
            'resposta': 'Você precisa investir <span class="fw-bold">R$ {valorFinal}</span> hoje para atingir R$ {valorDesejado} em {tempo} meses a um juros de {juros} % ao mês.'
        }
    },
    {
        'opcao': 'aplicaHojePorQuantoTempo',
        'texto': {
            'pergunta': 'Quanto tempo preciso deixar R$ <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="apInicial"><span class="underline-animation"></span></div> aplicados a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div> % ao mês para conseguir R$ <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="40.000,00" name="valorDesejado"><span class="underline-animation"></span></div>?',
            'resposta': 'Você precisará esperar <span class="fw-bold">{valorFinal}</span> meses para conseguir R$ {valorDesejado} investindo apenas R$ {apInicial} a um juros de {juros} % ao mês.'
        }
    },
    {
        'opcao': 'aplicaMensal',
        'texto': {
            'pergunta': 'Se eu aplicar inicialmente R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="apInicial"><span class="underline-animation"></span></div> mais R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="400,00" name="apMensal"><span class="underline-animation"></span></div> mensalmente a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div>% ao mês, quanto terei ao final de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="12" name="tempo"><span class="underline-animation"></span></div>meses?',
            'resposta': 'Você terá <span class="fw-bold">R$ {valorFinal}</span> ao final de {tempo} meses, investindo inicialmente R$ {apInicial} mais R$ {apMensal} todo mês a um juros de {juros} % ao mês.'
        }
    },
    {
        'opcao': 'aplicaMensalAtingirValor',
        'texto': {
            'pergunta': 'Quanto preciso aplicar mensalmente para conseguir R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="valorDesejado"><span class="underline-animation"></span></div> em <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="12" name="tempo"><span class="underline-animation"></span></div>meses a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div>% ao mês?',
            'resposta': 'Você precisa investir <span class="fw-bold">R$ {valorFinal}</span> por mês para conseguir R$ {valorDesejado} em {tempo} meses com o juros a {juros} % ao mês.'
        }
    },
    {
        'opcao': 'aplicaMensalPorQuantoTempo',
        'texto': {
            'pergunta': 'Por quanto tempo preciso aplicar R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="400,00" name="apMensal"><span class="underline-animation"></span></div> mensalmente para atingir R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="valorDesejado"><span class="underline-animation"></span></div> a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div>% ao mês?',
            'resposta': 'Você precisa esperar <span class="fw-bold">{valorFinal}</span> meses para conseguir R$ {valorDesejado} investindo mensalmente R$ {apMensal} a um juros de {juros} % ao mês.'
        }
    },
    {
        'opcao': 'previdenciaValorMensal',
        'texto': {
            'pergunta': 'Se eu tiver R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="apInicial"><span class="underline-animation"></span></div> investidos a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div>% ao mês, quanto eu posso retirar por mês até zerar a conta em <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="12" name="tempo"><span class="underline-animation"></span></div>meses?',
            'resposta': 'Você pode retirar <span class="fw-bold">R$ {valorFinal}</span> por mês durante {tempo} meses, tendo R$ {apInicial} aplicados a um juros de {juros} % ao mês.'
        }
    },
    {
        'opcao': 'previdenciaValorTotalNecessario',
        'texto': {
            'pergunta': 'Quanto eu preciso ter investido para conseguir retirar R$<div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="4.000,00" name="valorDesejado"><span class="underline-animation"></span></div> durante <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="12" name="tempo"><span class="underline-animation"></span></div>meses a um juros de <div class="input-name input-lg"><input onkeyup="verificarInputs()" inputmode="numeric" placeholder="0,5" name="juros" min="0" max="1" step=".001"><span class="underline-animation"></span></div>% ao mês?',
            'resposta': 'Você precisa ter <span class="fw-bold">R$ {valorFinal}</span> aplicados a um juros de {juros} % ao mês para retirar R$ {valorDesejado} ao mês durante {tempo} meses.'
        }
    },
]


window.onload = function () {
    fadeOut(document.getElementById('preloader'), 1000);
    qtySteps = document.getElementsByTagName('fieldset').length;
    document.getElementById('step-max').innerText = qtySteps;

    document.getElementsByTagName('form')[0].addEventListener("submit", function (event) {
        event.preventDefault();
        calculadora();
    });
}

/**
 * Verifica os inputs no campo de perguntas, caso estejam preenchidos permite a continuação do form
 */
function verificarInputs() {
    var fields = document.querySelectorAll('#textoInput input');

    var bool = false;

    for (let i = 0; i < fields.length; i++) {
        bool = valid(fields[i].value);
    }

    if (bool) {
        // Coloca o botão de próximo
        showButtons('button3');
        document.querySelector('#button3 button').disabled = false;
    }

}

/**
 * Valida a entrada
 * @param {object} obj 
 * @returns 
 */
function valid(obj) {
    if (obj == "") {
        return false
    } else {
        return true
    }
}

/**
 * Evento para o botão da landing "começar"
 */
function start() {
    document.getElementsByTagName('header')[0].classList.toggle('active');

    fadeOut(document.getElementById('landing'), 250);
    document.getElementsByTagName('form')[0].className = 'f1'
}

/**
 * Evento para o botão de avançar
 * @param {element} e 
 */
function nextfield(e) {
    // Pega o form atual
    const actualClass = document.getElementsByTagName('form')[0].className.substring(1, 2);
    const nextClass = Number(actualClass) + 1;
    document.getElementsByTagName('form')[0].className = 'f' + nextClass;

    document.getElementById('f' + nextClass).classList.remove("fade-out");
    const fieldset = e.closest('fieldset#f' + actualClass);
    fadeOut(fieldset, 0);

    // Muda o step e o progressbar
    progressbar(nextClass);
}

/**
 * Evento para o botão de retornar
 * @param {elemento} e 
 */
function prevfield(e) {
    // Pega o form atual
    const actualClass = document.getElementsByTagName('form')[0].className.substring(1, 2);
    const nextClass = Number(actualClass) - 1;

    // Se estiver na página de resultados, reseta as perguntas quando clicar em voltar
    if (actualClass == '4') {
        perguntaSelect(document.querySelector('#perguntas input:checked'));
    }

    // FadeOut no fieldset ativo
    fadeOut(document.getElementById("f" + actualClass), 0);

    // Pega o fieldset com a id do form anterior
    const fieldset = document.getElementById("f" + nextClass);

    // Muda o display do fieldset e remove o fade
    fieldset.style.display = "flex";
    fieldset.classList.remove("fade-out")

    // Adiciona a classe ao form
    document.getElementsByTagName('form')[0].className = 'f' + nextClass;

    // Muda o step e o progressbar
    progressbar(nextClass);
}

let progress = 0;
let textoResultado = '';

/**
 * Altera a barra de progresso 
 * @param {number} actualStep 
 */
function progressbar(actualStep) {
    //Pogressbar
    const progressWidth = ((100 / qtySteps) * actualStep + progress);
    document.getElementsByClassName('progressbar')[0].style.width = progressWidth + '%';

    // Muda o número do header (Passo 1 de 4)
    document.getElementById('step').innerText = actualStep;
}

/**
 * Primeiro select, procura a categoria na array e adiciona a classe no próximo fieldset
 * @param {*} e Elemento que chamou
 */
function textSelect(e) {
    // Apaga as classes caso alguem tenha clicado em voltar e selecionou outra opção
    document.getElementById('perguntas').className = '';

    // Adiciona a classe ao Perguntas, fazendo o display flex nas perguntas corretas
    document.getElementById('perguntas').classList.add(e.value);

    // Coloca o botão de próximo
    showButtons('button1');
}

/**
 * Selecionador de perguntas com inputs e o texto de resposta, baseado na opção selecionada
 * @param {event} e 
 */
function perguntaSelect(e) {
    // Encontra as perguntas e respostas baseado na seleção
    document.getElementById('textoInput').innerHTML = textos.filter(x => x.opcao == e.value)[0].texto.pergunta;
    textoResultado = textos.filter(x => x.opcao == e.value)[0].texto.resposta;
    selecionado = e.value;

    // Coloca o botão de próximo
    showButtons('button2');

    // Adiciona inputMask nos inputs específicos
    let inputs = document.querySelectorAll('input[name=apInicial], input[name=juros], input[name=apMensal], input[name=valorDesejado]');
    for (let i = 0; i < inputs.length; i++) {
        SimpleMaskMoney.setMask(inputs[i], options);
    }
}

function calculadora() {
    const form = document.getElementsByTagName('form')[0];

    let inputs = document.getElementById('textoInput').getElementsByTagName('input');
    let inputValues = [];

    for (let i = 0; i < inputs.length; i++) {
        let newinput = [`${inputs[i].name}`, `${inputs[i].value}`];
        inputValues.push(newinput);
    }

    let apInicial = inputValues.find(x => x[0] == "apInicial") || [];
    let juros = inputValues.find(x => x[0] == "juros") || [];
    let tempo = inputValues.find(x => x[0] == "tempo") || [];
    let apMensal = inputValues.find(x => x[0] == "apMensal") || [];
    let valorDesejado = inputValues.find(x => x[0] == "valorDesejado") || [];

    let resultado = 0;

    switch (selecionado) {
        case 'aplicacaoInicialUnica':
            resultado = aplicacaoInicialUnica(SimpleMaskMoney.formatToNumber(apInicial[1]), SimpleMaskMoney.formatToNumber(juros[1]), Number(tempo[1]));
            resultado = formatNumber(resultado);
            textoResultado = textoResultado.replace('{apInicial}', apInicial[1]).replace('{juros}', juros[1]).replace('{tempo}', tempo[1]).replace('{valorFinal}', resultado);
            break;
        case 'aplicaHojeValorDesejadoFuturo':
            resultado = aplicaHojeValorDesejadoFuturo(SimpleMaskMoney.formatToNumber(valorDesejado[1]), SimpleMaskMoney.formatToNumber(juros[1]), Number(tempo[1]));
            resultado = formatNumber(resultado);
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{valorDesejado}', valorDesejado[1]).replace('{juros}', juros[1]).replace('{tempo}', tempo[1]);
            break;
        case 'aplicaHojePorQuantoTempo':
            resultado = aplicaHojePorQuantoTempo(SimpleMaskMoney.formatToNumber(valorDesejado[1]), SimpleMaskMoney.formatToNumber(apInicial[1]), SimpleMaskMoney.formatToNumber(juros[1]));
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{valorDesejado}', valorDesejado[1]).replace('{juros}', juros[1]).replace('{apInicial}', apInicial[1]);
            break;
        case 'aplicaMensal':
            resultado = aplicaMensal(SimpleMaskMoney.formatToNumber(apInicial[1]), SimpleMaskMoney.formatToNumber(apMensal[1]), SimpleMaskMoney.formatToNumber(juros[1]), Number(tempo[1]));
            resultado = formatNumber(resultado);
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{apInicial}', valorDesejado[1]).replace('{juros}', juros[1]).replace('{tempo}', tempo[1]).replace('{apMensal}', apMensal[1]);
            break;
        case 'aplicaMensalAtingirValor':
            resultado = aplicaMensalAtingirValor(SimpleMaskMoney.formatToNumber(valorDesejado[1]), SimpleMaskMoney.formatToNumber(juros[1]), Number(tempo[1]));
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{valorDesejado}', valorDesejado[1]).replace('{juros}', juros[1]).replace('{tempo}', tempo[1]);
            break;
        case 'aplicaMensalPorQuantoTempo':
            resultado = aplicaMensalPorQuantoTempo(SimpleMaskMoney.formatToNumber(valorDesejado[1]), SimpleMaskMoney.formatToNumber(juros[1]), SimpleMaskMoney.formatToNumber(apMensal[1]));
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{valorDesejado}', valorDesejado[1]).replace('{juros}', juros[1]).replace('{apMensal}', apMensal[1]);
            break;
        case 'previdenciaValorMensal':
            resultado = previdenciaValorMensal(SimpleMaskMoney.formatToNumber(apInicial[1]), SimpleMaskMoney.formatToNumber(juros[1]), Number(tempo[1]));
            resultado = formatNumber(resultado);
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{apInicial}', apInicial[1]).replace('{juros}', juros[1]).replace('{tempo}', tempo[1]);
            break;
        case 'previdenciaValorTotalNecessario':
            resultado = previdenciaValorTotalNecessario(SimpleMaskMoney.formatToNumber(valorDesejado[1]), SimpleMaskMoney.formatToNumber(juros[1]), Number(tempo[1]));
            resultado = formatNumber(resultado);
            textoResultado = textoResultado.replace('{valorFinal}', resultado).replace('{valorDesejado}', valorDesejado[1]).replace('{juros}', juros[1]).replace('{tempo}', tempo[1]);
            break;
    };

    document.getElementById('textoFinal').innerHTML = textoResultado
}

// helpers
function fadeOut(element, time) {
    // add class fade-out
    element.classList.toggle('fade-out');

    // wait and disable the display
    window.setTimeout(
        function () {
            element.style.display = "none";
        }, time
    );
}

function showButtons(button) {
    document.getElementsByTagName('form')[0].classList.add(button)
}

/**
 * Força a formatação da entrada em número
 * @param {number} number 
 * @returns 
 */
function formatNumber(number) {
    return number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2
    });
}

function checkEnter(e) {
    var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
    return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
}