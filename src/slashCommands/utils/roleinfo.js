const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Obter informações sobre um cargo.')
    .addRoleOption(option => option
        .setName('cargo')
        .setDescription('Cargo para obter informações')
        .setRequired(true)),
    execute: async function (interaction) {
        const role = interaction.options.getRole('cargo');

        const perms = {
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
            timeoutMembers: 'Timeout Membros',
		};

        const color = role.color ? ('00000' + role.color.toString(16)).slice(-6) : null;

        const embed = {
			fields: [
				{ name: 'ID', value: role.id, inline: true },
				{ name: 'Nome', value: role.name, inline: true },
				{ name: 'Cor', value: color ? `#${color}` : 'Nenhuma', inline: true },
				{ name: 'Menção', value: `\`<@&${role.id}>\``, inline: true },
				{ name: 'Destacado', value: role.hoist ? 'Sim' : 'Não', inline: true },
				{ name: 'Posição', value: role.position.toString(), inline: true },
				{ name: 'Menção Permitida', value: role.mentionable ? 'Sim' : 'Não', inline: true },
			],
			footer: {
				text: `Cargo Criado`,
			},
			timestamp: new Date(role.createdAt),
		};

        if (color) {
            embed.color = role.color;
        }

        if (role.permissions) {
            let infoPerms = []
			if (role.permissions.has(PermissionFlagsBits.Administrator)) infoPerms.push(perms['administrator']);
            if (role.permissions.has(PermissionFlagsBits.ManageGuild)) infoPerms.push(perms['manageGuild'])
            if (role.permissions.has(PermissionFlagsBits.ManageRoles)) infoPerms.push(perms['manageRoles'])
            if (role.permissions.has(PermissionFlagsBits.ManageChannels)) infoPerms.push(perms['manageChannels'])
            if (role.permissions.has(PermissionFlagsBits.ManageMessages)) infoPerms.push(perms['manageMessages'])
            if (role.permissions.has(PermissionFlagsBits.ManageWebhooks)) infoPerms.push(perms['manageWebhooks'])
            if (role.permissions.has(PermissionFlagsBits.ManageNicknames)) infoPerms.push(perms['manageNicknames'])
            if (role.permissions.has(PermissionFlagsBits.KickMembers)) infoPerms.push(perms['kickMembers'])
            if (role.permissions.has(PermissionFlagsBits.BanMembers)) infoPerms.push(perms['banMembers'])
            if (role.permissions.has(PermissionFlagsBits.MentionEveryone)) infoPerms.push(perms['mentionEveryone'])
            if (role.permissions.has(PermissionFlagsBits.ModerateMembers)) infoPerms.push(perms['timeoutMembers'])

			if (infoPerms.length) {
				embed.fields.push({ name: 'Permissões Principais', value: infoPerms.join(', '), inline: false });
			}
		}

        interaction.reply({ embeds: [embed] });
    }
}