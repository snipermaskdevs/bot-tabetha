const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regras')
        .setDescription('Mostra as regras do servidor'),
    
    async execute(interaction) {
        // Cria um embed para as regras
        const embed = new EmbedBuilder()
            .setColor('#00FF00') // Cor verde para as regras
            .setTitle('📜 Regras do Servidor')
            .setDescription('Por favor, siga as regras abaixo para manter um ambiente agradável para todos!')
            .addFields(
                { name: '1 Respeito', value: 'Trate todos com respeito. Ofensas e ataques pessoais não serão tolerados.' },
                { name: '2 Sem Spam', value: 'Evite spam de mensagens, links ou promoções.' },
                { name: '3 Conteúdo Apropriado', value: 'Não compartilhe conteúdo NSFW, violento ou ilegal.' },
                { name: '4 Siga as Diretrizes do Discord', value: 'Todas as diretrizes da plataforma devem ser seguidas.' },
                { name: '5 Não Abuse das Funções', value: 'Use suas permissões de maneira responsável e não abuse delas.' },
                { name: '6 Canais Apropriados', value: 'Use os canais de acordo com seus propósitos.' },
                { name: '7 Mantenha a Privacidade', value: 'Respeite a privacidade dos outros. Não compartilhe informações pessoais.' },
                { name: '8 Proibido Trolling', value: 'Evite comportamentos que provoquem outros usuários intencionalmente.' },
                { name: '9 Proibido Flood', value: 'Não envie a mesma mensagem repetidamente.' },
                { name: '10 Discussões Construtivas', value: 'Debates são bem-vindos, mas mantenha um tom respeitoso.' },
                { name: '11 Evite Linguagem Ofensiva', value: 'Palavrões e insultos não são permitidos.' },
                { name: '12 Identidade do Membro', value: 'Não finja ser outro membro ou moderador.' },
                { name: '13 Relate Comportamentos Inadequados', value: 'Use os canais apropriados para reportar problemas.' },
                { name: '14 Proibido Compartilhar Conteúdo Roubado', value: 'Não compartilhe material protegido por direitos autorais sem permissão.' },
                { name: '15 Proibido Invasão de Privacidade', value: 'Não questione informações pessoais de outros membros.' },
                { name: '16 Use Nicknames Apropriados', value: 'Evite nicknames ofensivos ou inapropriados.' },
                { name: '17 Respeite os Moderadores', value: 'Siga as instruções dos moderadores e administradores.' },
                { name: '18 Proibido Ofensas Raciais ou Discriminatórias', value: 'Qualquer forma de discriminação será punida.' },
                { name: '19 Respeito à Decisão dos Moderadores', value: 'As decisões dos moderadores são finais.' },
                { name: '20 Mantenha o Canal Organizado', value: 'Evite desviar o foco dos tópicos do canal.' },
                { name: '21 Limite o Uso de Emojis e GIFs', value: 'Use emojis e GIFs com moderação para evitar poluição visual.' },
                { name: '22 Não Inicie Conflitos', value: 'Evite iniciar brigas ou discussões desnecessárias.' },
                { name: '23 Proteja o Bot e seus Recursos', value: 'Não abuse de bots ou sistemas automatizados.' },
                { name: '24 Proibido Publicidade Não Autorizada', value: 'Não faça publicidade de outros servidores sem permissão.' },
                { name: '25 Participação em Eventos', value: 'Participe de eventos e atividades do servidor.' }
            )
            .setFooter({ text: 'Obrigado por fazer parte da nossa comunidade!', iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Envia o embed com as regras para todos no canal
        await interaction.reply({ embeds: [embed] });

        // Enviar o log para o canal "geral" ou "logs"
        const channelName = '🪂⠂logs'; // Nome do canal de logs
        const logChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

        if (logChannel && logChannel.isText()) {
            const logEmbed = new EmbedBuilder()
                .setColor('#1E90FF') // Cor azul para log de regras
                .setTitle('📜 Regras Visualizadas')
                .addFields(
                    { name: 'Regras Visualizadas por', value: interaction.user.tag, inline: true },
                    { name: 'Canal', value: `<#${interaction.channel.id}>`, inline: true },
                )
                .setTimestamp();

            // Envia o log para o canal de logs
            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.warn('Canal de logs não encontrado ou não é um canal de texto.');
        }
    },
};
