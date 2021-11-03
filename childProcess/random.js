const calculo = (cant) => {
    let numAleatorio = [];
    for(let i=0; i<cant; i++) {
        numAleatorio.push(Math.floor(Math.random() * (1001 - 1)) + 1);
    }
    let resultado = numAleatorio.reduce((a,d) => (a[d] ? a[d]+=1 : a[d]=1, a),{})
    return resultado
}

process.on('message', message => {
    const numA = calculo(message.cant)
    process.send(numA)
})