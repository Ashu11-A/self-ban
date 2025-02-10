import { Message } from '@/types/message.js'
import { writeFile } from 'fs/promises'

interface DataCSV {
    Date: string
    AuthorID: string
    Author: string
    MessageId: string
    Content: string
    Mention: string
}

export class MessageProcessor {
  private messages: Message[] = []
  private data: DataCSV[] = []
  private keys: string[] = []
  private content: string[][] = []
  private csvContent: string = ''
  
  constructor(messages: Message[]) {
    this.messages = messages
  }
  
  public parseMessages() {
    const filteredMessages = this.filterMessages()
    const formattedMessages = this.formatMessages(filteredMessages)
    const columnHeaders = Object.keys(formattedMessages[0])

    this.data = formattedMessages
    this.keys.push(...columnHeaders)
    return this
  }

  public timeAggregation () {
    // const maxTime = 300
    this.keys = ['Author', 'Input', 'Output']
    this.content.push(this.keys)

    for (let index = 0; index < this.data.length; index++) {
      const message = this.data[index]
      const parents: DataCSV[] = []
      const childrens: DataCSV[] = []
      const responses: DataCSV[] = []

      const getParentsMessages = (index: number) => {
        const parent = this.data[index]

        if (parent === undefined) return

        if (parent.Author === message.Author) {
          parents.push(parent)
          return getParentsMessages(index + 1)
        }
      }

      const getChildrensMessages = (index: number) => {
        const children = this.data[index]

        if (children === undefined) return

        if (children.Author === message.Author) {
          childrens.push(children)
          return getChildrensMessages(index -1)
        }
      }

      const getResponsesMessages = (index: number) => {
        const response = this.data[index]

        if (response === undefined) return

        if (response.Author !== message.Author) {
          const nextResponse = this.data[index + 1]
          
          responses.push(response)

          if (nextResponse && nextResponse.Author !== message.Author) {
            return getResponsesMessages(index + 1)
          }
        } else {
          return getResponsesMessages(index + 1)
        }
      }
      
      getParentsMessages(index + 1)
      getResponsesMessages(index - 1)
      getChildrensMessages(index)

      this.content.push(Object.values({
        Author: message.Author,
        Input:  `"${parents.map((parent) => parent.Content.replace(/"/g, '""'))}${childrens.map((children) => children.Content.replace(/"/g, '""'))}"`,
        Output: `"${responses.map((response) => response.Content.replace(/"/g, '""'))}"`
      }))
      
      index = index + childrens.length + responses.length
    }
    
    this.concatenateData(this.content)

    return this
  }

  generateCSV() {
    const values: string[][] = []
  
    for (const data of this.data) {
      values.push(Object.values(data))
    }
    
    this.content.push(this.keys)
    this.content.push(...values)
    this.concatenateData(this.content)

    return this
  }

  public linkMentions (user: string) {
    const messagesWithMention = this.data.filter(
      (msg) => msg.Author === user && msg.Mention !== ''
    )
  
    const linkedMentions = messagesWithMention.map((msg) => ({
      ...msg,
      Mention: this.data.find((original) => original.MessageId === msg.Mention)?.Content,
    }))
  
    const formattedMentions = linkedMentions.filter((msg) => msg.Mention !== undefined)
  
    this.content.push(this.keys)
    formattedMentions.forEach((msg) => this.content.push(Object.values(msg) as string[]))
  
    this.concatenateData(this.content)
    return this
  }
  
  public async saveToCSV(filename: string): Promise<void> {
    const csvBlob = new Blob([this.csvContent], { type: 'text/csvcharset=utf-8,' })
    await writeFile(filename, await csvBlob.bytes(), { encoding: 'utf-8' })
  }

  private filterMessages(): Message[] {
    return this.messages.filter(
      (message) =>
        !['Started a call that lasted', '', 'Left the group.', 'to the group.'].includes(message.content)
    )
  }
  
  private formatMessages(messages: Message[]): DataCSV[] {
    return messages.map(({ author, timestamp, content, referenced_message, id }) => ({
      Date: timestamp,
      AuthorID: author.id,
      Author: author.username,
      MessageId: id,
      Content: `"${content.replace(/"/g, '""')}"`,
      Mention: referenced_message?.id,
    }))
  }
  
  private concatenateData(data: string[][]): void {
    data.forEach((row) => (this.csvContent += row.join(',') + '\n'))
  }
}
  