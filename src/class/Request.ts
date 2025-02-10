import { Discord, DiscordOptions } from "./Discord"

export interface RequestOptions extends DiscordOptions  {
    method: string
}

export class Request extends Discord {
    public method: string

    constructor({ method, userToken }: RequestOptions) {
        super({ userToken })
        this.method = method
    }
}