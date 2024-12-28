const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remover um aviso de um usuário.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário do qual o aviso será removido")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("index")
        .setDescription("Índice do aviso a ser removido")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const index = interaction.options.getInteger("index") - 1; // Ajusta o índice para começar de 0

    // Verifica se o usuário tem permissão para remover o aviso
    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: "Você não pode remover seus próprios avisos!",
        ephemeral: true,
      });
    }

    // Armazenamento de avisos em um "banco de dados" simples (aqui simulado com um objeto)
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

    // Remove o aviso
    warnData[user.id].splice(index, 1);
    interaction.client.warns = warnData; // Atualiza os dados no client

    // Criação de Embed para resposta
    const embed = new EmbedBuilder()
      .setTitle("**Aviso Removido**")
      .setDescription(`O aviso do usuário **${user.tag}** foi removido com sucesso.`)
      .setColor("#00FF00")
      .setTimestamp();

    // Envia a resposta no canal
    return interaction.reply({ embeds: [embed] });
  },
};
