const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Obtenha informações sobre o usuário')
        .addUserOption(o => o
            .setName('membro')
            .setDescription('Usuário para obter informações')
            .setRequired(false)),
    execute: async function(interaction, client) {
        let membro = interaction.options.getMember('membro') || interaction.member;

        if (!membro) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> Não consegui encontrar o usuário ${membro}`)], ephemeral: true });

        const permissões = {
            administrator: 'Administrador',
            manageGuild: 'Gerenciar Servidor',
            manageRoles: 'Gerenciar Cargos',
            manageChannels: 'Gerenciar Canais',
            manageMessages: 'Gerenciar Mensagens',
            manageWebhooks: 'Gerenciar Webhooks',
            manageNicknames: 'Gerenciar Apelidos',
            manageEmojis: 'Gerenciar Emojis',
            kickMembers: 'Expulsar Membros',
            banMembers: 'Banir Membros',
            mentionEveryone: 'Mencionar Todos',
            timeoutMembers: 'Timeout de Membros',
        };

        const extra = [];
        let equipe = [];

        const cargos = membro.roles.cache.map(r => {
                if (r.id === interaction.guild.id) {
                    return '';
                }

                return `<@&${r.id}>`;
            }).join('  ') || 'Nenhum';

        const embed = {
            color: 0x337fd5,
            author: {
                name: membro.user.tag,
                icon_url: membro.user.displayAvatarURL(),
            },
            thumbnail: {
                url: membro.user.displayAvatarURL()
            },
            description: `\n<@!${membro.id}>`,
            fields: [
                // { name: 'Status', value: membro.status, inline: true },
                { name: 'Entrou', value: moment.unix(membro.joinedAt / 1000).format('llll'), inline: true },
                { name: 'Registrado', value: moment.unix(membro.user.createdAt / 1000).format('llll'), inline: true },
                { name: `Cargos [${membro.roles.cache.size - 1}]`, value: cargos.length > 1024 ? `Muitos cargos para mostrar.` : cargos, inline: false },
            ],
            footer: { text: `ID: ${membro.id}` },
            timestamp: new Date(),
        };

        if (membro.permissions) {
            let infoPerms = []
            if (membro.permissions.has(PermissionFlagsBits.Administrator)) infoPerms.push(permissões['administrator']);
            if (membro.permissions.has(PermissionFlagsBits.ManageGuild)) infoPerms.push(permissões['manageGuild'])
            if (membro.permissions.has(PermissionFlagsBits.ManageRoles)) infoPerms.push(permissões['manageRoles'])
            if (membro.permissions.has(PermissionFlagsBits.ManageChannels)) infoPerms.push(permissões['manageChannels'])
            if (membro.permissions.has(PermissionFlagsBits.ManageMessages)) infoPerms.push(permissões['manageMessages'])
            if (membro.permissions.has(PermissionFlagsBits.ManageWebhooks)) infoPerms.push(permissões['manageWebhooks'])
            if (membro.permissions.has(PermissionFlagsBits.ManageNicknames)) infoPerms.push(permissões['manageNicknames'])
            if (membro.permissions.has(PermissionFlagsBits.KickMembers)) infoPerms.push(permissões['kickMembers'])
            if (membro.permissions.has(PermissionFlagsBits.BanMembers)) infoPerms.push(permissões['banMembers'])
            if (membro.permissions.has(PermissionFlagsBits.MentionEveryone)) infoPerms.push(permissões['mentionEveryone'])
            if (membro.permissions.has(PermissionFlagsBits.ModerateMembers)) infoPerms.push(permissões['timeoutMembers'])

            if (infoPerms.length) {
                embed.fields.push({ name: 'Permissões Importantes', value: infoPerms.join(', '), inline: false });
            }
        }

        if (membro.id === client.user.id) {
            equipe.push('A Real Dyno');
        }
        // if (this.isAdmin(membro)) extra.push(`Criador do Dyno`);
        
        if (membro.id === interaction.guild.ownerId) {
            extra.push(`Dono do Servidor`);
        } else if (membro.permissions.has(PermissionFlagsBits.Administrator)) {
            extra.push(`Administrador do Servidor`);
        } else if (membro.permissions.has(PermissionFlagsBits.ManageGuild)) {
            extra.push(`Gerente do Servidor`);
        } else if (membro.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            extra.push(`Moderador do Servidor`);
        }

        if (extra.length) {
            embed.fields.push({ name: 'Reconhecimentos', value: extra.join(', '), inline: false });
        }

        if (equipe.length) {
            embed.fields.push({ name: 'Equipe Dyno', value: `${equipe.join(', ')}`, inline: false });
        }

        interaction.reply({ embeds: [embed] })
    }
}