const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-delete')
        .setDescription('Configura o registro de mensagens deletadas.')
        .addChannelOption(option =>
            option
                .setName('logchannel')
                .setDescription('Canal para registrar mensagens deletadas.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const logChannel = interaction.options.getChannel('logchannel');

        interaction.client.on('messageDelete', (message) => {
            if (message.partial) return; // Ignora se a mensagem for parcial (não completa)

            const embed = new EmbedBuilder()
                .setTitle('🗑️ Mensagem Deletada')
                .setDescription(`Mensagem de **${message.author.tag}** foi deletada no servidor.`)
                .setColor('#FF0000') // Cor vermelha para indicar a exclusão
                .setThumbnail(message.author.displayAvatarURL()) // Foto de perfil do autor da mensagem
                .addFields(
                    { name: 'Conteúdo', value: message.content || 'Nenhum conteúdo', inline: false },
                    { name: 'Canal', value: message.channel.name, inline: true },
                    { name: 'Data de Deleção', value: new Date().toLocaleString(), inline: true }
                )
                .setFooter({ text: `ID do Usuário: ${message.author.id}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        await interaction.reply(`O canal ${logChannel} foi configurado para registrar mensagens deletadas.`);
    },
};
