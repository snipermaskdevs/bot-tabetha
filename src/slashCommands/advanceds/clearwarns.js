const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarns")
    .setDescription("Limpar todos os avisos de um usuário.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário cujos avisos serão limpos")
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

    // Limpa os avisos do usuário
    delete warnData[user.id];
    interaction.client.warns = warnData; // Atualiza os dados no client

    // Criação de Embed para resposta
    const embed = new EmbedBuilder()
      .setTitle("**Avisos Limpos**")
      .setDescription(`Todos os avisos do usuário **${user.tag}** foram limpos com sucesso.`)
      .setColor("#00FF00")
      .setTimestamp();

    // Envia a resposta no canal
    return interaction.reply({ embeds: [embed] });
  },
};
