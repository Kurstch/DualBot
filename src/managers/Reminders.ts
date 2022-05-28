import { MessageEmbed } from 'discord.js'
import Collection from '@discordjs/collection'

import type { CommandInteraction } from 'discord.js'
import Reminder from '../classes/Reminder'

class Reminders {
    private readonly reminders = new Collection<string, Reminder>()

    public async createReminder(interaction: CommandInteraction): Promise<void> {
        const reminder = new Reminder(interaction)
        this.reminders.set(reminder.id, reminder)
        reminder.events.on('ended', () => this.reminders.delete(reminder.id))
    }

    public getReminder(id: string): Reminder | undefined {
        return this.reminders.get(id)
    }

    public async sendMyReminders(interaction: CommandInteraction): Promise<void> {
        const createdReminders = this.reminders.filter(reminder => reminder.author.id === interaction.user.id)
        const subscribedReminders = this.reminders.filter(reminder => reminder.isSubscribed(interaction.user))
        await interaction.reply({
            ephemeral: true,
            embeds: [new MessageEmbed()
                .setTitle('Your Reminders')
                .setColor('BLURPLE')
                .addFields([
                    {
                        name: 'Created Reminders',
                        value: createdReminders.size
                            ? createdReminders.map(reminder => `<t:${reminder.epoch}:R> ${reminder.message}`).join('\n')
                            : 'You have no created reminders'
                    },
                    {
                        name: 'Subscribed Reminders',
                        value: subscribedReminders.size
                            ? subscribedReminders.map(reminder => `<t:${reminder.epoch}:R> ${reminder.message}`).join('\n')
                            : 'You have no subscribed reminders'
                    }
                ])
            ]
        })
    }
}

export default new Reminders()
