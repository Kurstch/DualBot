import { SlashCommandBuilder } from "@discordjs/builders"

interface Command {
    data: SlashCommandBuilder
    execute: Function
}