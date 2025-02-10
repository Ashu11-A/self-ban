import { Channels } from '@/rest/requests/channels.js'

interface DiscordOptions {
    userToken: string
}

export class Discord {
  public userToken: string
  public channels: Channels = new Channels(this)
  public user = null


  constructor({ userToken }: DiscordOptions) {
    this.userToken = userToken
  }
}