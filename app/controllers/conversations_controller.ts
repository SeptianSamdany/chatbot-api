import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'

export default class ConversationsController {
  async index({ request, response }: HttpContext) {
  try {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')

    let query = Conversation.query().orderBy('updatedAt', 'desc')

    // Filter jika ada search
    if (search) {
      query = query.where('lastMessage', 'ILIKE', `%${search}%`)
    }

    const conversations = await query.paginate(page, limit)

    return response.json({
      success: true,
      data: conversations,
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
    }

  async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      let conversation: Conversation | null = null
      
      // Check if the ID is a number (database ID) or UUID (session_id)
      if (this.isValidUuid(id)) {
        // Search by session_id
        conversation = await Conversation.query()
          .where('sessionId', id)
          .preload('messages', (query) => {
            query.orderBy('createdAt', 'asc')
          })
          .first()
      } else if (this.isNumeric(id)) {
        // Search by database ID
        conversation = await Conversation.query()
          .where('id', parseInt(id))
          .preload('messages', (query) => {
            query.orderBy('createdAt', 'asc')
          })
          .first()
      }

      if (!conversation) {
        return response.status(404).json({
          success: false,
          error: 'Conversation not found',
        })
      }

      return response.json({
        success: true,
        data: conversation,
      })
    } catch (error) {
      console.error('Show conversation error:', error)
      return response.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
  try {
    const { id } = params
    let conversation: Conversation | null = null
    
    if (this.isValidUuid(id)) {
      conversation = await Conversation.findBy('sessionId', id)
    } else if (this.isNumeric(id)) {
      conversation = await Conversation.find(parseInt(id))
    }

    if (!conversation) {
      return response.status(404).json({
        success: false,
        error: 'Conversation not found',
      })
    }

    await conversation.delete()

    return response.json({
      success: true,
      message: 'Conversation deleted successfully',
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
    }

  // Helper method to validate UUID format
  private isValidUuid(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

  // Helper method to check if string is numeric
  private isNumeric(str: string): boolean {
    return /^\d+$/.test(str)
  }
}