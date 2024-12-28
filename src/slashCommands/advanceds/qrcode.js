const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('Gera um QR code a partir de uma URL')
        .addStringOption(option => option.setName('url').setDescription('Digite um endereço web').setRequired(true)),
    cooldown: '10',
    category: 'Utilidade',
    guildOnly: false,

    async execute(interaction) {
        // Verificar se o usuário é um administrador
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        const enderecoWeb = interaction.options.getString('url');

        const embed = new EmbedBuilder()
            .setTitle('QR Code')
            .setImage(`https://qrtag.net/api/qr.png?url=${enderecoWeb}`)
            .setFooter({ text: 'Fornecido por QRtag' })
            .setColor('#0066ff');

        interaction.reply({ embeds: [embed] });
    }
};
