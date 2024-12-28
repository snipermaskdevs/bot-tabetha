const { SlashCommandBuilder, EmbedBuilder, ChannelType, escapeNumberedList } = require('discord.js');
 
var timeout = [];


module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Visualizar informações do servidor'),
    async execute(interaction) {

        const { guild } = interaction;
        const { members, stickers, role } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        const channels = interaction.guild.channels.cache.size;
        const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
        const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
        const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
        const annnouncement = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size;
        const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size;
        const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size;
        const thread = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size;
        const rolelist = guild.roles.cache.toJSON().join(' ');
        const botCount = members.cache.filter(member => member.user.bot).size;
        const vanity = guild.vanityURLCode || 'Sem vanity';
        const sticker = stickers.cache.size;
        const highestrole = interaction.guild.roles.highest;
        const animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size;
        const description = interaction.guild.description || 'Sem descrição';

        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "Nenhum";

        let baseVerification = guild.verificationLevel;
 
        if (baseVerification == 0) baseVerification = "Nenhum";
        if (baseVerification == 1) baseVerification = "Baixo";
        if (baseVerification == 2) baseVerification = "Médio";
        if (baseVerification == 3) baseVerification = "Alto";
        if (baseVerification == 4) baseVerification = "Muito Alto";
 
        const embed = new EmbedBuilder()
        .setColor("000cff")
        .setThumbnail(icon)
        .setAuthor({ name: name, iconURL: icon })
        .setDescription(`${description}`)
        .setFooter({ text: `ID do servidor: ${id}`})
        .setTimestamp()
        .addFields({ name: "» Data de Criação", value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`, inline: true})
        .addFields({ name: "» Dono do Servidor", value: `<@${ownerId}>`, inline: true})
        .addFields({ name: "» URL Vanity", value: `${vanity}`, inline: true})
        .addFields({ name: "» Contagem de Membros", value: `${memberCount - botCount}`, inline: true})
        .addFields({ name: "» Contagem de Bots", value: `${botCount}`, inline: true})
        .addFields({ name: "» Contagem de Emojis", value: `${emojis}`, inline: true})
        .addFields({ name: "» Emojis Animados", value: `${animated}`, inline: true})
        .addFields({ name: "» Contagem de Stickers", value: `${sticker}`, inline: true})
        .addFields({ name: `» Contagem de Cargos`, value: `${roles}`, inline: true})
        .addFields({ name: `» Maior Cargo`, value: `${highestrole}`, inline: true})
        .addFields({ name: "» Nível de Verificação", value: `${baseVerification}`, inline: true})
        .addFields({ name: "» Contagem de Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true})
        .addFields({ name: "» Canais", value: `Total: ${channels} | 📍 ${category} | 💬 ${text} | 🔊 ${voice} | 📢 ${annnouncement} | 🎭 ${stage} |  ${forum} | 📜 ${thread}`, inline: false})
        .addFields({ name: `» Funcionalidades`, value: `\`\`\`${features}\`\`\``});

        await interaction.reply({ embeds: [embed] });

    }
}