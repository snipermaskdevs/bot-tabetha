const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Avatar')
    .addSubcommand(sub => sub
        .setName('get')
        .setDescription('Obtém o avatar de um usuário')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('Usuário para buscar o avatar')
            .setRequired(false)))
    .addSubcommand(sub => sub
        .setName('guild')
        .setDescription('Obtém o avatar do servidor de um usuário, se ele tiver um')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('Usuário para buscar o avatar')
            .setRequired(false)))
    .addSubcommand(sub => sub
        .setName('user')
        .setDescription('Obtém o avatar principal de um usuário')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('Usuário para buscar o avatar')
            .setRequired(false))),
    execute: async function (interaction, client) {
        const sub = interaction.options.getSubcommand()

        let user, embed;

        switch (sub) {
            case 'get':
                user = interaction.options.getMember('user') || interaction.member;
                embed = new EmbedBuilder()
                .setTitle('Avatar do Servidor')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                interaction.reply({ embeds: [embed] })
            break;
            case 'guild':
                user = interaction.options.getMember('user') || interaction.member;
                const user2 = interaction.options.getUser('user') || interaction.user;
                if (user.displayAvatarURL() == user2.displayAvatarURL()) return interaction.reply({ embeds: [new EmbedBuilder().setColor("#FF2D00").setDescription(`<:error:1205124558638813194> não tem um avatar de servidor.`)], ephemeral: true });
                embed = new EmbedBuilder()
                .setTitle('Avatar do Servidor')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                interaction.reply({ embeds: [embed] })
            break;
            case 'user':
                user = interaction.options.getUser('user') || interaction.user;
                embed = new EmbedBuilder()
                .setTitle('Avatar do Usuário')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
                interaction.reply({ embeds: [embed] })
            break;
        }
    }
}
