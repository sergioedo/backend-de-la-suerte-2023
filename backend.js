const createEmojiDB = (dbId) => {
    const entities = {}
    return {
        getID: () => dbId,
        createEntity: (entityId, entityFields) => {
            const elements = []
            const newEntity = {
                getID: () => entityId,
                getFields: () => entityFields,
                createElement: () => {
                    const fields = {}
                    const element = {
                        set: (field, value) => {
                            fields[field] = value
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
            return newEntity
        },
        getEntityById: (entityId) => {
            return entities[entityId]
        }
    }
}

module.exports = {
    createEmojiDB
}