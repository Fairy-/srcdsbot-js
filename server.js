// Require classes
const { Client, GatewayIntentBits } = require('discord.js');
const Rcon = require('srcds-rcon');
const Helper = require('./module/helper.js');
require('dotenv').config();

//Load env
const token = process.env.DISCORD_TOKEN;
const server_host = process.env.SRCDS_HOST;
const server_pw = process.env.SRCDS_PW;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Create server instance
const server = Rcon({address: server_host, password: server_pw});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Discord bot ready!');
	getServerStatus();
});

client.login(token);

async function getServerStatus() {
	try {
		await server.connect();
		let status = await server.command('status');
		const playercount = Helper.parseStatus(status);
		const map = Helper.parseMap(status);
		await server.disconnect();
		Helper.setBotPresence(client,playercount.humans,playercount.bots,playercount.max,map.map);

	} catch(error) {
		console.error(error)
	}
	setTimeout(getServerStatus, 1000*60);
}
