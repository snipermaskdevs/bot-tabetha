const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Gera um link de convite para o bot.'),

    async execute(interaction) {
        const inviteLink = 'https://discord.com/oauth2/authorize?client_id=1314503759560183889&permissions=8&integration_type=0&scope=applications.commands+bot';

        // Criando o Embed com informações bonitas
        const inviteEmbed = new EmbedBuilder()
            .setColor('#7289DA') // Cor padrão do Discord
            .setTitle('📩 Convite do Bot')
            .setDescription(`Clique no link abaixo para adicionar o bot ao seu servidor:`)
            .addFields({
                name: 'Convite para o Bot',
                value: `[Clique aqui para adicionar o bot ao seu servidor](${inviteLink})`
            })
            .setFooter({
                text: `Solicitado por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        // Envia a mensagem com o embed
        await interaction.reply({ embeds: [inviteEmbed] });
    },
};
