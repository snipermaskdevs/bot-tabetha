const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Remover um cargo de um usuário.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Usuário de quem o cargo será removido")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("Cargo a ser removido")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: "Usuário não encontrado!", ephemeral: true });
    }

    // Verifica se o cargo a ser removido é superior ao cargo do executor
    if (interaction.member.roles.highest.position <= role.position) {
      return interaction.reply({
        content: "Você não pode remover um cargo superior ao seu cargo!",
        ephemeral: true
      });
    }

    // Verifica se o membro já tem o cargo
    if (!member.roles.cache.has(role.id)) {
      return interaction.reply({
        content: `${user.tag} não possui o cargo ${role.name}.`,
        ephemeral: true
      });
    }

    // Confirmação com botões
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirmRemoveRole')
      .setLabel('Confirmar Remoção')
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancelRemoveRole')
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Danger);

    const row = { type: 1, components: [confirmButton, cancelButton] };

    const embed = new EmbedBuilder()
      .setTitle("**Confirmação de Remoção de Cargo**")
      .setDescription(`Você tem certeza de que deseja remover o cargo **${role.name}** de ${user.tag}?`)
      .setColor("#FFCC00");

    // Envia a mensagem de confirmação com botões
    await interaction.reply({ embeds: [embed], components: [row] });

    // Espera pela interação com os botões
    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirmRemoveRole') {
        try {
          // Remove o cargo do membro
          await member.roles.remove(role);

          const successEmbed = new EmbedBuilder()
            .setTitle("**Cargo Removido**")
            .setDescription(`${user.tag} teve o cargo **${role.name}** removido com sucesso!`)
            .setColor("#FF4500");

          await i.update({ embeds: [successEmbed], components: [] });
        } catch (err) {
          console.error(err);
          await i.update({ content: "Não foi possível remover o cargo.", ephemeral: true });
        }
      } else if (i.customId === 'cancelRemoveRole') {
        const cancelEmbed = new EmbedBuilder()
          .setTitle("**Remoção de Cargo Cancelada**")
          .setDescription("A remoção do cargo foi cancelada.")
          .setColor("#FF0000");

        await i.update({ embeds: [cancelEmbed], components: [] });
      }
    });

    // Caso o tempo de espera acabe sem interação
    collector.on('end', collected => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("**Tempo Esgotado**")
          .setDescription("O tempo para confirmar ou cancelar a remoção expirou.")
          .setColor("#FF0000");

        interaction.editReply({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};
