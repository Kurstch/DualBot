import { Client, Intents } from 'discord.js'
import * as botly from 'discord-botly'
import * as path from 'path'
import 'dotenv/config'

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
    ]
})

botly.init({
    client,
    eventsDir: path.join(__dirname, './events'),
    buttonsDir: path.join(__dirname, './buttons'),
    commandsDir: path.join(__dirname, './commands'),
})

client.login(process.env.TOKEN)
