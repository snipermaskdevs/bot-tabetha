const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-voice')
        .setDescription('Configura o registro de atividades em canais de voz.')
        .addChannelOption(option =>
            option
                .setName('logchannel')
                .setDescription('Canal para registrar atividades em canais de voz.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const logChannel = interaction.options.getChannel('logchannel');

        // Função para enviar o embed de atividade em canal de voz
        const sendVoiceLog = (newState, action) => {
            const embed = new EmbedBuilder()
                .setTitle(`🔊 Membro ${action} do Canal de Voz`)
                .setDescription(`${newState.member.user.tag} ${action} no canal de voz **${newState.channel ? newState.channel.name : 'Nenhum'}**`)
                .setColor('#800080') // Cor roxa
                .setThumbnail(newState.member.user.displayAvatarURL()) // Foto de perfil do membro
                .addFields(
                    { name: 'Membro', value: newState.member.user.tag, inline: true },
                    { name: 'Canal', value: newState.channel ? newState.channel.name : 'Nenhum', inline: true },
                    { name: 'Ação', value: action === 'entrou' ? 'Entrou' : 'Saiu', inline: true },
                )
                .setFooter({ text: `ID do Membro: ${newState.member.id}`, iconURL: newState.member.user.displayAvatarURL() })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        };

        // Evento de atualização de estado de voz
        interaction.client.on('voiceStateUpdate', (oldState, newState) => {
            // Verifica se o membro entrou ou saiu de um canal de voz
            if (oldState.channelId !== newState.channelId) {
                const action = newState.channelId ? 'entrou' : 'saiu'; // Verifica se entrou ou saiu
                sendVoiceLog(newState, action); // Chama a função para enviar o log
            }
        });

        await interaction.reply(`O canal ${logChannel} foi configurado para registrar atividades em canais de voz.`);
    },
};
