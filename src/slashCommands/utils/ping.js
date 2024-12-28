const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Verifique a latência do bot.`),
    
    async execute(interaction, client) {
        let circles = {
            good: '✅',
            okay: '👍',
            bad: '👎',
        };
    
        const ws = interaction.client.ws.ping;
        const msgEdit = Date.now() - interaction.createdTimestamp;
     
        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;
    
        const embed = new EmbedBuilder()
        .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
        .setColor('#2f3136')
        .setTimestamp()
        .setFooter({ text: `Latência Registrada` })
        .addFields(
            {
                name: 'Latência do Websocket',
                value: `${wsEmoji} \`${ws}ms\``,
            },
            {
                name: 'Latência da API',
                value: `${msgEmoji} \`${msgEdit}ms\``,
            }
        );
    
        const btn = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('btn')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔁')
        )
    
        const msg = await interaction.reply({ embeds: [embed], components: [btn] })
    
        const collector = msg.createMessageComponentCollector()
        collector.on('collect', async i => {
            if(i.customId == 'btn') {
                i.update({ embeds: [
                    new EmbedBuilder()
                    .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
                    .setColor('#2f3136')
                    .setTimestamp()
                    .setFooter({ text: `Latência Registrada` })
                    .addFields(
                        {
                            name: 'Latência do Websocket',
                            value: `${wsEmoji} \`${ws}ms\``,
                        },
                        {
                            name: 'Latência da API',
                            value: `${msgEmoji} \`${msgEdit}ms\``,
                        }
                    )
                ], components: [btn] })
            }
        })
    }    
}