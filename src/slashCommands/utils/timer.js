const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Configura um temporizador com contagem regressiva.')
        .addIntegerOption(option =>
            option
                .setName('tempo')
                .setDescription('Duração do temporizador.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('unidade')
                .setDescription('Unidade de tempo (segundos ou minutos).')
                .setRequired(true)
                .addChoices(
                    { name: 'Segundos', value: 'segundos' },
                    { name: 'Minutos', value: 'minutos' }
                )
        ),

    async execute(interaction) {
        const tempo = interaction.options.getInteger('tempo');
        const unidade = interaction.options.getString('unidade');

        // Converte o tempo para segundos, se necessário
        const tempoEmSegundos = unidade === 'minutos' ? tempo * 60 : tempo;

        let restante = tempoEmSegundos;

        // Cria o embed inicial do temporizador
        const embed = new EmbedBuilder()
            .setColor('#007bff') // Azul para indicar que o temporizador foi iniciado
            .setTitle('⏳ Temporizador em Andamento!')
            .setDescription(
                `O temporizador foi configurado para **${tempo} ${unidade}**.\nTempo restante: **${restante} segundos**.`
            )
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Envia o embed inicial
        const reply = await interaction.reply({ embeds: [embed], fetchReply: true });

        // Atualiza o embed a cada segundo
        const interval = setInterval(async () => {
            restante--;

            if (restante <= 0) {
                clearInterval(interval);

                // Cria o embed de conclusão do temporizador
                const endEmbed = new EmbedBuilder()
                    .setColor('#28a745') // Verde para indicar que o temporizador terminou
                    .setTitle('⏰ Temporizador Concluído!')
                    .setDescription(
                        `O tempo de **${tempo} ${unidade}** terminou!`
                    )
                    .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                // Envia o embed final
                return interaction.followUp({ embeds: [endEmbed] });
            }

            // Atualiza o embed com o tempo restante
            embed.setDescription(
                `O temporizador foi configurado para **${tempo} ${unidade}**.\nTempo restante: **${restante} segundos**.`
            );

            // Edita o embed na mensagem original
            await reply.edit({ embeds: [embed] });
        }, 1000);
    },
};
