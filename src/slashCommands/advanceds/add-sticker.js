const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-sticker')
    .setDescription('O arquivo especificado será adicionado como um adesivo no servidor.')
    .addAttachmentOption(option => option.setName('sticker').setDescription(`O arquivo PNG/JPEG especificado será carregado como um sticker.`).setRequired(true))
    .addStringOption(option => option.setName('nome').setDescription(`O nome especificado será o nome do adesivo`).setRequired(true).setMinLength(2).setMaxLength(29)),
    
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return await interaction.reply({ content: 'Você **não** tem permissão para fazer isso!', ephemeral: true });

        const nome = interaction.options.getString('nome');
        const upload = interaction.options.getAttachment('sticker');

        if (upload.contentType === 'Image/gif') return await interaction.reply({ content: 'Você **não pode** enviar adesivos animados!', ephemeral: true });

        await interaction.reply({ content: 'Carregando seu **sticker**...' });

        const sticker = await interaction.guild.stickers.create({

            file: `${upload.attachment}`,
            name: `${nome}`

        }).catch(err => {
            setTimeout(() => {
                return interaction.editReply({ content: `O upload **falhou**! **Erro**: ${err.rawError.message}` });
            }, 2000);
        });

        const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({ name: `Ferramenta de Sticker` })
        .setFooter({ text: `Sticker Adicionado` })
        .setTimestamp()
        .setTitle('Sticker Adicionado')
        .addFields({ name: `Nome do Sticker`, value: `Sticker adicionado como: "**${nome}**"` });

        setTimeout(() => {
            if (!sticker) return;

            interaction.editReply({ content: '', embeds: [embed] });
        }, 3000);
    }
}
