const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-leave')
        .setDescription('Configura o registro de saídas de membros em um canal de log.')
        .addChannelOption(option =>
            option
                .setName('logchannel')
                .setDescription('Canal para registrar saídas de membros.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const logChannel = interaction.options.getChannel('logchannel');
        
        // Implementar lógica para salvar o canal de log (se necessário em banco de dados ou cache)
        // Exemplo: db.set(`leaveLogChannel_${interaction.guild.id}`, logChannel.id);

        interaction.client.on('guildMemberRemove', member => {
            const embed = new EmbedBuilder()
                .setTitle('❌ Membro Saiu')
                .setDescription(`${member.user.tag} deixou o servidor.`)
                .setColor('#FF0000') // Cor vermelha
                .setThumbnail(member.user.displayAvatarURL()) // Foto de perfil do membro
                .addFields(
                    { name: 'Nome', value: member.user.tag, inline: true },
                    { name: 'ID do Membro', value: member.user.id, inline: true },
                    { name: 'Data de Saída', value: new Date().toLocaleString(), inline: false }
                )
                .setFooter({ text: `ID do servidor: ${member.guild.id}`, iconURL: member.guild.iconURL() })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        await interaction.reply(`O canal ${logChannel} foi configurado para registrar saídas de membros.`);
    },
};
