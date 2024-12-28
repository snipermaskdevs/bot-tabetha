const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Exibe a lista de usuários banidos do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        try {
            const bans = await interaction.guild.bans.fetch();

            if (bans.size === 0) {
                return interaction.reply(`✅ Nenhum usuário está banido neste servidor.`);
            }

            const embed = new EmbedBuilder()
                .setColor('#FF0000') // Vermelho para indicar bans
                .setTitle('🔨 Lista de Usuários Banidos')
                .setDescription(
                    bans
                        .map(ban => `**Usuário:** ${ban.user.tag}\n**ID:** ${ban.user.id}`)
                        .join('\n\n')
                )
                .setFooter({
                    text: `Total de usuários banidos: ${bans.size}`,
                    iconURL: interaction.guild.iconURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Não foi possível obter a lista de usuários banidos.',
                ephemeral: true,
            });
        }
    },
};
