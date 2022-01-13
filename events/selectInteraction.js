module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a select menu interaction (to prevent weird bugs)

		if (!interaction.isSelectMenu()) return;

		const command = client.selectCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultSelectError.js file!

		if (!command) {
<<<<<<< HEAD
			// await require("../messages/defaultSelectError").execute(interaction);
=======
// 			await require("../messages/defaultSelectError").execute(interaction);
>>>>>>> c544fb6cf4218787e058515e263b2a20e4536f6b
			return;
		}

		// A try to execute the interaction.

		try {
			if (command.filter.toLowerCase() === "author")
				if (
					interaction.message.mentions.users.first().id !== interaction.user.id
				)
					return await interaction.reply({
						content: "This message is not for you!",
						ephemeral: true,
					})

			await command.execute(interaction);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "There was an issue while executing that select menu option!",
				ephemeral: true,
			});
			return;
		}
	},
};
