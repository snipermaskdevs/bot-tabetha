const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tempmuteall")
    .setDescription("Silenciar todos os membros de um canal por um tempo determinado.")
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addIntegerOption(option =>
      option.setName("duration")
        .setDescription("Duração do silenciamento em minutos")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440)),

  async execute(interaction) {
    const duration = interaction.options.getInteger("duration");

    const members = interaction.channel.members;

    // Confirmação inicial
    const confirmationEmbed = new EmbedBuilder()
      .setTitle("**Modo Silencioso Ativado**")
      .setDescription(`Todos os membros serão silenciados por ${duration} minuto(s).`)
      .setColor("#FFCC00");

    await interaction.reply({ embeds: [confirmationEmbed] });

    // Silencia todos os membros
    members.forEach(async (member) => {
      if (!member.voice.serverMute) {
        try {
          if (member.voice.channel) {
            await member.voice.setMute(true); // Mute
          }
        } catch (err) {
          console.error(`Erro ao mutar o membro ${member.user.tag}:`, err);
        }
      }
    });

    // Criação de Embed de desmute futuro
    const muteTime = duration * 60000; // tempo em milissegundos
    const muteEndEmbed = new EmbedBuilder()
      .setTitle("**Modo Silencioso Finalizado**")
      .setDescription(`O silenciamento de todos os membros será removido em ${duration} minutos.`)
      .setColor("#FFCC00")
      .setTimestamp(Date.now() + muteTime);

    // Remover o silenciamento após o tempo definido
    setTimeout(() => {
      members.forEach(async (member) => {
        try {
          if (member.voice.channel) {
            await member.voice.setMute(false); // Desmute
          }
        } catch (err) {
          console.error(`Erro ao desmutar o membro ${member.user.tag}:`, err);
        }
      });

      // Enviar a mensagem confirmando que o modo silencioso foi desativado
      interaction.followUp({ embeds: [muteEndEmbed] });
    }, muteTime);
  },
};
