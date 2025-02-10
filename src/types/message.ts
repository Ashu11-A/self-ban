export type Mention = {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner: string | null
  accent_color: string | null
  global_name: string
  avatar_decoration_data: string | null
  banner_color: string | null
  clan: string | null
}

export type Author = {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner: string | null
  accent_color: string | null
  global_name: string
  avatar_decoration_data: string | null
  banner_color: string | null
  clan: string | null
}

export type MessageReference = {
  type: number
  channel_id: string
  message_id: string
}

export type ReferencedMessage = {
  type: number
  content: string
  mentions: Mention[]
  mention_roles: string[]
  attachments: string[]
  embeds: string[]
  timestamp: string
  edited_timestamp: string | null
  flags: number
  components: string[]
  id: string
  channel_id: string
  author: Author
  pinned: boolean
  mention_everyone: boolean
  tts: boolean
}

export type Attachment = {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
  width: number
  height: number
  content_type: string
  placeholder: string
  placeholder_version: number
}

export type Message = {
  type: number
  content: string
  mentions: Mention[]
  mention_roles: string[]
  attachments: Attachment[]
  embeds: never[]
  timestamp: string
  edited_timestamp: string | null
  flags: number
  components: string[]
  id: string
  channel_id: string
  author: Author
  pinned: boolean
  mention_everyone: boolean
  tts: boolean
  message_reference: MessageReference
  position: number
  referenced_message: ReferencedMessage
}
