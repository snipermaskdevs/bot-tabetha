const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearrole')
        .setDescription('Remove um cargo de todos os membros')
        .addRoleOption(option =>
            option.setName('cargo')
                .setDescription('Cargo a ser removido')
                .setRequired(true)),

    async execute(interaction) {
        // Verificar se o usuário é um administrador
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        const role = interaction.options.getRole('cargo');
        
        // Filtra os membros que possuem o cargo
        const membersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));
        
        // Se não houver membros com o cargo, envia uma mensagem informando
        if (membersWithRole.size === 0) {
            return interaction.reply({ content: `Nenhum membro possui o cargo ${role.name}.`, ephemeral: true });
        }

        let removedCount = 0;

        // Usa 'for...of' para garantir que as promessas de remoção sejam resolvidas antes de continuar
        for (const member of membersWithRole.values()) {
            try {
                await member.roles.remove(role);
                removedCount++;
            } catch (error) {
                console.error(`Erro ao remover cargo de ${member.user.tag}:`, error);
            }
        }

        await interaction.reply({
            content: `O cargo ${role.name} foi removido de ${removedCount} ${removedCount > 1 ? 'membros' : 'membro'}.`,
            ephemeral: true
        });

        // Enviar o log para o canal "geral" ou "logs"
        const channelName = '🪂⠂logs'; // Nome do canal de logs
        const logChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

        if (logChannel && logChannel.isText()) {
            const logEmbed = new EmbedBuilder()
                .setColor('#FF0000') // Cor vermelha para logs de ação
                .setTitle('🧹 Remoção de Cargo')
                .addFields(
                    { name: 'Usuário', value: interaction.user.tag, inline: true },
                    { name: 'Cargo', value: role.name, inline: true },
                    { name: 'Membros Afetados', value: removedCount.toString(), inline: true },
                    { name: 'Data da Ação', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();

            // Envia o log para o canal de logs
            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.warn('Canal de logs não encontrado ou não é um canal de texto.');
        }
    },
};
