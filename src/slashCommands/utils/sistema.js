// DiscordJS - Funções
const Discord = require("discord.js");

// Slash Command - Builder
const { SlashCommandBuilder } = require("@discordjs/builders");

// OS - Sistema
const os = require("os");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sistema")
        .setDescription("Informações do Sistema"),

    async execute(interaction, client) {

        // OS - SISTEMA
        const arquiteturaCpuOs = os.arch();
        const modeloCpu = os.cpus()[0].model;
        const tipoOs = os.type();

        // OS - RAM
        const ramTotalOs = formatarMemoria(os.totalmem()).valor + formatarMemoria(os.totalmem()).unidade;
        const ramUsadaOs = formatarMemoria(os.totalmem() - os.freemem()).valor + formatarMemoria(os.totalmem() - os.freemem()).unidade;

        await interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`Informações do Sistema`)
                .addFields(
                    { name: `🪟 | Sistema Operacional:`, value: `${tipoOs}` },
                    { name: `💻 | CPU:`, value: `${modeloCpu}` },
                    { name: `🏛️ | Arquitetura da CPU:`, value: `${arquiteturaCpuOs}` },
                    { name: `💾 | Memória RAM:`, value: `${ramUsadaOs}/${ramTotalOs}` }
                )
                .setColor(`#212121`)
            ],
            ephemeral: true
        });

        // Função - Formatar RAM
        function formatarMemoria(memoria) {
            let valor, unidade;
            if (memoria >= 1024 * 1024 * 1024) {
                valor = (memoria / (1024 * 1024 * 1024)).toFixed(2);
                unidade = 'GB';
            } else {
                valor = (memoria / (1024 * 1024)).toFixed(2);
                unidade = 'MB';
            };
            return { valor, unidade };
        };

    }
}
