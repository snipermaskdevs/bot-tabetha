const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Exibe informações sobre o servidor de suporte do bot.'),

    async execute(interaction) {
        const supportServerLink = 'https://discord.gg/JHakhkXahT'; // Substitua pelo link de suporte real

        // Criando o embed para exibir informações de suporte
        const embed = new EmbedBuilder()
            .setColor('#5865F2') // Cor do embed (cor do Discord)
            .setTitle('📞 Suporte ao Bot')
            .setDescription(
                `Se você tiver alguma dúvida ou precisar de ajuda, nosso **servidor de suporte** está disponível para te ajudar!`
            )
            .addFields(
                { name: 'Link do Servidor de Suporte:', value: `[Clique aqui para entrar](<${supportServerLink}>)` }
            )
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Envia o embed com o link de suporte
        await interaction.reply({ embeds: [embed] });
    },
};
