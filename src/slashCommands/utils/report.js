const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Reporta um membro para os moderadores.')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuário a ser reportado.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motivo')
                .setDescription('Motivo do reporte.')
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option
                .setName('anexo')
                .setDescription('Anexo (imagem ou arquivo) do reporte.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('link')
                .setDescription('Link relacionado ao reporte.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo');
        const attachment = interaction.options.getAttachment('anexo'); // Obtém o anexo, se existir
        const link = interaction.options.getString('link'); // Obtém o link, se existir

        // Embed de reporte
        const reportEmbed = new EmbedBuilder()
            .setTitle('🚩 Novo Reporte Recebido')
            .addFields(
                { name: 'Usuário Reportado:', value: `${user.tag} (${user.id})` },
                { name: 'Motivo:', value: motivo },
                { name: 'Reportado Por:', value: `${interaction.user.tag} (${interaction.user.id})` }
            )
            .setColor('#FF4500')
            .setTimestamp();

        // Adicionando link de anexo, se existir
        if (attachment) {
            reportEmbed.addFields({ name: 'Anexo:', value: `[Clique aqui para visualizar o anexo](${attachment.url})` });
        }

        // Adicionando link, se existir
        if (link) {
            reportEmbed.addFields({ name: 'Link Relacionado:', value: link });
        }

        // Adicionando botões interativos
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('accept_report')
                .setLabel('✅ Aceitar')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('reject_report')
                .setLabel('❌ Rejeitar')
                .setStyle(ButtonStyle.Danger)
        );

        const logChannel = interaction.guild.channels.cache.find(ch => ch.name === '⛔・reportar');
        if (logChannel) {
            // Envia o embed no canal de log com os botões
            await logChannel.send({ embeds: [reportEmbed], components: [actionRow] });
        } else {
            return interaction.reply({
                content: '❌ Não foi possível encontrar o canal de reportes. Certifique-se de que o canal "⛔・reportar" existe.',
                ephemeral: true,
            });
        }

        // Confirmação para o usuário que reportou
        await interaction.reply({
            content: `✅ Seu reporte contra ${user.tag} foi enviado para os moderadores.`,
            ephemeral: true,
        });
    },
};
