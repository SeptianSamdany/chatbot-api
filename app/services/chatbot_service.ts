import axios from 'axios'
import { Exception } from '@adonisjs/core/exceptions'

export interface ExternalApiResponse {
  success?: boolean
  data?: {
    message?: string
    session_id?: string
  }
  error?: string
  message?: string // Kemungkinan struktur response lain
  response?: string // Kemungkinan struktur response lain
}

export default class ChatbotService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.EXTERNAL_API_URL || ''
  }

  async sendMessage(message: string, sessionId: string): Promise<string> {
    try {
      console.log('Sending to external API:', {
        url: this.baseUrl,
        payload: { 
          question: message,  // PERBAIKAN: pakai 'question' bukan 'message'
          additional_context: "",
          session_id: sessionId 
        }
      })

      const response = await axios.post(this.baseUrl, {
        question: message,        // PERBAIKAN: sesuai dokumentasi
        additional_context: "",   // PERBAIKAN: tambahkan field ini
        session_id: sessionId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      })

      console.log('External API Response:', response.data)

      // PERBAIKAN: Parse response sesuai dokumentasi
      if (response.data && response.data.data && response.data.data.message) {
        const messages = response.data.data.message
        if (Array.isArray(messages) && messages.length > 0) {
          return messages[0].text || "Tidak ada respons dari bot"
        }
      }

      // Fallback jika struktur tidak sesuai
      return "Maaf, terjadi kesalahan dalam memproses respons."
      
    } catch (error) {
      console.error('External API Error:', error)
      console.error('Error response:', error.response?.data)
      
      throw new Exception(`External API Error: ${error.message}`, {
        status: 500,
        code: 'EXTERNAL_API_ERROR'
      })
    }
  }

  // Mock response untuk testing
  async getMockResponse(message: string): Promise<string> {
    const mockResponses = [
      "Halo! Saya adalah asisten AI. Bagaimana saya bisa membantu Anda?",
      "Terima kasih atas pertanyaan Anda. Saya akan mencoba membantu sebaik mungkin.",
      "Saya mengerti pertanyaan Anda. Apakah ada yang spesifik yang ingin Anda tanyakan?",
      "Baik, saya siap membantu Anda. Silakan berikan detail lebih lanjut.",
      "Pertanyaan yang menarik! Mari kita bahas lebih lanjut."
    ]
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return random response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)]
  }
}