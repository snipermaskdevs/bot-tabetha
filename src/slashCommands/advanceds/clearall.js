const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearall")
    .setDescription("Limpar todas as mensagens de um canal.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.channel;

    // Criação de um botão para confirmação
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirmClear')
      .setLabel('Confirmar Limpeza')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancelClear')
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Secondary);

    const row = { type: 1, components: [confirmButton, cancelButton] };

    // Enviar a mensagem de confirmação com botões
    const embed = new EmbedBuilder()
      .setTitle("**Confirmação de Limpeza**")
      .setDescription("Tem certeza de que deseja limpar todas as mensagens deste canal?")
      .setColor("#FFCC00");

    await interaction.reply({ embeds: [embed], components: [row] });

    // Esperar pela interação com os botões
    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirmClear') {
        // Limpar mensagens se confirmado
        try {
          const messages = await channel.messages.fetch();
          await channel.bulkDelete(messages, true);

          const successEmbed = new EmbedBuilder()
            .setTitle("**Limpeza Completa**")
            .setDescription("Todas as mensagens do canal foram limpas com sucesso.")
            .setColor("#57F287");

          await i.update({ embeds: [successEmbed], components: [] });
        } catch (err) {
          console.error(err);
          return i.update({ content: "Não foi possível limpar as mensagens.", ephemeral: true });
        }
      } else if (i.customId === 'cancelClear') {
        // Cancelar a limpeza
        const cancelEmbed = new EmbedBuilder()
          .setTitle("**Limpeza Cancelada**")
          .setDescription("A limpeza das mensagens foi cancelada.")
          .setColor("#FF0000");

        await i.update({ embeds: [cancelEmbed], components: [] });
      }
    });

    // Caso o tempo de espera acabe sem interação
    collector.on('end', collected => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("**Tempo Esgotado**")
          .setDescription("O tempo para confirmar ou cancelar a limpeza expirou.")
          .setColor("#FF0000");

        interaction.editReply({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};
