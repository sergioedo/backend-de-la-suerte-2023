const fs = require('fs')
const { EOL } = require('os')
const emojiRegex = require('emoji-regex')()

const emoji2Digit = { '0️⃣': '0', '1️⃣': '1', '2️⃣': '2', '3️⃣': '3', '4️⃣': '4', '5️⃣': '5', '6️⃣': '6', '7️⃣': '7', '8️⃣': '8', '9️⃣': '9' }
const digit2Emoji = Object.keys(emoji2Digit).reduce((prev, curr) => ({ ...prev, [emoji2Digit[curr]]: curr }), {})

const number2Emoji = (number) => number.toString().split('').map(digit => digit2Emoji[digit]).join('')
const emoji2Number = (emoji) => Number([...emoji.matchAll(emojiRegex)].map((match) => match[0]).map(e => emoji2Digit[e]).join(''))
const isEmojiNumber = (emoji) => emoji && [...(emoji).matchAll(emojiRegex)].map((match) => match[0]).every(char => Object.keys(emoji2Digit).includes(char))

const value2Emoji = (value) => {
    const stringValue = Number.isInteger(value) ? number2Emoji(value) : String(value)
    return [...stringValue.matchAll(emojiRegex)].map((match) => match[0]).join('')
}
const emoji2Value = (emoji) => isEmojiNumber(emoji) ? emoji2Number(emoji) : emoji

const writeEmojiDB = (db) => {
    const dbId = db.getID()
    let fileContent = ''

    try {
        // DB Header
        fileContent += dbId + EOL

        // Entities
        db.getEntities().map(entity => {
            const elements = entity.getElements()
            fileContent += entity.getID() + entity.getFields().join('') + '#️⃣' + number2Emoji(elements.length) + EOL
            const fields = entity.getFields()
            elements.map(element => {
                fields.map(field => {
                    fileContent += field + value2Emoji(element.get(field))
                })
                fileContent += EOL
            })
        })
        fs.writeFileSync(`${dbId}.menu`, fileContent)

    } catch (err) {
        console.error(err)
    }
}

const readEmojiDB = (dbId) => {
    const fileName = `${dbId}.menu`
    if (!fs.existsSync(fileName)) return null

    const fileContent = fs.readFileSync(fileName, 'utf8')
    const fileLines = fileContent.split(EOL).slice(1).filter(line => line.length > 0)

    const db = createEmojiDB(dbId)

    let currentEntity
    let entityCount = 0
    fileLines.map(line => {
        const emojis = [...line.matchAll(emojiRegex)].map((match) => match[0])  // get all emojis on current line
        if (entityCount > 0) { // read entity element
            const newElement = currentEntity.createElement()
            const fields = currentEntity.getFields()
            const values = emojis.map(char => fields.includes(char) ? '#' : char).join('').split('#').filter(value => value.length > 0)
            currentEntity.getFields().map((field, idx) => {
                newElement.set(field, values[idx])
            })
            entityCount--
        } else { // new entity
            const entityId = emojis[0]
            const entityFields = emojis.slice(1, emojis.findIndex(value => value === '#️⃣'))
            entityCount = emoji2Number(line.split('#️⃣')[1])
            currentEntity = db.createEntity(entityId, entityFields)
        }
    })

    return db
}

const createEmojiDB = (dbId) => {
    const entities = {}
    const db = {
        getID: () => dbId,
        createEntity: (entityId, entityFields = []) => {
            const elements = [] //entities[entityId] ? [...entities[entityId].getElements()] : []
            const newEntity = {
                getID: () => entityId,
                getFields: () => entityFields,
                createElement: (insert = false) => {
                    const fields = {}
                    const element = {
                        set: (field, value) => {
                            fields[field] = value2Emoji(value)
                            writeEmojiDB(db)
                            return element
                        },
                        get: (field) => emoji2Value(fields[field])
                    }
                    if (insert) { //insert as first element
                        elements.reverse().push(element)
                        elements.reverse()
                    } else { //append
                        elements.push(element)
                    }
                    return element
                },
                getElements: () => elements,
                getElementsByField: (field, value) => elements.filter(e => e.get(field) === value),
                removeElements: () => {
                    const numDeletedElements = elements.length
                    elements.length = 0
                    writeEmojiDB(db)
                    return numDeletedElements
                }
            }
            entities[entityId] = newEntity
            writeEmojiDB(db)
            return newEntity
        },
        getEntityById: (entityId) => {
            return entities[entityId]
        },
        getEntities: () => Object.values(entities),
    }
    writeEmojiDB(db)
    return db
}

module.exports = {
    createEmojiDB,
    readEmojiDB
}