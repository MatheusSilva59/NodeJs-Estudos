const x = '10'

if (!Number.isInteger(x)){
    throw new Error('The value inserted is not a number.')
}

console.log('Following...')