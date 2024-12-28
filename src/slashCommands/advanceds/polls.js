const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('polls')
        .setDescription('Cria uma enquete simples com Sim ou Não.')
        .addStringOption(option =>
            option
                .setName('pergunta')
                .setDescription('A pergunta da enquete.')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Verificando se o usuário tem permissão de administrador
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: '🚫 Você precisa ser um administrador para usar esse comando.',
                ephemeral: true, // Resposta temporária
            });
        }

        const pergunta = interaction.options.getString('pergunta');

        // Criando o Embed mais bonito
        const pollEmbed = new EmbedBuilder()
            .setColor('#00AE86') // Cor verde para representar ação positiva
            .setTitle(`🗳️ Enquete: ${pergunta}`)
            .setDescription('Reaja com ✅ para **Sim** ou ❌ para **Não**.')
            .setFooter({
                text: `Criada por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(), // Avatar do usuário que criou a enquete
            })
            .setTimestamp()
            .setThumbnail('https://example.com/icone_enquete.png'); // Aqui você pode adicionar um ícone de enquete (se preferir)

        // Enviando a mensagem com o embed
        const sentMessage = await interaction.reply({
            content: 'Enquete criada! Reaja para votar.',
            embeds: [pollEmbed],
            fetchReply: true,
        });

        // Reagindo com as opções Sim ou Não
        await sentMessage.react('✅');
        await sentMessage.react('❌');
    },
};
