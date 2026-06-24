const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const simsim = "https://simsimi.cyberbot.top";

module.exports = {
  config: {
    name: "baby",
    version: "2.3.6",
    author: "Washiq",
    countDown: 0,
    role: 0,
    shortDescription: "Voice trigger Baby AI with direct links",
    longDescription: "Cute AI Baby Chatbot — triggers with voice and supports teaching/editing via API",
    category: "simsim",
    guide: {
      en: "{pn} [message/query] | teach [Q] - [A] | list | edit [Q] - [Old] - [New] | rm [Q] - [A]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const uid = event.senderID;
      const senderName = await usersData.getName(uid);
      const rawQuery = args.join(" ");
      const query = rawQuery.toLowerCase();

      if (!query) return api.sendMessage("Bolo baby", event.threadID);
      const command = args[0].toLowerCase();

      if (command === "teach") {
        const parts = rawQuery.replace(/^teach\s*/i, "").split(" - ");
        if (parts.length < 2) return api.sendMessage("❌ Use: teach [Question] - [Reply]", event.threadID, event.messageID);
        const [ask, ans] = parts.map(p => p.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}&groupID=${event.threadID}`);
        return api.sendMessage(`${res.data.message || "✅ Reply added successfully!"}`, event.threadID, event.messageID);
      }

      if (command === "list") {
        const res = await axios.get(`${simsim}/list`);
        return api.sendMessage(`♾ Total Questions: ${res.data.totalQuestions}\n★ Total Replies: ${res.data.totalReplies}\n👤 Dev: ${res.data.author}`, event.threadID, event.messageID);
      }

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const reply of responses) {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: event.senderID, type: "simsimi" });
        }, event.messageID);
      }
    } catch (err) {
      return api.sendMessage(`| Error: ${err.message}`, event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, usersData }) {
    try {
      const senderName = await usersData.getName(event.senderID);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(event.body)}&senderName=${encodeURIComponent(senderName)}`);
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const reply of responses) {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: event.senderID, type: "simsimi" });
        }, event.messageID);
      }
    } catch (err) { console.error(err); }
  },

  onChat: async function ({ api, event, usersData }) {
    try {
      if (!event.body) return;
      const raw = event.body.toLowerCase().trim();
      const triggers = ["baby", "bot", "bby", "jan", "xan", "জান", "বট", "বেবি", "raha", "রাহা"];

      if (triggers.includes(raw)) {
        const mediaLinks = [
          "https://drive.google.com/uc?id=1gsekCJh2GUvfb67vtEJyCH4ZBpm3DYip&export=download",
          "https://drive.google.com/uc?id=1HJ5dv6sKI2xyjxQH-_EKLx-vCZ1PYDC_&export=download",
          "https://drive.google.com/uc?id=1R2VouLkLIvtRujzmMADBBZRXutW5mPin&export=download",
          "https://drive.google.com/uc?id=16WK2TUZRojAvvvaBCVB623MVryqctQ_P&export=download",
          "https://drive.google.com/uc?id=1edpdh4hGzSaPp0mtE7V2jAD_QHfI3noL&export=download",
          "https://drive.google.com/uc?id=18b8VKltmhnOhl_ZKnOb_njEG_Z7Fw6Mo&export=download",
          "https://drive.google.com/uc?id=1yli8nBcoyK7vsJExGC_qJF4iwLJImo0m&export=download",
          "https://drive.google.com/uc?id=1C5r8pNorNInCplZHKTEyWoHNt46hDiE5&export=download",
          "https://drive.google.com/uc?id=1c9NBzyFKA0rCzrqpcxNGo8YhYDh_2N4H&export=download",
          "https://drive.google.com/uc?id=1HrXuv2y5Y9hx5DpGQURcu01TFwyy43e4&export=download"
        ];

        const randomLink = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);
        const filePath = path.join(cacheDir, `baby_${Date.now()}.mp3`);

        const response = await axios({
          method: 'get',
          url: randomLink,
          responseType: 'stream',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        return api.sendMessage({
          body: `আমার বসরে একটা গার্লफ्रेंड খুঁজে দিবা 🙂🥹`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: event.senderID, type: "simsimi" });
          setTimeout(() => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 15000);
        }, event.messageID);
      }

      if (triggers.some(prefix => raw.startsWith(prefix + " "))) {
        const query = raw.replace(/^(baby|bot|bby|jan|xan|জান|বট|বেবি|raha|রাহা)\s+/i, "").trim();
        const senderName = await usersData.getName(event.senderID);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
        const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
        for (const reply of responses) {
          api.sendMessage(reply, event.threadID, (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: event.senderID, type: "simsimi" });
          }, event.messageID);
        }
      }
    } catch (err) { console.error("onChat Error:", err); }
  }
};
