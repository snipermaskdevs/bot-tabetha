const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-emoji')
    .setDescription('O emoji especificado será adicionado ao servidor.')
        .addAttachmentOption(option => 
            option.setName('emoji')
                .setDescription('O arquivo especificado será enviado e usado como emoji.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('nome')
                .setDescription('O nome especificado será usado para o emoji.')
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(30)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return await interaction.reply({ 
                content: 'Você **não tem** permissão para fazer isso!', 
                ephemeral: true
            });
        }

        const nome = interaction.options.getString('nome');
        const upload = interaction.options.getAttachment('emoji');

        await interaction.reply({ content: `Carregando seu **emoji**...` });

        const emoji = await interaction.guild.emojis.create({
            name: `${nome}`,
            attachment: `${upload.attachment}`
        }).catch(err => {
            setTimeout(() => {
                return interaction.editReply({ 
                    content: `Falha no **upload**! **Erro**: ${err.rawError.message}`
                });
            }, 2000);
        });

        setTimeout(() => {
            if (!emoji) return;

            const embed = new EmbedBuilder()
                .setColor("#2f3136")
                .setAuthor({ name: `Ferramenta de Emojis` })
                .setFooter({ text: `Emoji Adicionado` })
                .setTimestamp()
                .setTitle('Emoji Adicionado')
                .addFields({ 
                    name: `Nome do Emoji`, 
                    value: `Emoji adicionado como: "<:${nome}:${emoji.id}>"` 
                });

            interaction.editReply({ content: ``, embeds: [embed] });
        }, 3000);
    }
}