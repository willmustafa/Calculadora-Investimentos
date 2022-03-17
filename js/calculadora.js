/**
 * Qual o valor total arrecadado dado uma aplicação única inicial?
 * @param {number} apInicial 
 * @param {number} juros 
 * @param {number} tempo 
 * @returns {number}
 */
function aplicacaoInicialUnica(apInicial, juros, tempo){
    return apInicial*((1+(juros/100))**tempo)
}

/**
 * Qual o valor que preciso aplicar hoje para que eu tenha um valor total X após tanto tempo?
 * @param {number} valorDesejado 
 * @param {number} juros 
 * @param {number} tempo 
 * @returns {number}
 */
function aplicaHojeValorDesejadoFuturo(valorDesejado, juros, tempo){
    return valorDesejado/((1+(juros/100))**tempo)
}

/**
 * Por quanto tempo preciso aplicar um valor único para atingir um valor total X?
 * @param {number} valorDesejado 
 * @param {number} apInicial 
 * @param {number} juros 
 * @returns {number} Quantidade de meses aplicando
 */
function aplicaHojePorQuantoTempo(valorDesejado, apInicial, juros){
    return (Math.log10(valorDesejado/apInicial))/(Math.log10(1+(juros/100)))
}


function aplicaMensal(apInicial, apMensal, juros, tempo){
    return  aplicacaoInicialUnica(apInicial, juros, tempo) + (apMensal * (((((1 + (juros / 100))) ** tempo) - 1) / (juros / 100)))
}

/**
 * Qual o valor que devo aplicar mensalmente para ter um valor total X?
 * @param {number} valorDesejado 
 * @param {number} juros 
 * @param {number} tempo 
 * @returns {number} Valor mensal
 */
function aplicaMensalAtingirValor(valorDesejado, juros, tempo){
    return valorDesejado*(juros/(((1+(juros/100))**tempo)-1));
}

/**
 * Por quanto tempo preciso aplicar mensalmente para atingir um valor total X?
 * @param {number} valorDesejado 
 * @param {number} juros 
 * @param {number} apMensal 
 * @returns {number} Quantidade de meses para atingir o valor desejado
 */
function aplicaMensalPorQuantoTempo(valorDesejado, juros, apMensal){
    return Math.log10(((valorDesejado*(juros/100))/apMensal)+1)/Math.log10(1+(juros/100))
}

/**
 * Quanto eu posso retirar por mês, durante tantos meses?
 * @param {number} apInicial 
 * @param {number} juros 
 * @param {number} meses 
 * @returns {number} Quantidade de meses retirando o dinheiro aplicado sem injetar mais dinheiro
 */
function previdenciaValorMensal(apInicial, juros, meses){
    return apInicial*(((juros/100)*(1+(juros/100))**meses)/(((1+(juros/100))**meses)-1))
}

/**
 * Quanto eu preciso ter aplicado para que eu consiga um valor mensal por tantos meses? (Valor pretendido para Previdência)
 * @param {number} valorDesejado 
 * @param {number} juros 
 * @param {number} meses 
 * @returns {number} Valor aplicado necessário
 */
function previdenciaValorTotalNecessario(valorDesejado, juros, meses){
    return valorDesejado*((((1+(juros/100))**meses)-1)/(((juros/100)*(1+(juros/100))**meses)))
}