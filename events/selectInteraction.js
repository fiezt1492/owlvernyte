module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a select menu interaction (to prevent weird bugs)

		if (!interaction.isSelectMenu()) return;

		if (!client.ready)
			return interaction.reply({
				content: "Please try again...",
				ephemeral: true,
			});

		const command = client.selectCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultSelectError.js file!

		if (!command) {
			// await require("../messages/defaultSelectError").execute(interaction);
			return;
		}

		const guildSettings = await client.guildSettings.get(interaction.guildId);
		const i18n = client.i18n;
		i18n.setLocale(guildSettings.locale);
		// A try to execute the interaction.

		if (command.maintain || command.maintain == true) {
			return interaction.reply({
				content: i18n.__("messageCreate.maintain"),
				ephemeral: true,
				// "This command is currently under maintenance. Please wait until we completely fixed it.",
			});
		}

		try {
			// console.log(interaction);
			if (command.filter.toLowerCase() === "author") {
				if (interaction.message) {
					if (interaction.message.interaction) {
						if (interaction.message.interaction.user.id !== interaction.user.id)
							return await interaction.reply({
								content: i18n.__("interactionCreate.author"),
								ephemeral: true,
							});
					}

					if (interaction.message.reference) {
						const guild = await client.guilds.fetch(
							interaction.message.reference.guildId
						);
						const channel = await guild.channels.fetch(
							interaction.message.reference.channelId
						);
						const message = await channel.messages.fetch(
							interaction.message.reference.messageId
						);

						if (message.author.id !== interaction.user.id)
							return await interaction.reply({
								content: i18n.__("interactionCreate.author"),
								ephemeral: true,
							});
					}

					// if (interaction.message.mentions) {
					// 	if (
					// 		interaction.message.mentions.repliedUser &&
					// 		interaction.message.mentions.repliedUser.id !==
					// 			interaction.user.id
					// 	) {
					// 		return await interaction.reply({
					// 			content: "This message is not for you!",
					// 			ephemeral: true,
					// 		});
					// 	}

					// 	if (
					// 		interaction.message.mentions.users.length > 0 &&
					// 		interaction.message.mentions.users.first().id !==
					// 			interaction.user.id
					// 	)
					// 		return await interaction.reply({
					// 			content: "This message is not for you!",
					// 			ephemeral: true,
					// 		});
					// }
				}
			}

			await command.execute(interaction, guildSettings, i18n);
			return;
		} catch (err) {
			console.error(err);
			if (interaction.deferred || interaction.replied) {
				await interaction.editReply({
					content: i18n.__("common.error"),
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: i18n.__("common.error"),
					ephemeral: true,
				});
			}
			return;
		}
	},
};
