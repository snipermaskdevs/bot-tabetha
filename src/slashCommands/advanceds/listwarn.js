const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listwarns")
    .setDescription("Listar todos os avisos de um usuário.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário cujos avisos serão listados")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    // Verifica se o usuário tem avisos registrados
    const warnData = interaction.client.warns || {};
    if (!warnData[user.id] || warnData[user.id].length === 0) {
      return interaction.reply({
        content: `O usuário **${user.tag}** não possui avisos registrados.`,
        ephemeral: true,
      });
    }

    // Cria a lista de avisos
    const warningsList = warnData[user.id]
      .map((warn, index) => `**${index + 1}.** Motivo: ${warn.reason} - Data: ${warn.date.toLocaleString()}`)
      .join("\n");

    // Criação de Embed para resposta
    const embed = new EmbedBuilder()
      .setTitle(`Avisos de **${user.tag}**`)
      .setDescription(warningsList)
      .setColor("#FFCC00")
      .setTimestamp();

    // Envia a resposta no canal
    return interaction.reply({ embeds: [embed] });
  },
};
