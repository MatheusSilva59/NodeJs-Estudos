module.exports = function verifyFields(fields) {
    for (let field in fields) {
        console.log(field)
        if (!fields[field]) {
            return { status: false, field }
        }
    }
    return { status: true }
}