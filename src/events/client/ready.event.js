// discord.js
const { ActivityType } = require("discord.js");

// config.json
const config = require("../../../config.json");

// axios - request
const axios = require("axios");

// event
module.exports = {
    name: "ready",
    async execute(client) {

        // main logs
        console.log(`[LOG] ${client.user.username} is ready!`);

        // bot status
        const textStatus = `System`;
        client.user.setActivity(textStatus, {
            type: ActivityType.Custom
        });
        client.user.setStatus("online");

        // changes the bot description to the official one
        const description = `>>> <:discord:1213692163947372555> | **BOT com valor único e sem taxas adicionais.**\n<:dona:1213567421437317161> | **__Quer saber mais?__** Contate meu developer: ***__snipermaskdev__***\n<:link:1213689677173751909> | https://discord.gg/JHakhkXahT`
        await axios.patch(`https://discord.com/api/v10/applications/${client.user.id}`, {
            description: description
        }, {
            headers: {
                "Authorization": `Bot ${config.botToken}`,
                "Content-Type": 'application/json',
            }
        });

    },
};