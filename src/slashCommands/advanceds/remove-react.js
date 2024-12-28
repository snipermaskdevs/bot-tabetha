const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-react')
        .setDescription('Remove uma reação de uma mensagem')
        .addStringOption(option => 
            option.setName('mensagem_id')
                .setDescription('ID da mensagem para remover a reação')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('emoji')
                .setDescription('Emoji da reação para remover')
                .setRequired(true)),

    async execute(interaction) {
        const messageId = interaction.options.getString('mensagem_id');
        const emoji = interaction.options.getString('emoji');

        const channel = interaction.channel;
        const message = await channel.messages.fetch(messageId).catch(() => null);

        const embed = new EmbedBuilder()
            .setColor('#FFA500') // Cor laranja
            .setFooter({ text: `Reação removida por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        if (message) {
            // Verifica se o emoji é uma reação válida (Unicode ou nome de emoji personalizado)
            const emojiObject = emoji.includes(':') ? emoji : emoji.split('').map(e => e.charCodeAt(0).toString(16)).join(':');
            const reactions = message.reactions.cache.filter(reaction => reaction.emoji.name === emoji || reaction.emoji.toString() === emojiObject);

            if (reactions.size > 0) {
                await reactions.first().users.remove(interaction.user.id); // Remove a reação do usuário que executou o comando

                embed.setTitle('✅ Reação Removida!')
                    .setDescription(`Você removeu a reação **"${emoji}"** da mensagem com ID: **${messageId}**.`)
                    .addFields(
                        { name: '📬 Canal', value: `<#${channel.id}>`, inline: true },
                        { name: '👤 Autor da Mensagem', value: message.author.tag, inline: true }
                    );

                // Enviar o log para o canal "geral" ou "logs"
                const channelName = '🪂⠂logs'; // Nome do canal de logs
                const logChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

                if (logChannel && logChannel.isText()) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#1E90FF') // Cor azul para log de reação
                        .setTitle('✅ Reação Removida')
                        .addFields(
                            { name: 'Reação Removida por', value: interaction.user.tag, inline: true },
                            { name: 'Emoji Removido', value: emoji, inline: true },
                            { name: 'Mensagem ID', value: messageId, inline: true },
                            { name: 'Canal', value: `<#${channel.id}>`, inline: true },
                            { name: 'Autor da Mensagem', value: message.author.tag, inline: true },
                        )
                        .setTimestamp();

                    // Envia o log para o canal de logs
                    await logChannel.send({ embeds: [logEmbed] });
                } else {
                    console.warn('Canal de logs não encontrado ou não é um canal de texto.');
                }
            } else {
                embed.setColor('#FF0000') // Cor vermelha para erro
                    .setTitle('❌ Erro!')
                    .setDescription('Essa reação não foi encontrada na mensagem. Verifique o emoji e tente novamente.');
            }
        } else {
            embed.setColor('#FF0000') // Cor vermelha para erro
                .setTitle('❌ Erro!')
                .setDescription('Mensagem não encontrada. Verifique o ID e tente novamente.');
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
