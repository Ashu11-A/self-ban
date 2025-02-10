import 'dotenv/config'
import { readFile } from 'fs/promises'
import { Discord } from './class/Discord.js'
import { MessageProcessor } from './formatters/csv.js'
import { Message } from './types/message.js'

const client = new Discord({ userToken: process.env.TOKEN as string })

// const messages: Message[] = []
// let currentMsg: string | undefined

// async function getMessages(currentMsg: string | undefined) {
//   const response = await client.channels.fetch({ channelId: '1005181663027929210', limit: 100, before: currentMsg })

//   /**
//    * https://discord.com/developers/docs/topics/rate-limits#rate-limits
//    */
//   const remainingOrders = Number(response.headers['X-RateLimit-Remaining'])
//   const resetAfter = Number(response.headers['Reset-After'])

//   const lastMessage = response.data.at(-1)
//   console.log(response.status)
//   console.log(currentMsg)
//   console.log(lastMessage?.id)
//   if (lastMessage === undefined || currentMsg === lastMessage.id) return
//   currentMsg = lastMessage?.id



//   messages.push(...response.data)
//   await writeFile('messages.json', JSON.stringify(messages, null, 2))

//   if (remainingOrders === 0) {
//     return setTimeout(() => getMessages(currentMsg), resetAfter * 1250)
//   }
//   return getMessages(currentMsg)
// }

// getMessages(currentMsg)

const loadedMessages = JSON.parse(await readFile('messages.json', { encoding: 'utf-8' })) as Message[]

console.log(loadedMessages.length)
await new MessageProcessor(loadedMessages)
  .parseMessages()
  .generateCSV()
  .saveToCSV('messages.csv')