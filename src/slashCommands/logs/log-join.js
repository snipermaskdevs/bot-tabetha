const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-join')
        .setDescription('Configura o registro de novos membros em um canal de log.')
        .addChannelOption(option =>
            option
                .setName('logchannel')
                .setDescription('Canal para registrar novos membros.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const logChannel = interaction.options.getChannel('logchannel');
        
        // Implementar lógica para salvar o canal de log (se necessário em banco de dados ou cache)
        // Exemplo: db.set(`logChannel_${interaction.guild.id}`, logChannel.id);

        interaction.client.on('guildMemberAdd', member => {
            const embed = new EmbedBuilder()
                .setTitle('🆕 Novo Membro Chegou!')
                .setDescription(`${member.user.tag} entrou no servidor! 🎉`)
                .setColor('#00FF00') // Cor verde
                .setThumbnail(member.user.displayAvatarURL()) // Foto de perfil do membro
                .addFields(
                    { name: 'Nome', value: member.user.tag, inline: true },
                    { name: 'ID do Membro', value: member.user.id, inline: true },
                    { name: 'Entrou em', value: new Date().toLocaleString(), inline: false }
                )
                .setFooter({ text: `ID do servidor: ${member.guild.id}`, iconURL: member.guild.iconURL() })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        await interaction.reply(`O canal ${logChannel} foi configurado para registrar entradas de novos membros.`);
    },
};
