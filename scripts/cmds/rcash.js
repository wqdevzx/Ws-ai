module.exports = {
  config: {
    name: "Rcash",
    aliases: ["rcash", "rc", "sendcash", "transfer"],
    version: "2.3.0",
    author: "Washiq",
    countDown: 5,
    role: 0,
    description: "Transfer money via reply / mention / UID (auto prefix detect)",
    category: "economy",
    guide: "{pn} 100 (reply)\n{pn} @mention 100\n{pn} @mention-100\n{pn} 100 <uid>"
  },

  onStart: async function ({ message, event, args, usersData }) {
    const senderID = event.senderID;

    // ✅ Auto prefix detect
    const getPrefix = (threadID) => {
      // If bot has helper
      try {
        if (global.utils && typeof global.utils.getPrefix === "function") {
          return global.utils.getPrefix(threadID) || "";
        }
      } catch (_) {}

      // Common config locations
      const cfg = global.GoatBot?.config || global.config || {};
      const p =
        cfg.prefix ??
        cfg.PREFIX ??
        global.GoatBot?.prefix ??
        global.PREFIX ??
        "";

      if (Array.isArray(p) && p.length) return String(p[0]);
      return String(p || "");
    };

    const prefix = getPrefix(event.threadID) || "";

    // ---------- Find receiver ----------
    let receiverID = null;

    // 1) Reply mode
    if (event.messageReply?.senderID) receiverID = event.messageReply.senderID;

    // 2) Mention mode
    if (!receiverID && event.mentions && Object.keys(event.mentions).length > 0) {
      receiverID = Object.keys(event.mentions)[0];
    }

    // 3) UID mode (any long number in args)
    if (!receiverID) {
      // Prefer last numeric chunk like a UID (>= 6 digits)
      const possibleUID = [...args].reverse().find((a) => /^\d{6,}$/.test(a));
      if (possibleUID) receiverID = possibleUID;
    }

    if (!receiverID) {
      return message.reply(
        "💡 𝗨𝘀𝗮𝗴𝗲 𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝘁𝗶𝗼𝗻𝘀:\n\n" +
          `↪️ 𝗥𝗲𝗽𝗹𝘆: ${prefix}Rcash 100\n` +
          `🏷️ 𝗠𝗲𝗻𝘁𝗶𝗼𝗻: ${prefix}Rcash @user 100  𝗢𝗥  ${prefix}Rcash @user-100\n` +
          `🆔 𝗨𝗜𝗗: ${prefix}Rcash 100 <uid>`
      );
    }

    if (receiverID === senderID) {
      return message.reply("⚠️ 𝗬𝗼𝘂 𝗰𝗮𝗻𝗻𝗼𝘁 𝘁𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗺𝗼𝗻𝗲𝘆 𝘁𝗼 𝘆𝗼𝘂𝗿𝘀𝗲𝗹𝗳! 🛑");
    }

    // ---------- Parse amount ----------
    // support "@user-100"
    let amount = null;
    const body = event.body || "";

    const dashMatch = body.match(/-(\d+)\b/);
    if (dashMatch) amount = parseInt(dashMatch[1], 10);

    // otherwise: first pure number in args
    if (!amount) {
      const numArg = args.find((a) => /^\d+$/.test(a));
      if (numArg) amount = parseInt(numArg, 10);
    }

    if (!amount || amount <= 0) {
      return message.reply(
        "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗔𝗺𝗼𝘂𝗻𝘁!\n" +
          "💡 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿.\n\n" +
          `📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${prefix}Rcash @user-100`
      );
    }

    // ---------- Load balances ----------
    let senderMoney = await usersData.get(senderID, "money");
    let receiverMoney = await usersData.get(receiverID, "money");

    if (typeof senderMoney !== "number") senderMoney = 0;
    if (typeof receiverMoney !== "number") receiverMoney = 0;

    if (amount > senderMoney) {
      return message.reply(
        "🚫 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗙𝗮𝗶𝗹𝗲𝗱!\n" +
        "💸 𝗜𝗻𝘀𝘂𝗳𝗳𝗶𝗰𝗶𝗲𝗻𝘁 𝗯𝗮𝗹𝗮𝗻𝗰𝗲.\n" +
        `👛 𝗬𝗼𝘂𝗿 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${senderMoney} 💲`
      );
    }

    // ---------- Transfer ----------
    const newSenderMoney = senderMoney - amount;
    const newReceiverMoney = receiverMoney + amount;

    await usersData.set(senderID, { money: newSenderMoney });
    await usersData.set(receiverID, { money: newReceiverMoney });

    // ---------- Success message (English + Fancy) ----------
    return message.reply(
      "✅ 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹! 🎉\n" +
      "━━━━━━━━━━━━━━━\n" +
      `💸 𝗔𝗺𝗼𝘂𝗻𝘁 𝗦𝗲𝗻𝘁: ${amount} 💲\n` +
      `🏦 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${newSenderMoney} 💲\n` +
      "━━━━━━━━━━━━━━━\n" +
      "✨ 𝗥𝗮𝗵𝗮 𝗕𝗮𝗻𝗸 𝗦𝗲𝗿𝘃𝗶𝗰𝗲𝘀 💳"
    );
  }
};
