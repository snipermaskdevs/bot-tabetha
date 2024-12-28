const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { customId, message } = interaction;
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const moderatorRole = 'STAFF ・ Responsável Reportar'; // Substitua pelo nome ou ID do cargo de moderador

        // Verifica se o usuário tem o cargo de moderador
        if (!member.roles.cache.some(role => role.name === moderatorRole)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para interagir com esses botões.',
                ephemeral: true,
            });
        }

        const reportEmbed = message.embeds[0];
        const reportedUserId = reportEmbed.fields[0].value.split('(')[1].split(')')[0]; // Extrai o ID do usuário reportado
        const reporter = await interaction.client.users.fetch(reportEmbed.fields[2].value.split('(')[1].split(')')[0]); // Recupera o usuário que fez o reporte

        // Emojis personalizados para o status
        const acceptedEmoji = '✅';
        const rejectedEmoji = '❌';

        // Adicionando mais detalhes à embed
        if (customId === 'accept_report') {
            const updatedEmbed = new EmbedBuilder()
                .setColor('#00FF00')  // Verde para aceito
                .setTitle('🟢 Reporte Aceito')
                .setDescription(`O reporte de **${reportEmbed.fields[0].value}** foi **aceito** pelos moderadores! ${acceptedEmoji}`)
                .addFields(
                    { name: 'Usuário Reportado:', value: `${reportEmbed.fields[0].value}`, inline: true },
                    { name: 'Motivo:', value: `${reportEmbed.fields[1].value}`, inline: true },
                    { name: 'Status:', value: '✅ Aceito pelos moderadores', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `Decisão tomada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail('https://example.com/aceito-icon.png');  // Exemplo de imagem de ícone

            // Atualiza a embed com a decisão de aceitação
            await interaction.update({
                embeds: [updatedEmbed],
                components: [],  // Remove os botões após a interação
            });

            // Notificação de aceitação para os moderadores
            await interaction.followUp({
                content: `📢 O reporte de ${reportEmbed.fields[0].value} foi aceito pelos moderadores!`,
                ephemeral: true,
            });

            // Envia uma DM para o usuário que fez o reporte, se possível
            try {
                await reporter.send({
                    content: `✅ Seu reporte contra **${reportEmbed.fields[0].value}** foi aceito pelos moderadores!`,
                });
            } catch (error) {
                console.log(`Não foi possível enviar DM para ${reporter.tag}. DM fechada.`);
                const logChannel = interaction.guild.channels.cache.find(ch => ch.name === '⛔・reportar');
                if (logChannel) {
                    await logChannel.send({
                        content: `⚠️ Não foi possível enviar DM para o usuário ${reporter.tag}. A DM foi fechada.`,
                    });
                }
            }

            // Log para os moderadores
            console.log(`Reporte aceito: Usuário reportado - ${reportEmbed.fields[0].value}`);
        } else if (customId === 'reject_report') {
            const updatedEmbed = new EmbedBuilder()
                .setColor('#FF0000')  // Vermelho para rejeitado
                .setTitle('🔴 Reporte Rejeitado')
                .setDescription(`O reporte de **${reportEmbed.fields[0].value}** foi **rejeitado** pelos moderadores! ${rejectedEmoji}`)
                .addFields(
                    { name: 'Usuário Reportado:', value: `${reportEmbed.fields[0].value}`, inline: true },
                    { name: 'Motivo:', value: `${reportEmbed.fields[1].value}`, inline: true },
                    { name: 'Status:', value: '❌ Rejeitado pelos moderadores', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `Decisão tomada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail('https://example.com/rejeitado-icon.png');  // Exemplo de imagem de ícone

            // Atualiza a embed com a decisão de rejeição
            await interaction.update({
                embeds: [updatedEmbed],
                components: [],  // Remove os botões após a interação
            });

            // Notificação de rejeição para os moderadores
            await interaction.followUp({
                content: `🚫 O reporte de ${reportEmbed.fields[0].value} foi rejeitado pelos moderadores!`,
                ephemeral: true,
            });

            // Envia uma DM para o usuário que fez o reporte, se possível
            try {
                await reporter.send({
                    content: `❌ Seu reporte contra **${reportEmbed.fields[0].value}** foi rejeitado pelos moderadores.`,
                });
            } catch (error) {
                console.log(`Não foi possível enviar DM para ${reporter.tag}. DM fechada.`);
                const logChannel = interaction.guild.channels.cache.find(ch => ch.name === '⛔・reportar');
                if (logChannel) {
                    await logChannel.send({
                        content: `⚠️ Não foi possível enviar DM para o usuário ${reporter.tag}. A DM foi fechada.`,
                    });
                }
            }

            // Log para os moderadores
            console.log(`Reporte rejeitado: Usuário reportado - ${reportEmbed.fields[0].value}`);
        }
    },
};
