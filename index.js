const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const axios = require('axios');

// client init
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const channelId = 'CHANNEL_ID';  // change to your channel id
const TOKEN = 'TOKEN'

let message = null;
let messageId = null;

client.once('ready', () => {
    console.log('Bot Online');
    fetchAndSendData();
    setInterval(fetchAndSendData, 10000);
});

async function fetchAndSendData() {
    try {
        const response = await axios.get('https://api1master.majestic-files.com/meta/servers?region=ru');
        const servers = response.data.result.servers;

        if (!servers || !Array.isArray(servers)) {
            console.error('Invalid data received from API:', response.data);
            return;
        }

        // sort by "id"
        servers.sort((a, b) => {
            const idA = parseInt(a.id.replace('ru', ''));
            const idB = parseInt(b.id.replace('ru', ''));
            return idA - idB;
        });

        // forming msg
        const messages = servers.map(server => {
            return `${server.name}: ${server.players} / ${server.queue}`;
        });

        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            if (messageId) {
                // editing existing message
                const message = await channel.messages.fetch(messageId);
                await message.edit(messages.join('\n'));
            } else {
                // sending message and saving ID
                const newMessage = await channel.send(messages.join('\n'));
                messageId = newMessage.id;
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// login with bot token
client.login(TOKEN);
