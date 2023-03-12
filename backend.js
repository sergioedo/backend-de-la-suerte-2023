const createEmojiDB = (dbId) => {
    return {
        getID: () => dbId
    }
}

module.exports = {
    createEmojiDB
}