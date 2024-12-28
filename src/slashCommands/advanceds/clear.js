const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Limpar uma quantidade específica de mensagens de um alvo ou canal."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Quantidade de mensagens para limpar.")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(false) // Tornando opcional
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Limpar mensagens de um usuário específico.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("messageid")
        .setDescription("Limpar uma mensagem específica pelo ID.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getInteger("amount");
    const user = options.getUser("user");
    const messageId = options.getString("messageid");

    const messages = await channel.messages.fetch({
      limit: amount ? amount + 1 : 100, // Padrão para 100 se "amount" não for especificado
    });

    const errEmbed = new EmbedBuilder()
      .setDescription("Algo deu errado. Tente novamente mais tarde.")
      .setColor("#ED4245");

    const successEmbed = new EmbedBuilder()
      .setTitle("**Limpar**")
      .setDescription(
        `Mensagens deletadas com sucesso: ${messages.size} mensagens do canal.`
      )
      .addFields(
        { name: "Quantidade", value: `${messages.size} mensagens`, inline: true },
        { name: "Status", value: `Concluído`, inline: true }
      )
      .setColor("#57F287");

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (messageId) {
      const msgToDelete = await channel.messages.fetch(messageId);
      await msgToDelete.delete();
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription("Mensagem deletada com sucesso.").setColor("#57F287"),
        ],
      });
    }

    if (user) {
      const userMessages = messages.filter((msg) => msg.author.id === user.id);
      if (userMessages.size === 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Nenhuma mensagem encontrada de ${user.tag}.`)
              .setColor("#ED4245"),
          ],
        });

      await channel.bulkDelete(userMessages, true);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Mensagens de ${user.tag} deletadas com sucesso: ${userMessages.size} mensagens.`)
            .setColor("#57F287"),
        ],
      });
    }

    if (amount) {
      await channel.bulkDelete(amount, true);
      return interaction.reply({ embeds: [successEmbed] });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Por favor, forneça uma opção válida (quantidade, usuário ou ID da mensagem).")
          .setColor("#ED4245"),
      ],
    });
  },
};
