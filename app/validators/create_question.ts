import vine from '@vinejs/vine'

export const createQuestionValidator = vine.compile(
  vine.object({
    message: vine.string().trim().minLength(1).maxLength(1000),
    session_id: vine.string().trim().optional(),
  })
)