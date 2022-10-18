import { APIGatewayProxyHandler } from 'aws-lambda'
import qs from 'qs'
import { TelegramBot } from 'telegram-bot-nodejs'

export const main: APIGatewayProxyHandler = async (event): Promise<any> => {
  console.log('[Started] Telegram chat bot!')
  if (!event.body) throw new Error('Invalid Payload')

  const body = JSON.parse(event.body)
  const { chat, message_id, photo, text } = body.message

  console.log('event.body.: ', event.body)
  console.log('body.: ', body)

  const token = process.env.TELEGRAM_TOKEN ?? ''

  const bot = new TelegramBot(token, chat.id)

  await bot.sendMessage("Okay, wait a minute, I'll do my best!")

  await new Promise(r => setTimeout(r, 5000)) // Sleep 5 seconds

  if (text) {
    const options = qs.stringify({
      chat_id: chat.id,
      text: 'Hello world for Text!',
      reply_to_message_id: message_id,
    })

    await bot.publicCall('sendMessage', options)
  } else if (photo) {
    const options = qs.stringify({
      chat_id: chat.id,
      text: 'Hello world for Photo!',
      reply_to_message_id: message_id,
    })

    await bot.publicCall('sendMessage', options)
  } else {
    const options = qs.stringify({
      chat_id: chat.id,
      text: "I don't understand this format 😔",
      reply_to_message_id: message_id,
    })

    await bot.publicCall('sendMessage', options)
  }

  console.log('[Finished] Telegram chat bot!')
  return { statusCode: 200 }
}
