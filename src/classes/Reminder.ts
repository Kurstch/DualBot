import { User, MessageEmbed, SnowflakeUtil, MessageActionRow, MessageButton } from 'discord.js'
import Collection from '@discordjs/collection'
import schedule from 'node-schedule'
import ms from 'ms'

import type { CommandInteraction, Role, Guild, TextBasedChannel } from 'discord.js'
import type { APIRole } from 'discord-api-types'
import { stripIndent } from 'common-tags'
import { EventEmitter } from 'stream'

export default class Reminder {
    public readonly id: string
    public readonly date: Date
    public readonly guild: Guild | null
    public readonly author: User
    public readonly events: EventEmitter
    public readonly channel: TextBasedChannel
    public readonly message: string
    private readonly users = new Collection<string, User>()

    public constructor(interaction: CommandInteraction) {
        const { options, guild, user, channel } = interaction

        const time = options.getString('time', true)
        const role = options.getRole('role', false)
        const message = options.getString('message', true)

        this.id = SnowflakeUtil.generate()
        this.date = new Date(Date.now() + ms(time))
        this.guild = guild
        this.author = user
        this.events = new EventEmitter()
        this.channel = channel!
        this.message = message

        if (role) this.subscribeRole(role)

        this.sendReminderPanel(interaction, this, role)

        schedule.scheduleJob(`reminder-${this.id}`, this.date, () => this.end())
    }

    public subscribe(user: User): void {
        this.users.set(user.id, user)
    }

    public unsubscribe(user: User): void {
        this.users.delete(user.id)
    }

    public isSubscribed(user: User): boolean {
        return this.users.has(user.id)
    }

    public async end(): Promise<void> {
        await this.sendReminderMsg()
        this.events.emit('ended')
    }

    public get epoch(): number {
        return Math.round(this.date.getTime() / 1000)
    }

    private async subscribeRole(role: Role | APIRole): Promise<void> {
        const fetchedRole = await this.guild?.roles.fetch(role.id)
        fetchedRole?.members.forEach(member => this.subscribe(member.user))
    }

    private async sendReminderMsg(): Promise<void> {
        const promises: Promise<any>[] = []

        for (const user of this.users.values()) {
            const msg = user.send({
                embeds: [new MessageEmbed()
                    .setTitle('Reminder')
                    .setColor('BLURPLE')
                    .setDescription(this.message)
                    .setFooter({ text: `Created by ${this.author.tag}` })
                ]
            }).catch(error => console.error(error))

            promises.push(msg)
        }

        await Promise.allSettled(promises)
    }

    private async sendReminderPanel(interaction: CommandInteraction, reminder: Reminder, role: Role | APIRole | null): Promise<void> {
        const roleMsg = role ? `\nThe reminder will be sent to all members with the role ${role.toString()}` : ''
        return await interaction.reply({
            embeds: [new MessageEmbed()
                .setTitle('Reminder')
                .setColor('BLURPLE')
                .setDescription(stripIndent`
                    ${reminder.author.toString()} has created a new reminder.${roleMsg}
                    If you are subscribed, a reminder message will be sent to your DM.
                `)
                .addFields([
                    {
                        name: 'Message',
                        value: reminder.message
                    },
                    {
                        name: 'time',
                        value: `<t:${reminder.epoch}:R>`
                    }
                ])
            ],
            components: [new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel('Subscribe')
                    .setStyle('PRIMARY')
                    .setCustomId(`reminder-${reminder.id}-subscribe`),
                new MessageButton()
                    .setLabel('Unsubscribe')
                    .setStyle('DANGER')
                    .setCustomId(`reminder-${reminder.id}-unsubscribe`)
            )]
        })
    }
}
