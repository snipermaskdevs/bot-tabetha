const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buttons")
    .setDescription("Enviar uma mensagem com botões redirecionáveis.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName("title")
        .setDescription("Título da Embed")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("color")
        .setDescription("Cor da Embed (em hexadecimal)")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("button1")
        .setDescription("Texto do primeiro botão (deixe vazio para não criar o botão)"))
    .addStringOption(option =>
      option.setName("link1")
        .setDescription("Link para o primeiro botão"))
    .addStringOption(option =>
      option.setName("button2")
        .setDescription("Texto do segundo botão (deixe vazio para não criar o botão)"))
    .addStringOption(option =>
      option.setName("link2")
        .setDescription("Link para o segundo botão"))
    .addStringOption(option =>
      option.setName("button3")
        .setDescription("Texto do terceiro botão (deixe vazio para não criar o botão)"))
    .addStringOption(option =>
      option.setName("link3")
        .setDescription("Link para o terceiro botão"))
    .addStringOption(option =>
      option.setName("button4")
        .setDescription("Texto do quarto botão (deixe vazio para não criar o botão)"))
    .addStringOption(option =>
      option.setName("link4")
        .setDescription("Link para o quarto botão"))
    .addStringOption(option =>
      option.setName("button5")
        .setDescription("Texto do quinto botão (deixe vazio para não criar o botão)"))
    .addStringOption(option =>
      option.setName("link5")
        .setDescription("Link para o quinto botão")),

  async execute(interaction) {
    const title = interaction.options.getString("title");
    const color = interaction.options.getString("color");
    
    // Coletando os botões e links
    const buttonData = [];
    for (let i = 1; i <= 5; i++) {
      const buttonText = interaction.options.getString(`button${i}`);
      const buttonLink = interaction.options.getString(`link${i}`);

      if (buttonText && buttonLink) {
        buttonData.push({ label: buttonText, url: buttonLink });
      }
    }

    // Criação da Embed
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(color)
      .setTimestamp();

    // Criar os botões com ActionRow
    const row = new ActionRowBuilder();

    buttonData.forEach(button => {
      const buttonComponent = new ButtonBuilder()
        .setLabel(button.label)
        .setStyle(ButtonStyle.Link)
        .setURL(button.url);

      row.addComponents(buttonComponent);
    });

    // Responder com Embed e Botões
    return interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
