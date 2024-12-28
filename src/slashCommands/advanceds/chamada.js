const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chamada')
        .setDescription('Chama o suporte para interagir com um usuário.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para quem o suporte será chamado.')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Verifica se a interação foi feita por um bot
        if (interaction.user.bot) {
            return interaction.reply({
                content: '❌ Bots não podem usar este comando.',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('usuario');

        // Verifica se o usuário tem permissão de "Gerenciar Mensagens" (ou outra permissão que você defina)
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (!member.permissions.has('MANAGE_MESSAGES')) {  // 'MANAGE_MESSAGES' é a permissão de gerenciar mensagens
            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando. Somente membros com poderes de suporte podem usar este comando.',
                ephemeral: true,
            });
        }

        // Cria a embed para a chamada
        const chamadaEmbed = new EmbedBuilder()
            .setColor('#FF4500')  // Cor de laranja forte para mais destaque
            .setTitle('📢 Chamada de Suporte')
            .setDescription(`🚨 **Chamada de Suporte**: O usuário **${user.tag}** está precisando de ajuda. Por favor, um membro do suporte entre em contato com ele o mais rápido possível.`)
            .addFields(
                { name: '🧑‍💻 Usuário Chamado:', value: `${user.tag} (${user.id})`, inline: true },
                { name: '👤 Solicitado Por:', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: '⏰ Data da Solicitação:', value: new Date().toLocaleString(), inline: false }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 })) // Adiciona a imagem do avatar do usuário chamado
            .setTimestamp()
            .setFooter({ text: 'Chamada realizada no servidor.', iconURL: interaction.user.displayAvatarURL() });

        // Envia a chamada no canal de suporte (exemplo '📞・suporte')
        const suporteChannel = interaction.guild.channels.cache.find(ch => ch.name === '📞・suporte');
        if (suporteChannel) {
            await suporteChannel.send({
                content: `⚠️ **Atenção!** A chamada foi feita para o usuário **${user.tag}**, por favor, um membro da equipe de suporte entre em contato com ele imediatamente! <@${user.id}>`,
                embeds: [chamadaEmbed],
            });

            // Envia a chamada de suporte diretamente para o usuário via DM
            try {
                await user.send({
                    content: `🚨 **Chamada de Suporte**: Você foi chamado para suporte por **${interaction.user.tag}**. Por favor, aguarde o atendimento.`,
                    embeds: [chamadaEmbed],
                });
            } catch (error) {
                console.error('Não foi possível enviar a DM para o usuário:', error);
                await interaction.reply({
                    content: `❌ Não consegui enviar a DM para o usuário **${user.tag}**. O usuário pode ter DMs desativadas.`,
                    ephemeral: true,
                });
            }

            // Confirmação para o usuário que fez a chamada
            await interaction.reply({
                content: `✅ A chamada de suporte para o usuário **${user.tag}** foi feita com sucesso!`,
                ephemeral: true,
            });
        } else {
            return interaction.reply({
                content: '❌ Não foi possível encontrar o canal de suporte. Certifique-se de que o canal "📞・suporte" existe.',
                ephemeral: true,
            });
        }
    },
};
