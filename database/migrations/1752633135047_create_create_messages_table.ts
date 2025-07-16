import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('conversation_id').unsigned().notNullable()
      table.enum('sender_type', ['user', 'bot']).notNullable()
      table.text('message').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
      
      // Foreign Key
      table.foreign('conversation_id').references('conversations.id').onDelete('CASCADE')
      
      // Indexes
      table.index(['conversation_id'])
      table.index(['sender_type'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}