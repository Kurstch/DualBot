import { SlashCommandBuilder } from '@discordjs/builders'

import Reminders from '../managers/Reminders'

import type { CommandInteraction } from 'discord.js'
import type { BotlyModule } from 'discord-botly'

export const { commandData, execute }: BotlyModule<CommandInteraction> = {
    commandData: new SlashCommandBuilder()
        .setName('reminders')
        .setDescription('Setup and configure reminders.')
        .addSubcommand(subcommand => subcommand
            .setName('add')
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
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Role to mention when reminding')
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('show')
            .setDescription('Shows incoming reminders')
        ),

    execute: async interaction => {
        const subcommand = interaction.options.getSubcommand()

        switch (subcommand) {
            case 'show':
                await Reminders.sendMyReminders(interaction)
                break

            case 'add':
                await Reminders.createReminder(interaction)
                break
        }
    }
}
