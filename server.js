// Require classes
const { Client, GatewayIntentBits } = require('discord.js');
const Rcon = require('mbr-rcon');
const { sendServerCommand } = require('./module/helper.js');
const Helper = require('./module/helper.js');
require('dotenv').config();

//Load env
const token = process.env.DISCORD_TOKEN;
const server_host = process.env.SRCDS_HOST;
const server_port = process.env.SRCDS_PORT;
const server_pw = process.env.SRCDS_PW;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Create server instance
const server = new Rcon({
	host: server_host,
	port: server_port,
	pass: server_pw,
	onClose: console.log("Server connection closed")
});

client.once('ready', () => {
	console.log('Discord bot ready!');
	getServerStatus();
});

client.login(token);


//Presence updating logic
function getServerStatus() {
	sendServerCommand(server, 'status', setServerStatus)
	setTimeout(getServerStatus, 1000*10);
}

function setServerStatus(status) {
	const playercount = Helper.parseStatus(status);
	const map = Helper.parseMap(status);
	Helper.setBotPresence(client,playercount.humans,playercount.bots,playercount.max,map.map);
}