const Discord = require("discord.js");
module.exports = {
	name: "test",
	description: "this is a test command",
	category: "private",
	// aliases: [""],
	usage: "",
	// cooldown: 5,
	// args: false,
	ownerOnly: true,
	// permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player, ONCE, i18n) {
		const { client } = message;

		console.log(client.commands)

	},
};
