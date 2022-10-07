module.exports = {
    parseStatus(status) {
        const regex = /players : (\d+) humans, (\d+) bots \((\d+) max\)/g;
        const results = regex.exec(status);
        return {
            humans: results[1],
            bots: results[2],
            max: results[3]
        }
    },
    parseMap(status) {
        const regex = /map\s+: (\w+)/g;
        const results = regex.exec(status);
        return {
            map: results[1]
        }
    },
    setBotPresence(client, players, bots, max, map) {
        client.user.setPresence({ 
            activities: [{ name: `${players} / ${max - bots} on ${map}`, type: 1}] 
        });
    }
}