const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('massban')
        .setDescription('Bane vários usuários de uma vez')
        .addStringOption(option =>
            option.setName('usuarios')
                .setDescription('IDs dos usuários a serem banidos (separados por vírgula)')
                .setRequired(true)),

    async execute(interaction) {
        // Verifica se o usuário tem permissão para banir membros
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'Você não tem permissão para banir membros.', ephemeral: true });
        }

        const channelName = '🪂⠂logs'; // Nome do canal de logs
        const logChannel = interaction.guild.channels.cache.find(c => c.name === channelName);
        const userIDs = interaction.options.getString('usuarios').split(',');

        const failedBans = [];
        const successBans = [];

        for (const userID of userIDs) {
            try {
                const user = await interaction.guild.members.fetch(userID.trim());
                
                // Verifica se o usuário pode ser banido (não bot, não é admin)
                if (user.user.bot) {
                    failedBans.push(`${user.tag} (Bot não pode ser banido)`);
                    continue;
                }

                if (user.permissions.has(PermissionFlagsBits.Administrator)) {
                    failedBans.push(`${user.tag} (Não pode banir administradores)`);
                    continue;
                }

                await user.ban({ reason: 'Banimento em massa' });
                successBans.push(`${user.tag}`);
            } catch (error) {
                failedBans.push(`${userID.trim()} (ID inválido ou não encontrado)`);
            }
        }

        // Mensagem de sucesso e falhas
        let replyMessage = 'Banimentos concluídos:\n\n';
        if (successBans.length > 0) {
            replyMessage += `🔨 Sucesso: ${successBans.join(', ')}\n\n`;
        }
        if (failedBans.length > 0) {
            replyMessage += `⚠️ Falhas: ${failedBans.join(', ')}`;
        }

        await interaction.reply({ content: replyMessage, ephemeral: true });

        // Enviar o log para o canal "geral" ou "logs"
        if (logChannel && logChannel.isText()) {
            const logEmbed = new EmbedBuilder()
                .setColor('#FF0000') // Cor vermelha para representar um banimento
                .setTitle('🔨 Ação de Banimento em Massa')
                .addFields(
                    { name: 'Solicitado por', value: interaction.user.tag, inline: true },
                    { name: 'Canal', value: interaction.channel.name, inline: true },
                    { name: 'Data', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                    { name: 'Sucesso', value: successBans.length > 0 ? successBans.join(', ') : 'Nenhum', inline: false },
                    { name: 'Falhas', value: failedBans.length > 0 ? failedBans.join(', ') : 'Nenhuma', inline: false }
                )
                .setTimestamp();

            // Envia o log para o canal de logs
            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.warn('Canal de logs não encontrado ou não é um canal de texto.');
        }
    },
};
