const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('traduzir')
        .setDescription('Traduzir sua mensagem para outro idioma.')
        .addStringOption(
            option => option
                .setName('texto')
                .setDescription('Texto a ser traduzido')
                .setRequired(true)
        )
        .addStringOption(
            option => option
                .setName('de')
                .setDescription('Escolha um idioma de origem')
                .setRequired(true)
                .setChoices(
                    { name: 'Automático', value: 'auto' },
                    { name: 'Árabe', value: 'ar' },
                    { name: 'Bengali', value: 'bn' },
                    { name: 'Chinês Simplificado', value: 'zh-cn' },
                    { name: 'Dinamarquês', value: 'da' },
                    { name: 'Holandês', value: 'nl' },
                    { name: 'Inglês', value: 'en' },
                    { name: 'Filipino', value: 'tl' },
                    { name: 'Francês', value: 'fr' },
                    { name: 'Alemão', value: 'de' },
                    { name: 'Grego', value: 'el' },
                    { name: 'Hindi', value: 'hi' },
                    { name: 'Italiano', value: 'it' },
                    { name: 'Japonês', value: 'ja' },
                    { name: 'Polonês', value: 'pl' },
                    { name: 'Português', value: 'pt' },
                    { name: 'Russo', value: 'ru' },
                    { name: 'Espanhol', value: 'es' },
                    { name: 'Sueco', value: 'sv' },
                )
        )
        .addStringOption(
            option => option
                .setName('para')
                .setDescription('Escolha um idioma de destino')
                .setRequired(true)
                .setChoices(
                    { name: 'Automático', value: 'auto' },
                    { name: 'Árabe', value: 'ar' },
                    { name: 'Bengali', value: 'bn' },
                    { name: 'Chinês Simplificado', value: 'zh-cn' },
                    { name: 'Dinamarquês', value: 'da' },
                    { name: 'Holandês', value: 'nl' },
                    { name: 'Inglês', value: 'en' },
                    { name: 'Filipino', value: 'tl' },
                    { name: 'Francês', value: 'fr' },
                    { name: 'Alemão', value: 'de' },
                    { name: 'Grego', value: 'el' },
                    { name: 'Hindi', value: 'hi' },
                    { name: 'Italiano', value: 'it' },
                    { name: 'Japonês', value: 'ja' },
                    { name: 'Polonês', value: 'pl' },
                    { name: 'Português', value: 'pt' },
                    { name: 'Russo', value: 'ru' },
                    { name: 'Espanhol', value: 'es' },
                    { name: 'Sueco', value: 'sv' },
                )
        ),
    category: 'Texto',
    cooldown: 5000,

    async execute(interaction, client) {
        const msg = interaction.options.getString('texto');
        const from = interaction.options.getString('de');
        const to = interaction.options.getString('para');
        const translated = await translate(msg, { from: from, to: to });

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setFields(
                { name: 'Texto Inserido', value: msg },
                { name: 'Texto Traduzido', value: translated.text }
            )
            .setFooter({ text: 'Google Translate' })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};