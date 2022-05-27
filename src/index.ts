import { Client, Collection, Intents } from 'discord.js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { Command } from '../types/main'
import { init } from 'discord-botly'
import 'dotenv/config'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

init({
    client,
    eventsDir: path.join(__dirname, './events'),
    commandsDir: path.join(__dirname, './commands'),
})



client.login(process.env.TOKEN)
