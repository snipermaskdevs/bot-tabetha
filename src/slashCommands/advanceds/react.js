const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('Adiciona uma reação a uma mensagem')
        .addStringOption(option => 
            option.setName('mensagem_id')
                .setDescription('ID da mensagem para reagir')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('emoji')
                .setDescription('Emoji para adicionar como reação')
                .setRequired(true)),
    
    async execute(interaction) {
        const messageId = interaction.options.getString('mensagem_id');
        const emoji = interaction.options.getString('emoji');

        const channel = interaction.channel;
        const message = await channel.messages.fetch(messageId).catch(() => null);

        const embed = new EmbedBuilder()
            .setColor('#FFA500') // Cor laranja
            .setFooter({ text: `Reação adicionada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        if (message) {
            await message.react(emoji);
            embed.setTitle('✅ Reação Adicionada!')
                .setDescription(`Você adicionou a reação **"${emoji}"** à mensagem com ID: **${messageId}**.`)
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
                    .setTitle('✅ Reação Adicionada')
                    .addFields(
                        { name: 'Reação Adicionada por', value: interaction.user.tag, inline: true },
                        { name: 'Emoji Reagido', value: emoji, inline: true },
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
                .setDescription('Mensagem não encontrada. Verifique o ID e tente novamente.');
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
