const { writeFileSync } = require("fs-extra");

const fancy = (str) => {
  const map = {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  return String(str).split('').map(c => map[c] || c).join('');
};

const symbols = {
  crown: "♔", crown2: "♕", deco1: "🎀", deco2: "🌸", deco3: "🍓", deco4: "🍓",
  deco5: "❤️‍🩹", deco6: "💖", deco7: "❉", deco8: "⁎", deco9: "❃", deco10: "✿",
  deco11: "✦", deco12: "★", deco13: "ᕯ", deco14: "♡", deco15: "დ", deco16: "ღ",
  deco17: "ღ", deco18: "❥", deco19: "➳", admin: "👑", user: "⭐"
};

module.exports = {
  config: {
    name: "admin",
    version: "2.0",
    author: "Washiq Adnan",
    countDown: 5,
    role: 2,
    shortDescription: { vi: "Quản lý admin", en: "Manage admin bot" },
    longDescription: { vi: "Thêm, xóa, liệt kê admin bot", en: "Add, remove, list admin bot" },
    category: "system",
    guide: {
      en: "{pn} [add | -a] <UID/Tag/Reply>\n{pn} [remove | -r] <UID/Tag>\n{pn} [list | -l]"
    }
  },

  onStart: async function ({ message, args, usersData, event }) {
    const { config } = global.GoatBot;
    if (!config.adminBot) config.adminBot = [];

    const action = args[0]?.toLowerCase();

    switch (action) {
      case "add":
      case "-a": {
        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else if (args.slice(1).length > 0) uids = args.slice(1).filter(id => !isNaN(id) && id.length > 5);

        if (uids.length === 0) return message.reply(`${symbols.deco5} ${fancy("Please provide a UID or Tag someone!")}`);

        let added = [];
        for (const uid of uids) {
          if (!config.adminBot.includes(uid)) {
            config.adminBot.push(uid);
            added.push(uid);
          }
        }

        if (added.length > 0) {
          writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
          let msg = `${symbols.deco6} ${fancy("Added Admin Success:")}\n`;
          for (const id of added) {
            const name = await usersData.getName(id);
            msg += `${symbols.admin} ${fancy(name)} ${symbols.deco7} ${fancy(id)}\n`;
          }
          return message.reply(msg);
        } else {
          return message.reply(`${symbols.deco5} ${fancy("User is already an admin!")}`);
        }
      }

      case "remove":
      case "-r": {
        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (args.slice(1).length > 0) uids = args.slice(1).filter(id => !isNaN(id) && id.length > 5);

        if (uids.length === 0) return message.reply(`${symbols.deco5} ${fancy("Please provide a UID to remove!")}`);

        let removed = [];
        for (const uid of uids) {
          if (config.adminBot.includes(uid)) {
            const index = config.adminBot.indexOf(uid);
            config.adminBot.splice(index, 1);
            removed.push(uid);
          }
        }

        if (removed.length > 0) {
          writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
          return message.reply(`${symbols.deco14} ${fancy("Removed admin role for")} ${fancy(removed.length)} ${fancy("users.")}`);
        } else {
          return message.reply(`${symbols.deco5} ${fancy("User is not in admin list!")}`);
        }
      }

      case "list":
      case "-l": {
        if (config.adminBot.length === 0) return message.reply(fancy("No admins found in config."));

        let listMsg = `${symbols.crown} ${fancy("ADMIN LIST")} ${symbols.crown2}\n${"━".repeat(15)}\n`;
        for (let i = 0; i < config.adminBot.length; i++) {
          const id = config.adminBot[i];
          const name = await usersData.getName(id);
          listMsg += `${symbols.deco11} ${fancy(i + 1)}. ${fancy(name)}\n${symbols.deco18} ${fancy(id)}\n\n`;
        }
        return message.reply(listMsg + "━".repeat(15));
      }

      default:
        return message.reply(`${symbols.deco11} ${fancy("Use: admin [add | remove | list]")}`);
    }
  }
};
    
