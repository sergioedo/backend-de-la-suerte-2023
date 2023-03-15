const fs = require('fs')
const { EOL } = require('os')

const writeEmojiDB = (db) => {
    const dbId = db.getID()
    let fileContent = ''

    try {
        // DB Header
        fileContent += dbId + EOL

        // Entities
        db.getEntities().map(entity => {
            const elements = entity.getElements()
            fileContent += entity.getID() + entity.getFields().join('') + '#️⃣' + elements.length + EOL
            const fields = entity.getFields()
            elements.map(element => {
                fields.map(field => {
                    fileContent += field + element.get(field)
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

    const db = createEmojiDB(dbId, true)

    let currentEntity
    let entityCount = 0
    fileLines.map(line => {
        if (entityCount > 0) { // read entity element
            const newElement = currentEntity.createElement()
            const fields = currentEntity.getFields()
            const values = line.split('').map(char => fields.includes(char) ? '#' : char).join('').split('#')
            currentEntity.getFields().map((field, idx) => {
                newElement.set(field, values[idx])
            })
            entityCount--
        } else { // new entity
            const entityId = line.split('')[0]
            const entityFields = line.split('#️⃣')[0].slice(1).split('')
            entityCount = Number(line.split('#️⃣')[1])
            currentEntity = db.createEntity(entityId, entityFields)
        }
    })

    return db
}

const createEmojiDB = (dbId, override = false) => {
    if (!override) {
        const fileDB = readEmojiDB(dbId)
        if (fileDB) return fileDB
    }

    const entities = {}
    const db = {
        getID: () => dbId,
        createEntity: (entityId, entityFields = []) => {
            const elements = [] //entities[entityId] ? [...entities[entityId].getElements()] : []
            const newEntity = {
                getID: () => entityId,
                getFields: () => entityFields,
                createElement: () => {
                    const fields = {}
                    const element = {
                        set: (field, value) => {
                            fields[field] = String(value)
                            writeEmojiDB(db)
                            return element
                        },
                        get: (field) => fields[field]
                    }
                    elements.push(element)
                    return element
                },
                getElements: () => elements,
                getElementsByField: (field, value) => elements.filter(e => e.get(field) === value)
            }
            entities[entityId] = newEntity
            writeEmojiDB(db)
            return newEntity
        },
        getEntityById: (entityId) => {
            return entities[entityId]
        },
        getEntities: () => Object.values(entities)
    }
    writeEmojiDB(db)
    return db
}

module.exports = {
    createEmojiDB
}