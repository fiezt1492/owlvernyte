// const Discord = require("discord.js");

module.exports = {
	data: {
		name: "Cancel Interaction",
		type: 3,
	},
	filter: "author",

	async execute(interaction, guildSettings, i18n) {
		const { client } = interaction;
		const message = interaction.targetMessage;

		if (message.components.length <= 0)
			return await interaction.reply({
				content: i18n.__("interactionCreate.missingComponents"),
				ephemeral: true,
			});

		return await message
			.edit({
				components: client.disableComponent(message),
			})
			.then(() => {
				interaction.reply({
					content: i18n.__("common.done"),
					ephemeral: true,
				});
			})
			.catch((error) => {
				interaction.reply({
					content: i18n.__("common.notMyMessage"),
					ephemeral: true,
				});
			});
	},
};
