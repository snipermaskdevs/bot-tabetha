const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banir um usuário e registrar a razão no log.')
        .addUserOption(option =>
            option
                .setName('usuário')
                .setDescription('Usuário a ser banido')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motivo')
                .setDescription('Motivo do banimento')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Permissão de banir membros

    async execute(interaction) {
        const user = interaction.options.getUser('usuário');
        const motivo = interaction.options.getString('motivo');
        const member = await interaction.guild.members.fetch(user.id);

        // Criando o Embed para resposta de sucesso
        const successEmbed = new EmbedBuilder()
            .setColor('#FF0000') // Cor vermelha para banimento
            .setTitle('⚠️ Banimento Executado!')
            .setDescription(`O usuário **${user.tag}** foi banido do servidor.`)
            .addFields(
                { name: 'Motivo', value: motivo, inline: false },
                { name: 'Banido por', value: interaction.user.tag, inline: false },
            )
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Criando o Embed para erro (caso o banimento falhe)
        const errorEmbed = new EmbedBuilder()
            .setColor('#dc3545') // Cor vermelha para erro
            .setTitle('❌ Erro ao Banir')
            .setDescription('Não foi possível banir o usuário. Verifique as permissões ou tente novamente mais tarde.')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        try {
            // Banindo o membro
            await member.ban({ reason: motivo });

            // Resposta de sucesso
            await interaction.reply({ embeds: [successEmbed] });

            // Log do banimento (primeiro canal)
const logChannel1 = message.guild.channels.cache.find(c => c.name === '🚨・punição'); // Canal principal de punições
if (logChannel1) {
    const logEmbed1 = new EmbedBuilder()
        .setColor('#007bff') // Cor azul para log
        .setTitle('📜 Banimento Registrado - Punição')
        .addFields(
            { name: 'Usuário Banido', value: user.tag, inline: true },
            { name: 'Motivo', value: motivo, inline: true },
            { name: 'Banido por', value: message.author.tag, inline: true },
            { name: 'Data', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        )
        .setTimestamp();

    await logChannel1.send({ embeds: [logEmbed1] });
} else {
    console.warn('Canal "🚨・punição" não encontrado.');
}

// Log do banimento (segundo canal)
const logChannel2 = message.guild.channels.cache.find(c => c.name === '📋・logs-gerais'); // Canal adicional
if (logChannel2) {
    const logEmbed2 = new EmbedBuilder()
        .setColor('#00FF00') // Cor verde para diferenciar o log adicional
        .setTitle('📜 Registro Geral - Banimento')
        .addFields(
            { name: 'Usuário Banido', value: user.tag, inline: true },
            { name: 'Motivo', value: motivo, inline: true },
            { name: 'Banido por', value: message.author.tag, inline: true },
            { name: 'Data', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        )
        .setTimestamp();

    await logChannel2.send({ embeds: [logEmbed2] });
} else {
    console.warn('Canal "📋・logs-gerais" não encontrado.');
}
        } catch (error) {
            console.error('Erro ao banir usuário:', error);
            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};
