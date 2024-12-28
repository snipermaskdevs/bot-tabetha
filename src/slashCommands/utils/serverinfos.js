const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfos')
    .setDescription('Mostra algumas informações do servidor'),
    async execute(interaction) {
 
        const { guild } = interaction;
        const { members } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        const joinedAt = interaction.member.joinedAt;
 
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
        .setFooter({ text: `ID do servidor: ${id}`, iconURL: icon})
        .setTimestamp()
        .addFields({ name: "Nome", value: `${name}`, inline: false})
        .addFields({ name: "Data de Criação", value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`, inline: true})
        .addFields({ name: "Entrou", value: `<t:${parseInt(joinedAt / 1000)}:R>`, inline: true})
        .addFields({ name: "Dono do Servidor", value: `<@${ownerId}>`, inline: true})
        .addFields({ name: "Membros", value: `${memberCount}`, inline: true})
        .addFields({ name: "Cargos", value: `${roles}`, inline: true})
        .addFields({ name: "Emojis", value: `${emojis}`, inline: true})
        .addFields({ name: "Nível de Verificação", value: `${baseVerification}`, inline: true})
        .addFields({ name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true})
 
        await interaction.reply({ embeds: [embed] });
    }
}