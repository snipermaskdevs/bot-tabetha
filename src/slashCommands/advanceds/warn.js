const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Aplicar um aviso a um usuário.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário a ser advertido")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Motivo do aviso")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    // Verifica se o usuário tem permissão para ser advertido
    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: "Você não pode se advertir!",
        ephemeral: true,
      });
    }

    // Armazenamento de avisos em um "banco de dados" simples (aqui simulado com um objeto)
    // Em um caso real, você pode usar um banco de dados como MongoDB ou SQLite
    const warnData = interaction.client.warns || {};
    if (!warnData[user.id]) {
      warnData[user.id] = [];
    }

    // Adiciona o aviso ao usuário
    warnData[user.id].push({ reason, date: new Date() });
    interaction.client.warns = warnData; // Atualiza os dados no client

    // Verifica o número de avisos
    const userWarnings = warnData[user.id].length;
    let warningMessage = `O usuário **${user.tag}** recebeu um aviso. Motivo: ${reason}`;

    // Ação quando o usuário atingir 3 avisos (exemplo de notificação, sem punição)
    if (userWarnings >= 3) {
      warningMessage += `\n**Aviso: Este usuário atingiu 3 avisos. Ação de moderação necessária.**`;
    }

    // Criação de Embed para resposta
    const embed = new EmbedBuilder()
      .setTitle("**Aviso**")
      .setDescription(warningMessage)
      .setColor("#FFCC00")
      .setTimestamp();

    // Envia a resposta no canal
    return interaction.reply({ embeds: [embed] });
  },
};
