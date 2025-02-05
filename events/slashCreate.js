// const { Collection } = require("discord.js");
const Discord = require("discord.js");
const { owner } = require("../config");
const Players = require("../modules/economy/players");
const ONCE = new Map();

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isCommand()) return;

		if (!client.ready)
			return interaction.reply({
				content: "Please try again...",
				ephemeral: true,
			});

		const command = client.commands.get(interaction.commandName);

		// console.log(interaction)

		if (!command) return;
		// console.log(interaction);
		const guildSettings = await client.guildSettings.get(interaction.guildId);
		const i18n = client.i18n;
		i18n.setLocale(guildSettings.locale);

		if (command.once === true) {
			if (ONCE.has(interaction.user.id)) {
				const commandOnce = ONCE.get(interaction.user.id);

				const onceEmbed = new Discord.MessageEmbed()
					.setTitle(i18n.__("ONCE.title"))
					.setColor("RED")
					.setDescription(
						i18n.__mf("ONCE.description", {
							command: commandOnce.name,
						})
					);

				return interaction.reply({
					// content: `**[Error]** You need to finish your previous \`${command.name}\` command first!`,
					embeds: [onceEmbed],
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 5,
									label: i18n.__mf("ONCE.label", {
										command: commandOnce.name,
									}),
									// url: `https://discord.com/channels/${already.gID}/${already.cID}/${already.mID}`
									url: commandOnce.mURL,
								},
							],
						},
					],
					ephemeral: true,
				});
			}
		}

		if (command.permissions) {
			// console.log(interaction)
			// const guild = await client.guilds.fetch(interaction.guildId);
			// const channel = await guild.channels.fetch(interaction.channelId);
			// const authorPerms = channel.permissionsFor(interaction.member);

			// if (!authorPerms || !authorPerms.has(command.permissions))
			if (!interaction.member.permissions.has(command.permissions)) {
				return interaction.reply({
					content: i18n.__("messageCreate.permissions"),
					ephemeral: true,
				});
			}
		}

		if (command.guildOwner === true) {
			if (interaction.user.id !== interaction.member.guild.ownerId)
				return interaction.reply({
					content: i18n.__("messageCreate.guildOwner"),
					ephemeral: true,
				});
		}

		if (command.maintain || command.maintain == true) {
			return interaction.reply({
				content: i18n.__("messageCreate.maintain"),
				ephemeral: true,
				// "This command is currently under maintenance. Please wait until we completely fixed it.",
			});
		}

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				// const timeLeft = (expirationTime - now) / 1000;
				return interaction.reply({
					content: i18n.__mf("common.cooldown", {
						command: command.name,
						time: Math.floor(expirationTime / 1000),
					}),
					ephemeral: true,
				});
			}
		}

		try {
			const Player = new Players(interaction.user.id);
			const playersCategories = ["economy", "gambling"];

			if (command.category && playersCategories.includes(command.category)) {
				await Player.set();
			}

			if (command.mongoCD && command.mongoCD > 0) {
				const mongoCD = await Player.cooldownsGet(command.data.name);
				if (mongoCD) {
					if (Date.now() - mongoCD.timestamps < mongoCD.duration) {
						return interaction.reply({
							content: i18n.__mf("common.cooldown", {
								command: command.data.name,
								time: Math.floor(
									(mongoCD.timestamps + mongoCD.duration) / 1000
								),
							}),
							ephemeral: true,
						});
					} else await Player.cooldownsPull(command.data.name);
				} else
					await Player.cooldownsPush(command.data.name, command.mongoCD * 1000);
			}
			// console.log(guildSettings);
			await command.execute(interaction, guildSettings, Player, ONCE, i18n);
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
