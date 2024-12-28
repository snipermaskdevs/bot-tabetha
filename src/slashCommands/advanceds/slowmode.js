const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Ativar ou desativar o modo lento em um canal.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(option =>
      option.setName("time")
        .setDescription("Tempo de espera entre mensagens.")
        .setRequired(true)
        .setMinValue(0))
    .addStringOption(option =>
      option.setName("unit")
        .setDescription("Unidade de tempo: 's' para segundos, 'm' para minutos, 'h' para horas.")
        .setRequired(true)
        .addChoices(
          { name: "Segundos", value: "s" },
          { name: "Minutos", value: "m" },
          { name: "Horas", value: "h" }
        )),

  async execute(interaction) {
    const time = interaction.options.getInteger("time");
    const unit = interaction.options.getString("unit");

    let timeInSeconds;

    // Converte o tempo para segundos, dependendo da unidade
    if (unit === "m") {
      timeInSeconds = time * 60; // Converte minutos para segundos
    } else if (unit === "h") {
      timeInSeconds = time * 3600; // Converte horas para segundos
    } else {
      timeInSeconds = time; // Já está em segundos
    }

    // Verifica se o tempo convertido é válido
    if (timeInSeconds < 0 || timeInSeconds > 3600) {
      return interaction.reply({
        content: "O tempo deve estar entre 0 e 3600 segundos (1 hora).",
        ephemeral: true
      });
    }

    // Caso o tempo seja 0, desativa o modo lento
    if (timeInSeconds === 0) {
      await interaction.channel.setRateLimitPerUser(0);
      const embed = new EmbedBuilder()
        .setTitle("**Modo Lento Desativado**")
        .setDescription("O modo lento foi desativado no canal.")
        .setColor("#FFCC00");

      return interaction.reply({ embeds: [embed] });
    }

    // Ativar o modo lento
    await interaction.channel.setRateLimitPerUser(timeInSeconds);

    const embed = new EmbedBuilder()
      .setTitle("**Modo Lento Ativado**")
      .setDescription(`Modo lento ativado com um tempo de ${time} ${unit === "s" ? "segundos" : unit === "m" ? "minutos" : "horas"} entre mensagens.`)
      .setColor("#FFCC00");

    return interaction.reply({ embeds: [embed] });
  },
};
