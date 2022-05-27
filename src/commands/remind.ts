import { SlashCommandBuilder } from '@discordjs/builders'
import type { CommandInteraction } from 'discord.js'
import type { BotlyModule } from 'discord-botly'

let reminders = []

export const { commandData, execute }: BotlyModule<CommandInteraction> = {
    commandData: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Setup and configure reminders.')
        .addSubcommand(subcommand => subcommand
            .setName('dm')
            .setDescription('Remind in dm')
            .addStringOption(option => option
                .setName('time')
                .setDescription('When to remind')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('message')
                .setDescription('What to remind')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('Remind in server')
            .addStringOption(option => option
                .setName('time')
                .setDescription('When to remind')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('message')
                .setDescription('What to remind')
                .setRequired(true)
            )
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('Channel where to write reminder.')
            )
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Role to mention when reminding')
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('show')
            .setDescription('Shows incoming reminders')
    ),

    async execute(interaction: CommandInteraction) {
        console.log(interaction)
        const subcommand = interaction.options.getSubcommand()

        if (subcommand === 'show') interaction.reply(`\`\`\`\n${reminders.toString()}\n\`\`\``)

        const time = interaction.options.get('time').value
        const message = interaction.options.get('message').value

        if (subcommand === 'server') {
            var role = interaction.options.get('role').value
            var channel = interaction.options.get('channel').value
        }

        reminders.push({ time, message, role, channel })
    }
}
