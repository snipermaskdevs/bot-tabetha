const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("announce")
      .setDescription("Send an advanced announcement")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for the announcement")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("The announcement message")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("title").setDescription("Title of the announcement")
      )
      .addStringOption((option) =>
        option.setName("color").setDescription("Hex color code for the embed")
      )
      .addStringOption((option) =>
        option
          .setName("timestamp")
          .setDescription("Schedule time (YYYY-MM-DD HH:MM format, in UTC)")
      )
      .addStringOption((option) =>
        option
          .setName("image")
          .setDescription("URL of the image to include in the embed")
      )
      .addStringOption((option) =>
        option
          .setName("thumbnail")
          .setDescription("URL of the thumbnail to include in the embed")
      ),
  
    async execute(interaction, client) {
      try {
        const channel = interaction.options.getChannel("channel");
        const messageText = interaction.options.getString("message");
        const title = interaction.options.getString("title") || "Announcement";
        const color = interaction.options.getString("color") || "#FFFFFF";
        const timestamp = interaction.options.getString("timestamp");
        const image = interaction.options.getString("image");
        const thumbnail = interaction.options.getString("thumbnail");
  
        if (timestamp) {
          const scheduledTime = new Date(timestamp);
          if (isNaN(scheduledTime.getTime())) {
            await interaction.reply({
              content:
                "Invalid timestamp format. Please use YYYY-MM-DD HH:MM in UTC.",
              ephemeral: true,
            });
            return;
          }
  
          const scheduledEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(messageText)
            .setColor(color);
  
          if (image) {
            scheduledEmbed.setImage(image);
          }
          if (thumbnail) {
            scheduledEmbed.setThumbnail(thumbnail);
          }
  
          setTimeout(async () => {
            await channel.send({ embeds: [scheduledEmbed] });
          }, scheduledTime.getTime() - Date.now());
          await interaction.reply({
            content: `Announcement scheduled for ${scheduledTime.toUTCString()}`,
            ephemeral: true,
          });
        } else {
          const previewEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(messageText)
            .setColor(color);
  
          if (image) {
            previewEmbed.setImage(image);
          }
          if (thumbnail) {
            previewEmbed.setThumbnail(thumbnail);
          }
  
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("confirm_send")
              .setLabel("Send")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("cancel_send")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Danger)
          );
  
          await interaction.reply({
            content: "Preview of the announcement:",
            ephemeral: true,
            embeds: [previewEmbed],
            components: [row],
          });
  
          const filter = (i) => {
            i.deferUpdate();
            return i.customId === "confirm_send" || i.customId === "cancel_send";
          };
  
          const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 15000,
          });
  
          collector.on("collect", async (i) => {
            if (i.customId === "confirm_send") {
              await channel.send({ embeds: [previewEmbed] });
              await interaction.editReply({
                content: "Announcement sent successfully!",
                components: [],
              });
            } else {
              await interaction.editReply({
                content: "Announcement cancelled.",
                components: [],
              });
            }
          });
  
          collector.on("end", (collected) => {
            if (collected.size === 0) {
              interaction.editReply({
                content: "No action taken. Announcement cancelled.",
                components: [],
              });
            }
          });
        }
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "There was an error processing your announcement.",
          ephemeral: true,
        });
      }
    },
  };
  