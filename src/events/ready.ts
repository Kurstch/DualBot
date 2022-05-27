import { registerGlobalSlashCommands } from 'discord-botly'
import type { BotlyModule } from 'discord-botly'

export const { execute }: BotlyModule<'ready'> = {
    execute: client => {
        registerGlobalSlashCommands(client)
        console.info(`Discord client logged in as ${client.user.tag}`)
    }
}
