// mais de um valor

const x = 10
const y = 'Algum texto'
const z = [1, 2]

console.log(x, y, z)

// contagem de impressões

console.count(`o valor de x é: ${x}, contagem`)
console.count(`o valor de x é: ${x}, contagem`)
console.count(`o valor de x é: ${x}, contagem`)
console.count(`o valor de x é: ${x}, contagem`)
console.count(`o valor de x é: ${x}, contagem`)
console.count(`o valor de x é: ${x}, contagem`)

// váriavel entre string

console.log('%s', y)

// limpar o console

setTimeout(() => {
    console.clear()
}, 2000)