# Chatbot API

REST API sederhana untuk sistem chatbot yang dibangun menggunakan AdonisJS v6 dan PostgreSQL. API ini terintegrasi dengan external API Majadigi untuk memberikan respons chatbot yang intelligent.

## 🚀 Features

- **Send Questions** - Kirim pertanyaan ke chatbot dan dapatkan respons
- **Conversation Management** - Kelola percakapan dan history pesan
- **External API Integration** - Terintegrasi dengan API Majadigi
- **Session Management** - Tracking percakapan dengan session ID
- **Message History** - Simpan dan akses riwayat pesan
- **Pagination & Filtering** - Fitur pencarian dan pagination
- **Mock Response** - Mode testing dengan mock response

## 🛠️ Tech Stack

- **Framework**: AdonisJS v6
- **Database**: PostgreSQL
- **ORM**: Lucid ORM
- **Validation**: VineJS
- **HTTP Client**: Axios
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm atau yarn

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/SeptianSamdany/chatbot-api.git
cd chatbot-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy file `.env.example` ke `.env` dan konfigurasi:
```bash
cp .env.example .env
```

Edit file `.env`:
```env
# Application
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-32-character-secret-key
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_DATABASE=chatbot_api

# External API
EXTERNAL_API_URL=https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message

# Development Mode (set to true untuk menggunakan mock response)
USE_MOCK_RESPONSE=false
```

### 4. Database Setup
```bash
# Buat database
createdb chatbot_api

# Jalankan migration
node ace migration:run
```

### 5. Generate App Key
```bash
node ace generate:key
```

### 6. Run Application
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3333/api/v1
```

### Endpoints

#### 1. Send Question
**POST** `/questions`

Kirim pertanyaan ke chatbot dan dapatkan respons.

**Request Body:**
```json
{
  "message": "ada layanan apa di majadigi?",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "77d64177-7eee-4a6d-825f-2f3614c8230f",
    "user_message": "ada layanan apa di majadigi?",
    "bot_response": "Majadigi menyediakan berbagai layanan...",
    "conversation_id": 1
  }
}
```

#### 2. Get All Conversations
**GET** `/conversation`

Dapatkan semua percakapan dengan pagination dan filtering.

**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan last message

**Response:**
```json
{
  "success": true,
  "data": {
    "meta": {
      "total": 50,
      "per_page": 10,
      "current_page": 1,
      "last_page": 5
    },
    "data": [
      {
        "id": 1,
        "sessionId": "77d64177-7eee-4a6d-825f-2f3614c8230f",
        "lastMessage": "Majadigi menyediakan berbagai layanan...",
        "createdAt": "2024-07-16T04:31:23.459+00:00",
        "updatedAt": "2024-07-16T04:31:23.799+00:00"
      }
    ]
  }
}
```

#### 3. Get Conversation Messages
**GET** `/conversation/:id`

Dapatkan detail percakapan dengan semua pesan. ID bisa berupa database ID atau session_id.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sessionId": "77d64177-7eee-4a6d-825f-2f3614c8230f",
    "lastMessage": "Majadigi menyediakan berbagai layanan...",
    "createdAt": "2024-07-16T04:31:23.459+00:00",
    "updatedAt": "2024-07-16T04:31:23.799+00:00",
    "messages": [
      {
        "id": 1,
        "conversationId": 1,
        "senderType": "user",
        "message": "ada layanan apa di majadigi?",
        "createdAt": "2024-07-16T04:31:23.459+00:00",
        "updatedAt": "2024-07-16T04:31:23.459+00:00"
      },
      {
        "id": 2,
        "conversationId": 1,
        "senderType": "bot",
        "message": "Majadigi menyediakan berbagai layanan...",
        "createdAt": "2024-07-16T04:31:23.799+00:00",
        "updatedAt": "2024-07-16T04:31:23.799+00:00"
      }
    ]
  }
}
```

#### 4. Delete Conversation
**DELETE** `/conversation/:id`

Hapus percakapan berdasarkan ID atau session_id.

**Response:**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

### Error Responses

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "message",
      "message": "The message field is required"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## 🧪 Testing

### Manual Testing
```bash
# Test send question
curl -X POST http://localhost:3333/api/v1/questions \
  -H "Content-Type: application/json" \
  -d '{"message": "ada layanan apa di majadigi?"}'

# Test get conversations
curl http://localhost:3333/api/v1/conversation

# Test get conversation detail
curl http://localhost:3333/api/v1/conversation/1
```

### Using Mock Response
Untuk testing tanpa memanggil external API, set `USE_MOCK_RESPONSE=true` di file `.env`.

### Debug External API
```bash
# Test external API directly
node ace make:command TestExternalApi
```

## 🗄️ Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  session_id UUID UNIQUE NOT NULL,
  last_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'bot')),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Development

### Available Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run migrations
node ace migration:run

# Rollback migrations
node ace migration:rollback

# Create new migration
node ace make:migration create_table_name

# Create new model
node ace make:model ModelName

# Create new controller
node ace make:controller ControllerName
```

### Project Structure
```
app/
├── controllers/          # HTTP Controllers
├── models/              # Database Models
├── services/            # Business Logic Services
├── validators/          # Input Validation
└── exceptions/          # Custom Exceptions

database/
├── migrations/          # Database Migrations
└── seeders/            # Database Seeders

config/                  # Configuration Files
start/                   # Application Bootstrap
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=your-production-app-key
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
EXTERNAL_API_URL=https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message
USE_MOCK_RESPONSE=false
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Septian Samdany**
- GitHub: [@SeptianSamdany](https://github.com/SeptianSamdany)
- Email: septiansamdani05@gmail.com

## 🙏 Acknowledgments

- [AdonisJS](https://adonisjs.com/) - The Node.js Framework
- [Majadigi API](https://majadigi.jatimprov.go.id/) - External Chatbot API
- [PostgreSQL](https://www.postgresql.org/) - Database System

## 🐛 Known Issues

1. **Response "OK" only**: Pastikan struktur request sesuai dengan dokumentasi external API
2. **External API timeout**: Set timeout yang sesuai untuk external API calls
3. **Session management**: Implementasi session storage untuk production

## 🔮 Future Enhancements

- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] WebSocket support for real-time chat
- [ ] Unit & Integration tests
- [ ] API documentation with Swagger
- [ ] Docker containerization
- [ ] Monitoring & logging