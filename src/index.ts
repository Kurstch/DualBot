import { Client, Collection, Intents } from 'discord.js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { Command } from '../types/main'

dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const commands: Collection<string, Command> = new Collection()
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(path.join(__dirname, `./commands/${file}`)).default
    commands.set(command.data.name, command)
    console.info(`@ successfully registered command "${command.data.name}"`)
}

client.once('ready', () => {
    console.log(`Discord client logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        })
    }
})

client.login(process.env.TOKEN)
