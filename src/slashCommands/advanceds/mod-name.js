const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mod-name')
    .setDescription(`Modere o apelido de um usuário.`)
    .addUserOption(option =>
        option.setName('alvo')
            .setDescription('O usuário a ser Moderadores')
            .setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({ content: "Você não tem permissão para usar este comando!" });
        }

        await interaction.deferReply();

        const { options } = interaction;
        const alvo = options.getUser('alvo');
        const membro = await interaction.guild.members.fetch(alvo.id).catch(err => {});
        const tag = Math.floor(Math.random() * 10000) + 1;

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Apelido Moderadores')
            .setDescription(`Nome de usuário: **${alvo.username}**\nApelido: **Apelido Moderadores ${tag}**`)
            .setTimestamp();

        try {
            await membro.setNickname(`Apelido Moderadores ${tag}`);
        } catch (e) {
            return await interaction.editReply({ content: `Não foi possível moderar o apelido de ${alvo.username}!` });
        }

        await interaction.editReply({ embeds: [embed] });
    }
}
