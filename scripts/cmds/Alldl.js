const axios = require('axios');

const supportedDomains = [
  { domain: 'facebook.com' },
  { domain: 'instagram.com' },
  { domain: 'youtube.com' },
  { domain: 'youtu.be' },
  { domain: 'pinterest.com' },
  { domain: 'tiktok.com' },
  { domain: 'x.com' },
  { domain: 'twitter.com' }
];

function getMainDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    if (hostname === 'youtu.be') return 'youtube.com';
    const parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (e) {
    return null;
  }
}

async function download({ url, message, event }) {
  try {
    const res = await axios.get(`https://free-goat-api.onrender.com/alldl?url=${encodeURIComponent(url)}`);
    const data = res.data;

    if (!data.status) return;

    const streamUrl = data.links.hd || data.links.sd || data.links.mp3;
    if (!streamUrl) return;

    const stream = (await axios.get(streamUrl, { responseType: 'stream' })).data;
    const domain = getMainDomain(url);

    await message.reply({
      body: `Video Downloaded 🐦\nTitle: ${data.title}\nSource: ${domain}`,
      attachment: stream
    });

    message.reaction('✅', event.messageID);
  } catch (error) {
    message.reaction('❌', event.messageID);
  }
}

module.exports = {
  config: {
    name: 'download',
    aliases: ['dl', 'fbdl', 'ytdl', 'instadl', 'alldl'],
    version: '2.1',
    author: 'Neoaz ゐ',
    countDown: 5,
    role: 0,
    longDescription: 'Download media automatically or via command using Free Goat API.',
    category: 'media',
    guide: {
      en: '{pn} [URL] or reply to a link'
    }
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    if (['on', 'off'].includes(args[0])) {
      if (role < 1) return message.reply('Access denied.');
      const choice = args[0] === 'on';
      const gcData = (await threadsData.get(event.threadID, "data")) || {};
      await threadsData.set(event.threadID, { data: { ...gcData, autoDownload: choice } });
      return message.reply(`Auto-download: ${choice ? 'Enabled' : 'Disabled'}`);
    }

    let url = args.find(arg => /^https?:\/\//.test(arg));
    
    if (!url && event.type === "message_reply") {
      const replyBody = event.messageReply.body;
      const match = replyBody.match(/https?:\/\/[^\s]+/);
      if (match) url = match[0];
    }

    if (!url) return message.reply('Please provide or reply to a valid link.');

    const domain = getMainDomain(url);
    if (!supportedDomains.some(d => d.domain === domain)) {
      return message.reply('Unsupported platform.');
    }

    message.reaction('⏳', event.messageID);
    await download({ url, message, event });
  },

  onChat: async function ({ event, message, threadsData }) {
    if (event.senderID === global.botID || !event.body) return;
    
    const threadData = await threadsData.get(event.threadID);
    if (!threadData?.data?.autoDownload) return;

    const urlRegex = /https?:\/\/[^\s]+/;
    const match = event.body.match(urlRegex);
    
    if (match) {
      const url = match[0];
      const domain = getMainDomain(url);
      
      if (supportedDomains.some(d => d.domain === domain)) {
        const prefix = await global.utils.getPrefix(event.threadID);
        if (event.body.startsWith(prefix)) return;

        message.reaction('⏳', event.messageID);
        await download({ url, message, event });
      }
    }
  }
};
