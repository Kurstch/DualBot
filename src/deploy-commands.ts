import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { Command } from '../types/main'

dotenv.config()

const commands = []
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command: Command = require(path.join(__dirname, `./commands/${file}`)).default
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
