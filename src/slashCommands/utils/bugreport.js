const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Reporte um bug para o proprietário do bot.')
        .addStringOption(option => 
            option
                .setName('bug')
                .setDescription('O bug que você deseja reportar.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const bug = interaction.options.getString('bug');
        
        // Confirmação para o usuário
        const userEmbed = new EmbedBuilder()
            .setTitle('Relatório de Bug')
            .setDescription('Seu bug foi reportado com sucesso!')
            .setTimestamp()
            .setColor('#A020F0');
        await interaction.reply({ embeds: [userEmbed], ephemeral: true }); // Mensagem privada ao usuário

        // Enviar o log para o canal de logs
        const channelName = '🪂⠂logs'; // Nome do canal de logs
        const logChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

        if (logChannel) {
            // Embed para o relatório de bug no canal de logs
            const logEmbed = new EmbedBuilder()
                .setTitle('Relatório de Bug')
                .setDescription(`**Bug Reportado:**\n${bug}`)
                .addFields(
                    { name: 'Usuário', value: `${interaction.user.tag}`, inline: true },
                    { name: 'ID do Usuário', value: `${interaction.user.id}`, inline: true },
                    { name: 'Data', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setColor('#A020F0')
                .setFooter({ text: `ID da Guilda: ${interaction.guild.id}` })
                .setTimestamp();
            
            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.log("Canal de log não encontrado.");
        }
    }
};
