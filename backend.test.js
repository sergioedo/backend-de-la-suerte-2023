const backend = require('./backend')

const createDB = (dbId) => backend.createEmojiDB(dbId)
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
        .set('🆔', 1)
        .set('📆', '3️⃣܂🔟')
        .set('👨‍💼', '👮‍♂️')

    expect(entity.getElements()[0].get('🆔')).toBe(1)
    expect(entity.getElementsByField('🆔', 1)[0].get('👨‍💼')).toBe('👮‍♂️')
})

test('Delete Elements from entity', () => {
    const fields = ['🆔', '📆', '👨‍💼']
    const entity = createEntity('🗂', '📂', fields)

    entity.createElement()
        .set('🆔', 1)
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
        .set('🆔', 1)

    entity.createElement(true)
        .set('🆔', 2)

    expect(entity.getElements()[0].get('🆔')).toBe(2)
})

test('Delete first element', () => {
    const fields = ['🆔']
    const entity = createEntity('🗂', '📂', fields)

    entity.createElement().set('🆔', 1)
    entity.createElement().set('🆔', 2)
    entity.removeFirstElement()

    expect(entity.getElements()[0].get('🆔')).toBe(2)
})

test('Recover db created previously', () => {
    const dbId = '🗂'
    const entityId = '📂'
    const entityFields = ['🅰️', '🅱️']
    const db1 = backend.createEmojiDB(dbId)
    const entity1 = db1.createEntity(entityId, entityFields)
    const element1 = entity1.createElement()
        .set('🅰️', 1)
        .set('🅱️', 2)

    const db2 = backend.readEmojiDB(dbId)
    expect(db2.getID()).toBe(dbId)

    const entity2 = db2.getEntityById(entityId)
    expect(entity2.getID()).toBe(entityId)

    const element2 = entity2.getElementsByField('🅰️', 1)[0]
    expect(element2.get('🅱️')).toBe(element1.get('🅱️'))
})