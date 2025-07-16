import router from '@adonisjs/core/services/router'

const QuestionsController = () => import('#controllers/questions_controller')
const ConversationsController = () => import('#controllers/conversations_controller')
const DebugController = () => import('#controllers/debugs_controller')

// API Routes
router.group(() => {
  router.post('/questions', [QuestionsController, 'store'])
  router.get('/conversation', [ConversationsController, 'index'])
  router.get('/conversation/:id', [ConversationsController, 'show'])
  router.delete('/conversation/:id', [ConversationsController, 'destroy'])
  
  // Debug endpoint
  router.post('/debug/test-api', [DebugController, 'testExternalApi'])
}).prefix('/api/v1')