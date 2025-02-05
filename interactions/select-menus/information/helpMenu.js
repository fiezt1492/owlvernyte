const { prefix } = require("../../../config");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
	id: "helpPanel",
	filter: "author",
	// time: 60000,

	async execute(interaction) {
		const { message } = interaction;
		const { commands } = message.client;
		const slashCommands = message.client.slashCommands;

		// const formatString = (str) =>
		// 	`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

		let categories = [...new Set(commands.map((cmd) => cmd.category))];
		categories = categories.filter((cate) => cate !== "private");

		const commandsList = categories.map((cate) => {
			const getCommands = commands
				.filter((cmd) => cmd.category === cate)
				.map((cmd) => {
					return {
						name: cmd.data.name || "None",
						description: cmd.data.description || "None",
						maintain: cmd.maintain || false
					};
				});

			return {
				category: cate,
				commands: getCommands,
			};
		});

		const helpEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setURL(process.env.URL)
			.setTitle("Help Panel")
			// .setDescription(
			// 	`You can use \`${prefix}help <command name>\` to get info on a specific command!`
			// )
			.addField(
				"CONNECT WITH US",
				"**[Youtube](https://www.youtube.com/channel/UCEG5sgFKieaUuHsu5VG-kBg)** | **[Discord](https://discord.io/owlvernyte+)** | **[Facebook](https://www.facebook.com/owlvernyte)**"
			)
			.addField(
				"Buy me a coffee",
				`**[Playerduo](https://playerduo.com/owlvernyte)** | **[buymeacoffee](https://buymeacoffee.com/fiezt)**`
			)
			.setFooter({ text: `Select one of these categories below` });

		if (interaction.values.includes("home"))
			return interaction.update({ embeds: [helpEmbed], ephemeral: true });

		const [category] = interaction.values;
		const list = commandsList.find(
			(x) => x.category.toLowerCase() === category
		);

		const categoryEmbed = new MessageEmbed()
			.setTitle(`Help Panel`)
			.setColor("RANDOM")
			.setURL(process.env.URL)
			.setDescription(
				`A maintaining command will look like this: ~~\`command\`~~`
			)
			.addField(
				list.category.toUpperCase(),
				list.commands
					.map((cmd) =>
						cmd.maintain ? `~~\`${cmd.name}\`~~` : `\`${cmd.name}\``
					)
					.join(", ")
			);
		return interaction.update({ embeds: [categoryEmbed], ephemeral: true });
	},
};
