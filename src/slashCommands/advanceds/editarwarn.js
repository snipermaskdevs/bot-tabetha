const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editwarn")
    .setDescription("Editar o motivo de um aviso.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário do qual o aviso será editado")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("index")
        .setDescription("Índice do aviso a ser editado")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("newreason")
        .setDescription("Novo motivo para o aviso")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const index = interaction.options.getInteger("index") - 1; // Ajusta o índice
    const newReason = interaction.options.getString("newreason");

    // Verifica se o usuário tem avisos registrados
    const warnData = interaction.client.warns || {};
    if (!warnData[user.id] || warnData[user.id].length === 0) {
      return interaction.reply({
        content: `O usuário **${user.tag}** não possui avisos registrados.`,
        ephemeral: true,
      });
    }

    // Verifica se o índice é válido
    if (index < 0 || index >= warnData[user.id].length) {
      return interaction.reply({
        content: `Índice inválido! O usuário **${user.tag}** tem ${warnData[user.id].length} aviso(s).`,
        ephemeral: true,
      });
    }

    // Edita o motivo do aviso
    warnData[user.id][index].reason = newReason;
    interaction.client.warns = warnData; // Atualiza os dados no client

    // Criação de Embed para resposta
    const embed = new EmbedBuilder()
      .setTitle("**Aviso Editado**")
      .setDescription(`O motivo do aviso do usuário **${user.tag}** foi alterado para: ${newReason}`)
      .setColor("#FFFF00")
      .setTimestamp();

    // Envia a resposta no canal
    return interaction.reply({ embeds: [embed] });
  },
};
