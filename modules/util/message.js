const Discord = require("discord.js");

module.exports = (message) => {
	const { components } = message;
    
	message.disableComponent = (components, state = true) =>
		components.map((row) =>
			new Discord.MessageActionRow().addComponents([
				row.components.map((component) => {
					switch (component.type) {
						case "BUTTON":
							const button = new Discord.MessageButton()
								.setCustomId(component.customId)
								.setEmoji(component.emoji)
								.setLabel(component.label)
								.setStyle(component.style);

							if (component.style === "LINK") button.setURL(component.url);
							else button.setDisabled(state);
							return button;

						case "SELECT_MENU":
							return new Discord.MessageSelectMenu()
								.setCustomId(component.customId)
								.setPlaceholder(component.placeholder || null)
								.setDisabled(state);
					}
				}),
			])
		);
};
