import type { HttpContext } from '@adonisjs/core/http'
import { createQuestionValidator } from '#validators/create_question'
import Conversation from '#models/conversation'
import Message from '#models/message'
import ChatbotService from '#services/chatbot_service'
import { v4 as uuidv4 } from 'uuid'

export default class QuestionsController {
  private chatbotService: ChatbotService

  constructor() {
    this.chatbotService = new ChatbotService()
  }

  // Tambahkan di bagian awal method store
    async store({ request, response }: HttpContext) {
    let conversation: Conversation | null = null
    let payload: any = null
    
    try {
        // Validate input
        payload = await request.validateUsing(createQuestionValidator)
        
        // Generate session_id jika tidak ada
        const sessionId = payload.session_id || uuidv4()
        
        // PERBAIKAN: Log untuk debugging
        console.log('Processing question:', {
        message: payload.message,
        sessionId: sessionId
        })
        
        // Find atau create conversation
        conversation = await Conversation.findBy('sessionId', sessionId)
        if (!conversation) {
        conversation = await Conversation.create({
            sessionId,
            lastMessage: payload.message,
        })
        }

        // Save user message
        await Message.create({
        conversationId: conversation.id,
        senderType: 'user',
        message: payload.message,
        })

        let botResponse: string
        
        try {
        // PERBAIKAN: Lebih spesifik error handling
        if (process.env.USE_MOCK_RESPONSE === 'true') {
            console.log('Using mock response')
            botResponse = await this.chatbotService.getMockResponse(payload.message)
        } else {
            console.log('Calling external API...')
            botResponse = await this.chatbotService.sendMessage(
            payload.message,
            sessionId
            )
            console.log('Got response from external API:', botResponse)
        }
        } catch (apiError) {
        console.error('External API failed:', apiError)
        
        // PERBAIKAN: Lebih detail error response
        botResponse = `Maaf, sistem sedang mengalami gangguan. Error: ${apiError.message}`
        }

        // Save bot response
        await Message.create({
        conversationId: conversation.id,
        senderType: 'bot',
        message: botResponse,
        })

        // Update last message
        await conversation.updateLastMessage(botResponse)

        return response.status(201).json({
        success: true,
        data: {
            session_id: sessionId,
            user_message: payload.message,
            bot_response: botResponse,
            conversation_id: conversation.id,
        },
        })
        
    } catch (error) {
        console.error('Controller Error:', error)
        
        // PERBAIKAN: Handle validation errors
        if (error.code === 'E_VALIDATION_ERROR') {
        return response.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: error.messages
        })
        }
        
        return response.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
        })
    }
    }
}