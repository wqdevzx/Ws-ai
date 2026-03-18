module.exports = {
  config: {
    name: "nickname",
    version: "1.0.4",
    author: "washiq",
    countDown: 2,
    role: 2, // Bot Owner only
    shortDescription: {
      en: "Change bot nickname (Owner Only)"
    },
    longDescription: {
      en: "Change the bot's nickname locally or globally. Restricted strictly to bot owners."
    },
    category: "owner",
    guide: {
      en: "{pn} <name> | {pn} all <name>"
    }
  },

  onStart: async function ({ api, event, args, threadsData, message }) {
    const { threadID, senderID } = event;
    const botID = api.getCurrentUserID();

    // STRICT OWNER CHECK: Only IDs in the adminBot config can run this
    if (!global.GoatBot.config.adminBot.includes(senderID)) {
      return message.reply("Access Denied: Only Washiq (Owner) can use this command.");
    }

    if (args.length === 0) {
      return message.reply("Please provide a name. Usage: nickname [all] <name>");
    }

    // Global Change logic
    if (args[0].toLowerCase() === 'all') {
      args.shift();
      const newNickname = args.join(' ');
      if (!newNickname) return message.reply("Provide a name for global update.");

      message.reply(`Updating all groups to: ${newNickname}`);

      const allThreads = await threadsData.getAll();
      let success = 0, fail = 0;

      for (const thread of allThreads) {
        if (thread.isGroup && thread.threadID) {
          try {
            await api.changeNickname(newNickname, thread.threadID, botID);
            success++;
            await new Promise(res => setTimeout(res, 800)); 
          } catch (e) {
            fail++;
          }
        }
      }
      return message.reply(`Global Update Done!\nSuccess: ${success}\nFailed: ${fail}`);
    } 
    
    // Local Change logic
    const newNickname = args.join(' ');
    try {
      await api.changeNickname(newNickname, threadID, botID);
      return message.reply(`Nickname set to: ${newNickname}`);
    } catch (err) {
      return message.reply("Failed to change nickname in this group.");
    }
  }
};
