const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Create a custom embed.')
  .addSubcommand(subcommand => subcommand
    .setName('create')
    .setDescription('Create a custom embed.')
    .addStringOption(option => option.setName('title').setDescription('Title of the embed.').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Description of the embed.').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('Embed color').setRequired(true))
    .addStringOption(option => option.setName('url').setDescription('Embed URL'))
    .addStringOption(option => option.setName('image').setDescription('Image of the embed.'))
    .addStringOption(option => option.setName('author').setDescription('Author of the embed.'))
    .addStringOption(option => option.setName('author-icon').setDescription('Embed author icon.'))
    .addStringOption(option => option.setName('author-url').setDescription('Embed author url.'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Embed miniature.'))
    .addStringOption(option => option.setName('field-name').setDescription('Name of the embed field.'))
    .addStringOption(option => option.setName('field-value').setDescription('Embed field value'))
    .addStringOption(option => option.setName('footer').setDescription('Footer of the embed.'))
    .addStringOption(option => option.setName('footer-icon').setDescription('Foto del footer del embed.')))
    .addSubcommand(subcommand => subcommand
    .setName('edit')
    .setDescription('Edit an embed')
    .addStringOption(option => option.setName('id').setDescription('Embed id').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Description of the embed.').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('Title of the embed.'))
    .addStringOption(option => option.setName('color').setDescription('Embed color'))
    .addStringOption(option => option.setName('url').setDescription('Embed URL'))
    .addStringOption(option => option.setName('image').setDescription('Image of the embed.'))
    .addStringOption(option => option.setName('author').setDescription('Author of the embed.'))
    .addStringOption(option => option.setName('author-icon').setDescription('Embed author icon.'))
    .addStringOption(option => option.setName('author-url').setDescription('Embed author url.'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Embed miniature'))
    .addStringOption(option => option.setName('field-name').setDescription('Name of the embed field.'))
    .addStringOption(option => option.setName('field-value').setDescription('Embed field value'))
    .addStringOption(option => option.setName('footer').setDescription('Footer of the embed.'))
    .addStringOption(option => option.setName('footer-icon').setDescription('Embed footer icon.')))
    .addSubcommand(subcommand => subcommand
    .setName('delete')
    .setDescription('Delete an embed')
    .addStringOption(option => option.setName('id').setDescription('Embed id').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
    
    const { options } = interaction;

    const title = options.getString('title');
    const url = options.getString('url');
    const description = options.getString('description');
    const color = options.getString('color');
    const image = options.getString('image');
    const author = options.getString('author');
    const authorIcon = options.getString('author-icon');
    const authorUrl = options.getString('author-url');
    const thumbnail = options.getString('thumbnail');
    const fieldN = options.getString('field-name') || ' ';
    const fieldV = options.getString('field-value') || ' ';
    const footer = options.getString('footer') || ' ';
    const footericon = options.getString('footer-icon');
    const Id = options.getString('id');

  if (options.getSubcommand() === 'edit') {
  const editEmbed = await interaction.channel.messages.fetch(Id).catch(() => null);

  if (!editEmbed || !editEmbed.embeds[0]) {
    return await interaction.reply({ content: 'Oops, looks like you got the wrong message.', ephemeral: true });
  }

  const targetEmbed = editEmbed.embeds[0];

const fieldOptions = {
  name: options.getString('field-name'),
  value: options.getString('field-value'),
  inline: false
};

const fields = [];
if (fieldOptions.name || fieldOptions.value || fieldOptions.inline) {
  fields.push(fieldOptions);
}

  const editedEmbed = new EmbedBuilder()
    .setColor(options.getString('color') || targetEmbed.color)
    .setTitle(options.getString('title') || targetEmbed.title)
    .setURL(options.getString('url') || targetEmbed.url)
    .setDescription(options.getString('description') || targetEmbed.description)
    .setImage(options.getString('image') || targetEmbed.image)
    .setAuthor({ name: options.getString('author') || targetEmbed.author, iconURL: options.getString('author-icon') || targetEmbed.authorIcon, url: options.getString('author-url') || targetEmbed.authorUrl })
    .setThumbnail(options.getString('thumbnail') || targetEmbed.thumbnail)
    .setFields(fields)
    .setFooter({ text: options.getString('footer') || targetEmbed.footer, iconURL: options.getString('footer-icon') || targetEmbed.footericon })

  await editEmbed.edit({ embeds: [editedEmbed] });

  return await interaction.reply({ content: 'Embed edited successfully.', ephemeral: true });
}


    if (options.getSubcommand() === 'delete') {
      const editEmbed = await interaction.channel.messages.fetch(Id).catch(() => null);

      if (!editEmbed || !editEmbed.embeds[0]) {
        return await interaction.reply({ content: 'Oops, looks like you got the wrong message.', ephemeral: true });
      }

      await editEmbed.delete();
      return await interaction.reply({ content: 'Embed removed successfully.', ephemeral: true });
    }

    if (image) {      
      if (!image.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.'})
  }

    if (thumbnail) {
      if (!thumbnail.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.'})
    }

    if (footericon) {
      if (!footericon.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.'})
    }

    if (url) {
      if (!url.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.'})
    }

    if (authorUrl) {
      if (!footericon.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.'})
    }

    if (authorIcon) {
      if (!authorIcon.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.'})
    }

const fieldOptions = {
  name: options.getString('field-name'),
  value: options.getString('field-value'),
  inline: false
};

const fields = [];
if (fieldOptions.name || fieldOptions.value || fieldOptions.inline) {
  fields.push(fieldOptions);
}

    const embed = new EmbedBuilder()
    .setAuthor({ name: author, iconURL: authorIcon, url: authorUrl })
    .setTitle(title)
    .setURL(url)
    .setDescription(description)
    .setColor(color)
    .setImage(image)
    .setThumbnail(thumbnail)
    .setFields(fields)
    .setFooter({ text: footer, iconURL: footericon })

    await interaction.reply({ content: 'The embed has been sent', ephemeral: true })

    await interaction.channel.send({ embeds: [embed] })
  }
}