const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearroles')
        .setDescription('Limpa todos os cargos de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário a ter os cargos removidos')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const member = await interaction.guild.members.fetch(user.id);

        // Verifica se o usuário possui permissão para usar este comando (somente administradores ou moderadores)
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        if (member) {
            const roles = member.roles.cache.filter(role => role.name !== '@everyone');
            
            // Verifica se o usuário tem cargos além do @everyone
            if (roles.size === 0) {
                return interaction.reply({ content: `${user.tag} não possui cargos para remover.`, ephemeral: true });
            }

            // Remove os cargos do usuário
            await member.roles.remove(roles);
            await interaction.reply({ content: `${user.tag} teve todos os seus cargos removidos.`, ephemeral: true });

            // Enviar o log para o canal "geral" ou "logs"
            const channelName = '🪂⠂logs'; // Nome do canal de logs
            const logChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

            if (logChannel && logChannel.isText()) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#FF0000') // Cor vermelha para logs de ação
                    .setTitle('🧹 Remoção de Cargos')
                    .addFields(
                        { name: 'Usuário', value: user.tag, inline: true },
                        { name: 'Cargos Removidos', value: roles.size.toString(), inline: true },
                        { name: 'Executor', value: interaction.user.tag, inline: true },
                        { name: 'Data da Ação', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                    )
                    .setTimestamp();

                // Envia o log para o canal de logs
                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.warn('Canal de logs não encontrado ou não é um canal de texto.');
            }
        } else {
            await interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
        }
    },
};
