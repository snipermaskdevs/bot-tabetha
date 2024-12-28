const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-edits')
        .setDescription('Configura o registro de edições de mensagens.')
        .addChannelOption(option =>
            option
                .setName('logchannel')
                .setDescription('Canal para registrar mensagens editadas.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const logChannel = interaction.options.getChannel('logchannel');

        interaction.client.on('messageUpdate', (oldMessage, newMessage) => {
            // Verificar se a mensagem foi realmente editada (conteúdo diferente)
            if (oldMessage.content === newMessage.content) return;

            const embed = new EmbedBuilder()
                .setTitle('✏️ Mensagem Editada')
                .setDescription(`Uma mensagem foi editada por **${newMessage.author.tag}**`)
                .setColor('#FFA500') // Cor laranja, destacando a edição
                .setThumbnail(newMessage.author.displayAvatarURL()) // Foto de perfil do usuário
                .addFields(
                    { name: 'Antes', value: oldMessage.content || 'Nenhum conteúdo', inline: false },
                    { name: 'Depois', value: newMessage.content || 'Nenhum conteúdo', inline: false }
                )
                .setFooter({ text: `ID do Usuário: ${newMessage.author.id}`, iconURL: newMessage.author.displayAvatarURL() })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        await interaction.reply(`O canal ${logChannel} foi configurado para registrar edições de mensagens.`);
    },
};
