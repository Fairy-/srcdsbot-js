// Require classes
const { Client, GatewayIntentBits } = require('discord.js');
const Rcon = require('mbr-rcon');
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

//Connect to the server and authenticate
const conn = server.connect({
	onSuccess: console.log("Connected to server."),
	onError: (error) => {console.log("Connection error: " + error)}
}).auth({
	onSuccess: console.log("Server authenticated"),
	onError: (error) => {console.log("Authentication error: " + error)}
});

client.once('ready', () => {
	console.log('Discord bot ready!');
	getServerStatus();
});

client.login(token);

function getServerStatus() {
	conn.send('status',
	{
		onSuccess: (response) => setServerStatus(response)
	});
	setTimeout(getServerStatus, 1000*10);
}

function setServerStatus(status) {
	const playercount = Helper.parseStatus(status);
	const map = Helper.parseMap(status);
	Helper.setBotPresence(client,playercount.humans,playercount.bots,playercount.max,map.map);
}