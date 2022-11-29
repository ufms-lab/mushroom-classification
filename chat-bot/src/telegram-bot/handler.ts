import { Lambda } from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'
import qs from 'qs'
import { TelegramBot } from 'telegram-bot-nodejs'

const client = new Lambda()

export const main: APIGatewayProxyHandler = async (event): Promise<any> => {
  console.log('[Started] Telegram chat bot!')
  if (!event.body) throw new Error('Invalid Payload')
  const body = JSON.parse(event.body)
  console.log('[User Request] ', body)
  const { chat, message_id, photo, text } = body.message

  const token = process.env.TELEGRAM_TOKEN ?? ''

  const bot = new TelegramBot(token, chat.id)

  if (text) {
    let message = ''
    switch (text) {
      case '/start':
        message = "Welcome, send me a picture of a mushroom and I'll tell you what species it is"
        break
      case '/classes':
        message = `*Trained classes*
- Amanita gemmata
- Amanita muscaria
- Amanita pantherina
- Amanita phalloides
- Clathrus archeri
- Coprinellus disseminatus
- Coprinus comatus
- Entoloma hochstetteri
- Filoboletus manipularis
- Fomes fomentarius
- Gyromitra esculenta
- Hericium erinaceus
- Hydnellum peckii
- Ileodictyon cibarium
- Lepiota cristata
- Morchella esculenta
- Phallus indusiatus
- Psilocybe cubensis
- Psilocybe semilanceata
- Trametes versicolor`
        break
      case '/model':
        message = 'shufflenetv2'
        break
      default:
        message = `*UFMS Lab - Mushroom Classification*
Alison Vilela

*Available commands*
- /start -> Welcome message.
- /classes -> List the classes trained.
- /model -> Displays the current model I'm using.
- /help -> Displays this help message.`
        break
    }

    const options = qs.stringify({
      chat_id: chat.id,
      text: message,
      parse_mode: 'markdown',
    })
    await bot.publicCall('sendMessage', options)
  } else if (photo) {
    await bot.sendMessage("Okay, wait a minute, I'll do my best!")
    try {
      const telegramImage = await bot.publicCall('getFile', qs.stringify({ file_id: photo[photo.length - 1].file_id }))

      console.log('telegramImage.: ', telegramImage)

      const classificationResult = await client
        .invoke({
          FunctionName: `mushroom-classification-api-${process.env.ENV}-inference`,
          InvocationType: 'RequestResponse',
          LogType: 'Tail',
          Payload: JSON.stringify({
            picture: `https://api.telegram.org/file/bot${token}/${telegramImage.result.file_path}`,
          }),
        })
        .promise()

      const classificationString = Buffer.from(classificationResult.Payload as any).toString('utf8')
      const classification = JSON.parse(classificationString)

      console.log('classification.: ', classification)

      const options = qs.stringify({
        chat_id: chat.id,
        text: classification.body,
        reply_to_message_id: message_id,
      })

      await bot.publicCall('sendMessage', options)
    } catch (e) {
      console.log('error.: ', e)
      await bot.sendMessage("I'm having internal problems, please try again later")
    }
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
