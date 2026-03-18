const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

// ফ্যান্সি ফন্ট ফাংশন
const fancy = (str) => {
  const map = {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝑱', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return String(str).split('').map(c => map[c] || c).join('');
};

// আপনার দেওয়া ইমোজি সিম্বলগুলো
const symbols = {
  // ডেকোরেশন সিম্বল
  deco1: "🎀",
  deco2: "🌸", 
  deco3: "🍓",
  deco4: "🍓",
  deco5: "❤️‍🩹",
  deco6: "💖",
  deco7: "❉",
  deco8: "⁎",
  deco9: "❃",
  deco10: "✿",
  deco11: "✦",
  deco12: "★",
  deco13: "ᕯ",
  deco14: "♡",
  deco15: "დ",
  deco16: "ღ",
  deco17: "ღ",
  deco18: "❥",
  deco19: "➳"
};

module.exports = {
  config: {
    name: "developer",
    aliases: ["dev"],
    version: "1.0",
    author: "NeoKEX",
    countDown: 5,
    role: 4,
    description: {
      vi: "Thêm, xóa, sửa quyền developer",
      en: "Add, remove, edit developer role"
    },
    category: "owner",
    guide: {
      vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền developer cho người dùng'
        + '\n     {pn} [remove | -r] <uid | @tag>: Xóa quyền developer của người dùng'
        + '\n     {pn} [list | -l]: Liệt kê danh sách developers',
      en: '   {pn} [add | -a] <uid | @tag>: Add developer role for user'
        + '\n     {pn} [remove | -r] <uid | @tag>: Remove developer role of user'
        + '\n     {pn} [list | -l]: List all developers'
    }
  },

  langs: {
    vi: {
      added: `${symbols.deco6} ${fancy("Đã thêm quyền developer cho")} %1 ${fancy("người dùng:")}\n%2 ${symbols.deco10}`,
      alreadyDev: `\n${symbols.deco5} %1 ${fancy("người dùng đã có quyền developer từ trước rồi:")}\n%2`,
      missingIdAdd: `${symbols.deco5} ${fancy("Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền developer")} ${symbols.deco8}`,
      removed: `${symbols.deco6} ${fancy("Đã xóa quyền developer của")} %1 ${fancy("người dùng:")}\n%2 ${symbols.deco14}`,
      notDev: `${symbols.deco5} %1 ${fancy("người dùng không có quyền developer:")}\n%2`,
      missingIdRemove: `${symbols.deco5} ${fancy("Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền developer")} ${symbols.deco18}`,
      listDev: `${symbols.deco1} ${symbols.deco2} ${symbols.deco3} ${fancy("Danh sách developers:")} ${symbols.deco4} ${symbols.deco6}\n%1`
    },
    en: {
      added: `${symbols.deco6} ${fancy("Added developer role for")} %1 ${fancy("users:")}\n%2 ${symbols.deco10}`,
      alreadyDev: `\n${symbols.deco5} %1 ${fancy("users already have developer role:")}\n%2`,
      missingIdAdd: `${symbols.deco5} ${fancy("Please enter ID or tag user to add developer role")} ${symbols.deco8}`,
      removed: `${symbols.deco6} ${fancy("Removed developer role of")} %1 ${fancy("users:")}\n%2 ${symbols.deco14}`,
      notDev: `${symbols.deco5} %1 ${fancy("users don't have developer role:")}\n%2`,
      missingIdRemove: `${symbols.deco5} ${fancy("Please enter ID or tag user to remove developer role")} ${symbols.deco18}`,
      listDev: `${symbols.deco1} ${symbols.deco2} ${symbols.deco3} ${fancy("List of developers:")} ${symbols.deco4} ${symbols.deco6}\n%1`
    }
  },

  onStart: async function ({ message, args, usersData, event, getLang }) {
    if (!config.devUsers)
      config.devUsers = [];

    switch (args[0]) {
      case "add":
      case "-a": {
        if (args[1] || Object.keys(event.mentions).length > 0 || event.messageReply) {
          let uids = [];
          if (Object.keys(event.mentions).length > 0)
            uids = Object.keys(event.mentions);
          else if (event.messageReply)
            uids.push(event.messageReply.senderID);
          else
            uids = args.filter(arg => !isNaN(arg) && arg.length > 5);
          
          if (uids.length === 0) {
            return message.reply(getLang("missingIdAdd"));
          }
          
          const notDevIds = [];
          const devIds = [];
          for (const uid of uids) {
            if (config.devUsers.includes(uid))
              devIds.push(uid);
            else
              notDevIds.push(uid);
          }

          config.devUsers.push(...notDevIds);
          const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
          writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
          
          let response = "";
          if (notDevIds.length > 0) {
            const namesList = getNames
              .filter(item => notDevIds.includes(item.uid))
              .map(({ uid, name }) => `${symbols.deco14} ${fancy(name)} ${symbols.deco7} ${fancy(uid)} ${symbols.deco9}`)
              .join("\n");
            response += getLang("added", notDevIds.length, namesList);
          }
          
          if (devIds.length > 0) {
            const namesList = getNames
              .filter(item => devIds.includes(item.uid))
              .map(({ uid, name }) => `${symbols.deco14} ${fancy(name)} ${symbols.deco7} ${fancy(uid)} ${symbols.deco9}`)
              .join("\n");
            response += getLang("alreadyDev", devIds.length, namesList);
          }
          
          return message.reply(response || `${symbols.deco5} ${fancy("No changes made")} ${symbols.deco11}`);
        }
        else
          return message.reply(getLang("missingIdAdd"));
      }
      
      case "remove":
      case "-r": {
        if (args[1] || Object.keys(event.mentions).length > 0) {
          let uids = [];
          if (Object.keys(event.mentions).length > 0)
            uids = Object.keys(event.mentions);
          else
            uids = args.filter(arg => !isNaN(arg) && arg.length > 5);
          
          if (uids.length === 0) {
            return message.reply(getLang("missingIdRemove"));
          }
          
          const notDevIds = [];
          const devIds = [];
          for (const uid of uids) {
            if (config.devUsers.includes(uid))
              devIds.push(uid);
            else
              notDevIds.push(uid);
          }
          
          for (const uid of devIds)
            config.devUsers.splice(config.devUsers.indexOf(uid), 1);
          
          const getNames = await Promise.all(devIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
          writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
          
          let response = "";
          if (devIds.length > 0) {
            const namesList = getNames
              .map(({ uid, name }) => `${symbols.deco14} ${fancy(name)} ${symbols.deco7} ${fancy(uid)} ${symbols.deco9}`)
              .join("\n");
            response += getLang("removed", devIds.length, namesList);
          }
          
          if (notDevIds.length > 0) {
            const namesList = notDevIds.map(uid => `${symbols.deco14} ${fancy("Unknown")} ${symbols.deco7} ${fancy(uid)} ${symbols.deco9}`).join("\n");
            response += getLang("notDev", notDevIds.length, namesList);
          }
          
          return message.reply(response || `${symbols.deco5} ${fancy("No changes made")} ${symbols.deco11}`);
        }
        else
          return message.reply(getLang("missingIdRemove"));
      }
      
      case "list":
      case "-l": {
        if (config.devUsers.length === 0) {
          return message.reply(`${symbols.deco5} ${fancy("No developers found")} ${symbols.deco11}`);
        }
        
        const getNames = await Promise.all(config.devUsers.map(uid => 
          usersData.getName(uid).then(name => ({ uid, name }))
        ));
        
        // হেডার তৈরি করা
        const header = `${symbols.deco1} ${symbols.deco2} ${symbols.deco3} ${symbols.deco4} ${fancy("DEVELOPERS LIST")} ${symbols.deco6} ${symbols.deco10} ${symbols.deco14}\n`;
        
        // ডেভেলপার লিস্ট তৈরি করা
        const listText = getNames.map(({ uid, name }, index) => 
          `${symbols.deco11} ${index + 1}. ${fancy(name)} ${symbols.deco7} ${fancy(uid)} ${symbols.deco12} ${symbols.deco18}`
        ).join("\n");
        
        // ফুটার তৈরি করা - আপনার দেওয়া সব সিম্বল ব্যবহার করে
        const footer = `\n${symbols.deco19} ${symbols.deco16} ${symbols.deco15} ${symbols.deco13} ${symbols.deco8} ${symbols.deco9} ${symbols.deco10} ${symbols.deco17}`;
        
        return message.reply(header + listText + footer);
      }
      
      default:
        return message.SyntaxError();
    }
  }
};
