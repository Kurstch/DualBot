import reminders from '../managers/Reminders'

import type { ButtonInteraction } from 'discord.js'
import type { BotlyModule } from 'discord-botly'

export const { execute }: BotlyModule<ButtonInteraction> = {
    execute: async (interaction, params) => {
        const reminder = reminders.getReminder(params.id)

        if (reminder) {
            if (reminder.isSubscribed(interaction.user)) {
                reminder.unsubscribe(interaction.user)
                await reply('You are no longer subscribed to this reminder')
            } else await reply('You are not subscribed to this reminder')
        } else await reply('This reminder has already ended')

        async function reply(text: string) {
            await interaction.reply({
                content: text,
                ephemeral: true
            })
        }
    }
}
