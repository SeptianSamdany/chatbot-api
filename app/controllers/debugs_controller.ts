import type { HttpContext } from '@adonisjs/core/http'
import ChatbotService from '#services/chatbot_service'
import { v4 as uuidv4 } from 'uuid'

export default class DebugController {
  private chatbotService: ChatbotService

  constructor() {
    this.chatbotService = new ChatbotService()
  }

  async testExternalApi({ request, response }: HttpContext) {
    try {
      const { message = "Hello, how are you?" } = request.all()
      const sessionId = uuidv4()
      
      console.log('Testing external API with:', { message, sessionId })
      
      const result = await this.chatbotService.sendMessage(message, sessionId)
      
      return response.json({
        success: true,
        data: {
          message,
          session_id: sessionId,
          response: result,
        }
      })
    } catch (error) {
      console.error('Debug Test Error:', error)
      
      return response.status(500).json({
        success: false,
        error: error.message,
        details: error.response?.data || null
      })
    }
  }
}