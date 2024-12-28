const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Atribuir um cargo a um usuário.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário a quem o cargo será atribuído")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("Cargo a ser atribuído")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: "Usuário não encontrado!", ephemeral: true });
    }

    // Verifica se o cargo atribuído é superior ao cargo do executor
    if (interaction.member.roles.highest.position <= role.position) {
      return interaction.reply({
        content: "Você não pode atribuir um cargo superior ao seu cargo!",
        ephemeral: true
      });
    }

    // Verifica se o cargo é um cargo de administração ou proibido
    if (role.managed) {
      return interaction.reply({
        content: "Não é possível atribuir cargos gerenciados automaticamente.",
        ephemeral: true
      });
    }

    // Confirmação com botões
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirmAddRole')
      .setLabel('Confirmar Atribuição')
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancelAddRole')
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Danger);

    const row = { type: 1, components: [confirmButton, cancelButton] };

    const embed = new EmbedBuilder()
      .setTitle("**Confirmação de Atribuição de Cargo**")
      .setDescription(`Você tem certeza de que deseja atribuir o cargo **${role.name}** a ${user.tag}?`)
      .setColor("#FFCC00");

    // Enviar a mensagem de confirmação com botões
    await interaction.reply({ embeds: [embed], components: [row] });

    // Esperar pela interação com os botões
    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirmAddRole') {
        try {
          // Adicionar o cargo ao membro
          await member.roles.add(role);

          const successEmbed = new EmbedBuilder()
            .setTitle("**Cargo Atribuído**")
            .setDescription(`${user.tag} recebeu o cargo **${role.name}** com sucesso!`)
            .setColor("#57F287");

          await i.update({ embeds: [successEmbed], components: [] });
        } catch (err) {
          console.error(err);
          await i.update({ content: "Não foi possível atribuir o cargo.", ephemeral: true });
        }
      } else if (i.customId === 'cancelAddRole') {
        const cancelEmbed = new EmbedBuilder()
          .setTitle("**Atribuição de Cargo Cancelada**")
          .setDescription("A atribuição do cargo foi cancelada.")
          .setColor("#FF0000");

        await i.update({ embeds: [cancelEmbed], components: [] });
      }
    });

    // Caso o tempo de espera acabe sem interação
    collector.on('end', collected => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("**Tempo Esgotado**")
          .setDescription("O tempo para confirmar ou cancelar a atribuição expirou.")
          .setColor("#FF0000");

        interaction.editReply({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};
