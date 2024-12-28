const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-moderations')
        .setDescription('Configura logs para ações de moderação.')
        .addChannelOption(option =>
            option
                .setName('logchannel')
                .setDescription('Canal para registrar ações de moderação.')
                .setRequired(true)  // Corrigido aqui para 'setRequired'
        ),

    async execute(interaction) {
        const logChannel = interaction.options.getChannel('logchannel');

        // Evento para registrar quando um membro entra no servidor
interaction.client.on('guildMemberAdd', (member) => {
    const embed = new EmbedBuilder()
        .setTitle('🎉 Membro Entrou')
        .setDescription(`${member.user.tag} entrou no servidor.`)
        .addFields(
            { name: 'Membro', value: member.user.tag, inline: true },
            { name: 'ID do Membro', value: member.user.id, inline: true },
            { name: 'Data de Entrada', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('00ff00')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando um membro sai do servidor
interaction.client.on('guildMemberRemove', (member) => {
    const embed = new EmbedBuilder()
        .setTitle('👋 Membro Saiu')
        .setDescription(`${member.user.tag} saiu do servidor.`)
        .addFields(
            { name: 'Membro', value: member.user.tag, inline: true },
            { name: 'ID do Membro', value: member.user.id, inline: true },
            { name: 'Data de Saída', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ff0000')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});


        // Evento para registrar quando um membro for banido
        interaction.client.on('guildMemberBanAdd', (guild, user) => {
            const embed = new EmbedBuilder()
                .setTitle('🚫 Membro Banido')
                .setDescription(`${user.tag} foi banido do servidor.`)
                .addFields(
                    { name: 'Membro', value: user.tag, inline: true },
                    { name: 'ID do Membro', value: user.id, inline: true },
                    { name: 'Data de Banimento', value: new Date().toLocaleString(), inline: false }
                )
                .setColor('ff0000')
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        // Evento para registrar quando um membro é desbanido
interaction.client.on('guildBanRemove', (guild, user) => {
    const embed = new EmbedBuilder()
        .setTitle('✅ Membro Desbanido')
        .setDescription(`${user.tag} foi desbanido do servidor.`)
        .addFields(
            { name: 'Membro', value: user.tag, inline: true },
            { name: 'ID do Membro', value: user.id, inline: true },
            { name: 'Data de Desbanimento', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('00ff00')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

        // Evento para registrar quando um membro for expulso
        interaction.client.on('guildMemberKick', (guild, member) => {
            const embed = new EmbedBuilder()
                .setTitle('👢 Membro Expulso')
                .setDescription(`${member.user.tag} foi expulso do servidor.`)
                .addFields(
                    { name: 'Membro', value: member.user.tag, inline: true },
                    { name: 'ID do Membro', value: member.user.id, inline: true },
                    { name: 'Data de Expulsão', value: new Date().toLocaleString(), inline: false }
                )
                .setColor('ff9b00')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        // Evento para registrar quando um membro for desmutado
        interaction.client.on('guildMemberUpdate', (oldMember, newMember) => {
            if (!oldMember.voice.serverMute && newMember.voice.serverMute) {
                const embed = new EmbedBuilder()
                    .setTitle('🔇 Membro Mutado')
                    .setDescription(`${newMember.user.tag} foi mutado no servidor.`)
                    .addFields(
                        { name: 'Membro', value: newMember.user.tag, inline: true },
                        { name: 'ID do Membro', value: newMember.user.id, inline: true },
                        { name: 'Data de Mutação', value: new Date().toLocaleString(), inline: false }
                    )
                    .setColor('bfbfbf')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            }

            // Evento para quando o membro for desmutado
            if (oldMember.voice.serverMute && !newMember.voice.serverMute) {
                const embed = new EmbedBuilder()
                    .setTitle('🔊 Membro Desmutado')
                    .setDescription(`${newMember.user.tag} foi desmutado no servidor.`)
                    .addFields(
                        { name: 'Membro', value: newMember.user.tag, inline: true },
                        { name: 'ID do Membro', value: newMember.user.id, inline: true },
                        { name: 'Data de Desmutação', value: new Date().toLocaleString(), inline: false }
                    )
                    .setColor('5dff00')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            }
        });

        // Evento para registrar quando um canal é criado
interaction.client.on('channelCreate', (channel) => {
    const embed = new EmbedBuilder()
        .setTitle('🛠 Canal Criado')
        .setDescription(`O canal **${channel.name}** foi criado.`)
        .addFields(
            { name: 'Canal', value: channel.name, inline: true },
            { name: 'ID do Canal', value: channel.id, inline: true },
            { name: 'Tipo do Canal', value: channel.type, inline: false },
            { name: 'Data de Criação', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('0066ff')
        .setThumbnail(channel.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando um canal é excluído
interaction.client.on('channelDelete', (channel) => {
    const embed = new EmbedBuilder()
        .setTitle('🗑 Canal Excluído')
        .setDescription(`O canal **${channel.name}** foi excluído.`)
        .addFields(
            { name: 'Canal', value: channel.name, inline: true },
            { name: 'ID do Canal', value: channel.id, inline: true },
            { name: 'Tipo do Canal', value: channel.type, inline: false },
            { name: 'Data de Exclusão', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ff0000')
        .setThumbnail(channel.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando um emoji é adicionado
interaction.client.on('emojiCreate', (emoji) => {
    const embed = new EmbedBuilder()
        .setTitle('😀 Emoji Criado')
        .setDescription(`O emoji **:${emoji.name}:** foi adicionado ao servidor.`)
        .addFields(
            { name: 'Emoji', value: `:${emoji.name}:`, inline: true },
            { name: 'ID do Emoji', value: emoji.id, inline: true },
            { name: 'Data de Criação', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('00ff00')
        .setThumbnail(emoji.url)
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando uma reação é adicionada a uma mensagem
interaction.client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;  // Ignora reações de bots

    const embed = new EmbedBuilder()
        .setTitle('👍 Reação Adicionada')
        .setDescription(`${user.tag} adicionou uma reação à mensagem.`)
        .addFields(
            { name: 'Membro', value: user.tag, inline: true },
            { name: 'ID do Membro', value: user.id, inline: true },
            { name: 'Emoji', value: reaction.emoji.name, inline: false },
            { name: 'Mensagem', value: reaction.message.content || '[Sem Conteúdo]', inline: false },
            { name: 'Data da Reação', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ffcc00')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando uma reação é removida de uma mensagem
interaction.client.on('messageReactionRemove', (reaction, user) => {
    if (user.bot) return;  // Ignora reações de bots

    const embed = new EmbedBuilder()
        .setTitle('👎 Reação Removida')
        .setDescription(`${user.tag} removeu uma reação da mensagem.`)
        .addFields(
            { name: 'Membro', value: user.tag, inline: true },
            { name: 'ID do Membro', value: user.id, inline: true },
            { name: 'Emoji', value: reaction.emoji.name, inline: false },
            { name: 'Mensagem', value: reaction.message.content || '[Sem Conteúdo]', inline: false },
            { name: 'Data da Remoção', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ff4444')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando um emoji é removido
interaction.client.on('emojiDelete', (emoji) => {
    const embed = new EmbedBuilder()
        .setTitle('❌ Emoji Removido')
        .setDescription(`O emoji **:${emoji.name}:** foi removido do servidor.`)
        .addFields(
            { name: 'Emoji', value: `:${emoji.name}:`, inline: true },
            { name: 'ID do Emoji', value: emoji.id, inline: true },
            { name: 'Data de Remoção', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ff0000')
        .setThumbnail(emoji.url)
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando o servidor é alterado
interaction.client.on('guildUpdate', (oldGuild, newGuild) => {
    const embed = new EmbedBuilder()
        .setTitle('🔧 Servidor Alterado')
        .setDescription(`O servidor **${newGuild.name}** foi alterado.`)
        .addFields(
            { name: 'Nome do Servidor', value: newGuild.name, inline: true },
            { name: 'ID do Servidor', value: newGuild.id, inline: true },
            { name: 'Alteração', value: 'Mudanças no servidor (ex: nome, região)', inline: false },
            { name: 'Data da Alteração', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ff6600')
        .setThumbnail(newGuild.iconURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando um webhook é criado ou atualizado
interaction.client.on('webhookUpdate', (channel) => {
    const embed = new EmbedBuilder()
        .setTitle('🔧 Webhook Atualizado')
        .setDescription(`O webhook do canal **${channel.name}** foi atualizado ou criado.`)
        .addFields(
            { name: 'Canal', value: channel.name, inline: true },
            { name: 'ID do Canal', value: channel.id, inline: true },
            { name: 'Data da Atualização', value: new Date().toLocaleString(), inline: false }
        )
        .setColor('ffa500')
        .setThumbnail(channel.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

// Evento para registrar quando um membro faz uma denúncia
interaction.client.on('messageCreate', (message) => {
    if (message.content.startsWith('!denunciar')) {
        const mentionedUser = message.mentions.users.first();
        if (mentionedUser) {
            const embed = new EmbedBuilder()
                .setTitle('🚨 Denúncia Registrada')
                .setDescription(`**${message.author.tag}** fez uma denúncia contra **${mentionedUser.tag}**.`)
                .addFields(
                    { name: 'Membro Denunciante', value: message.author.tag, inline: true },
                    { name: 'Membro Denunciado', value: mentionedUser.tag, inline: true },
                    { name: 'ID do Membro Denunciante', value: message.author.id, inline: true },
                    { name: 'ID do Membro Denunciado', value: mentionedUser.id, inline: true },
                    { name: 'Data da Denúncia', value: new Date().toLocaleString(), inline: false }
                )
                .setColor('f44336')
                .setThumbnail(mentionedUser.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
});


        // Evento para registrar quando um membro mudar de nome
interaction.client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.displayName !== newMember.displayName) {
        const embed = new EmbedBuilder()
            .setTitle('✏️ Nome Alterado')
            .setDescription(`${oldMember.user.tag} alterou o nome para **${newMember.displayName}**.`)
            .addFields(
                { name: 'Membro', value: newMember.user.tag, inline: true },
                { name: 'ID do Membro', value: newMember.user.id, inline: true },
                { name: 'Nome Antigo', value: oldMember.displayName, inline: false },
                { name: 'Nome Novo', value: newMember.displayName, inline: false },
                { name: 'Data da Mudança', value: new Date().toLocaleString(), inline: false }
            )
            .setColor('00b3b3')
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

        // Evento para registrar quando um cargo for atribuído
        interaction.client.on('guildMemberUpdate', (oldMember, newMember) => {
            const addedRoles = newMember.roles.cache.difference(oldMember.roles.cache);
            if (addedRoles.size > 0) {
                addedRoles.forEach(role => {
                    const embed = new EmbedBuilder()
                        .setTitle('🎖 Cargo Atribuído')
                        .setDescription(`${newMember.user.tag} recebeu o cargo **${role.name}**.`)
                        .addFields(
                            { name: 'Membro', value: newMember.user.tag, inline: true },
                            { name: 'ID do Membro', value: newMember.user.id, inline: true },
                            { name: 'Cargo Atribuído', value: role.name, inline: false },
                            { name: 'Data da Atribuição', value: new Date().toLocaleString(), inline: false }
                        )
                        .setColor('003eff')
                        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    logChannel.send({ embeds: [embed] });
                });
            }
        });

        // Evento para registrar quando um cargo for removido
        interaction.client.on('guildMemberUpdate', (oldMember, newMember) => {
            const removedRoles = oldMember.roles.cache.difference(newMember.roles.cache);
            if (removedRoles.size > 0) {
                removedRoles.forEach(role => {
                    const embed = new EmbedBuilder()
                        .setTitle('❌ Cargo Removido')
                        .setDescription(`${newMember.user.tag} teve o cargo **${role.name}** removido.`)
                        .addFields(
                            { name: 'Membro', value: newMember.user.tag, inline: true },
                            { name: 'ID do Membro', value: newMember.user.id, inline: true },
                            { name: 'Cargo Removido', value: role.name, inline: false },
                            { name: 'Data da Remoção', value: new Date().toLocaleString(), inline: false }
                        )
                        .setColor('ff0000')
                        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    logChannel.send({ embeds: [embed] });
                });
            }
        });

        // Evento para registrar quando uma mensagem for excluída
        interaction.client.on('messageDelete', (message) => {
            const embed = new EmbedBuilder()
                .setTitle('🗑 Mensagem Excluída')
                .setDescription(`A mensagem de **${message.author.tag}** foi excluída.`)
                .addFields(
                    { name: 'Membro', value: message.author.tag, inline: true },
                    { name: 'ID do Membro', value: message.author.id, inline: true },
                    { name: 'Conteúdo da Mensagem', value: message.content || '[Sem Conteúdo]', inline: false },
                    { name: 'Data de Exclusão', value: new Date().toLocaleString(), inline: false }
                )
                .setColor('ae00ff')
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Ação executada por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        });

        await interaction.reply(`O canal **${logChannel}** foi configurado para registrar ações de moderação.`);
    },
};
