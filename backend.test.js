const backend = require('./backend')

const createDB = (dbId) => backend.createEmojiDB(dbId, true)
const createEntity = (dbId, entityId, entityFields) => {
    const db = createDB(dbId)
    return db.createEntity(entityId, entityFields)
}

test('Create Database', () => {
    const db = createDB('🗂')
    expect(db.getID()).toBe('🗂')
})

test('Create Entity', () => {
    const fields = ['🆔', '📆', '👨‍💼']
    const createdEntity = createEntity('🗂', '📂', fields)

    const fieldsDB = createdEntity.getFields()
    expect(createdEntity.getID()).toBe('📂')
    fields.map(field => expect(fieldsDB).toContain(field))
})

test('Get Entity', () => {
    const db = createDB('🗂')
    const fields = ['🆔', '📆', '👨‍💼']
    db.createEntity('📂', fields)

    const entity = db.getEntityById('📂')

    const fieldsDB = entity.getFields()
    expect(entity.getID()).toBe('📂')
    fields.map(field => expect(fieldsDB).toContain(field))
})

test('Set/Get Elements from entity', () => {
    const fields = ['🆔', '📆', '👨‍💼']
    const entity = createEntity('🗂', '📂', fields)

    entity.createElement()
        .set('🆔', '1️⃣')
        .set('📆', '3️⃣܂🔟')
        .set('👨‍💼', '👮‍♂️')

    expect(entity.getElements()[0].get('🆔')).toBe('1️⃣')
    expect(entity.getElementsByField('🆔', '1️⃣')[0].get('👨‍💼')).toBe('👮‍♂️')
})

test('Delete Elements from entity', () => {
    const fields = ['🆔', '📆', '👨‍💼']
    const entity = createEntity('🗂', '📂', fields)

    entity.createElement()
        .set('🆔', '1️⃣')
        .set('📆', '3️⃣܂🔟')
        .set('👨‍💼', '👮‍♂️')

    expect(entity.getElements().length).toBe(1)
    const numDeletedElements = entity.removeElements()
    expect(entity.getElements().length).toBe(0)
    expect(numDeletedElements).toBe(1)
})

test('Insert Elements at the beginning', () => {
    const fields = ['🆔']
    const entity = createEntity('🗂', '📂', fields)

    entity.createElement()
        .set('🆔', '1️⃣')

    entity.createElement(true)
        .set('🆔', '2️⃣')

    expect(entity.getElements()[0].get('🆔')).toBe('2️⃣')
})