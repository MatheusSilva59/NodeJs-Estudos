module.exports.formattedFlashData = function(flashData){
    const data = Object.entries(flashData)[0]
    if (data){
        const newFlashData = {
            level: flashData[0],
            message: flashData[1][0]
        }
        return newFlashData
    }
    return null
}