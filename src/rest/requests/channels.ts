import { Discord } from '@/class/Discord.js'
import { IntRange } from '@/types/generic.js'
import { request } from '../controller.js'
import { AxiosResponse } from 'axios'
import { Message } from '@/types/message.js'

interface ChannelFetch {
    channelId: string,
    limit?: IntRange<1, 101>
    before?: string
}

export class Channels {
  client: Discord
  constructor(client: Discord) {
    this.client = client
  }

  async fetch ({ channelId, limit, before }: ChannelFetch): Promise<AxiosResponse<Message[], unknown>> {
    const response = await request.get(`channels/${channelId}/messages?limit=${limit}${before ? `&before=${before}` : ''}`, {
      headers: {
        'accept': 'application/json',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'pt,en-US;q=0.9,en;q=0.8',
        'Authorization': this.client.userToken
      },
      method: 'GET'
    })

    return response
  }
}