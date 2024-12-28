const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinvites')
        .setDescription('Gera um link de convite para o servidor.'),

    async execute(interaction) {
        try {
            // Criação do convite
            const invite = await interaction.guild.invites.create(interaction.channel.id, {
                maxAge: 0,       // Sem tempo de expiração
                maxUses: 0,      // Uso infinito
                unique: true,    // Gera um link único
            });

            // Criação da Embed
            const inviteEmbed = new EmbedBuilder()
                .setColor('#FF4500')  // Cor de destaque, pode ser ajustada
                .setTitle('📩 Convite Exclusivo para o Servidor')
                .setDescription('Aqui está o seu convite exclusivo para o servidor!')
                .addFields(
                    { name: '🔗 Link de Convite:', value: invite.url, inline: false },
                    { name: '🎉 Junte-se a nós!', value: 'Participe do nosso servidor e aproveite todos os recursos que preparamos!', inline: false },
                    { name: '👥 Membros no Servidor:', value: `${interaction.guild.memberCount} membros`, inline: true },
                    { name: '🌟 Status do Servidor:', value: interaction.guild.available ? 'Online' : 'Offline', inline: true },
                    { name: '🕒 Tempo de Criação:', value: new Date(interaction.guild.createdTimestamp).toLocaleDateString(), inline: true },
                )
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))  // Ícone do servidor
                .setImage('https://i.ibb.co/XCwqb20/convite.gif')  // Exemplo de imagem de fundo (opcional)
                .setTimestamp()  // Data e hora do convite
                .setFooter({ text: `Convite gerado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });  // Informações do usuário

            // Envia a embed com o link de convite
            await interaction.reply({
                embeds: [inviteEmbed],
            });
        } catch (error) {
            console.error('Erro ao gerar convite:', error);
            await interaction.reply({
                content: '❌ Ocorreu um erro ao tentar gerar o convite. Tente novamente mais tarde.',
                ephemeral: true,
            });
        }
    },
};
