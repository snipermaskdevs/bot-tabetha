const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Cria uma enquete com até 10 opções.')
        .addStringOption(option =>
            option
                .setName('pergunta')
                .setDescription('A pergunta da enquete.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('opcoes')
                .setDescription('Opções separadas por vírgulas (máximo: 10).')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Permissão para administradores

    async execute(interaction) {
        // Verificar se o usuário tem permissão de administrador
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Você precisa ter permissão de administrador para usar este comando.',
                ephemeral: true,
            });
        }

        const pergunta = interaction.options.getString('pergunta');
        const opcoes = interaction.options.getString('opcoes').split(',');

        if (opcoes.length > 10) {
            return interaction.reply({
                content: '❌ Você pode adicionar no máximo **10 opções**.',
                ephemeral: true,
            });
        }

        let descrição = '';
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        opcoes.forEach((opcao, index) => {
            descrição += `${emojis[index]} **${opcao.trim()}**\n`;
        });

        const embed = new EmbedBuilder()
            .setColor('#1F8B4C') // Verde-escuro para representar ação positiva
            .setTitle(`📊 Enquete: ${pergunta}`)
            .setDescription(descrição)
            .setFooter({
                text: `Criada por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        const mensagem = await interaction.reply({ embeds: [embed], fetchReply: true });

        for (let i = 0; i < opcoes.length; i++) {
            await mensagem.react(emojis[i]);
        }
    },
};
