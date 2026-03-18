const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// font + cache
const fontDir = path.join(__dirname, "assets", "font");
const cacheDir = path.join(__dirname, "cache");

try {
  if (fs.existsSync(path.join(fontDir, "NotoSans-Bold.ttf"))) {
    registerFont(path.join(fontDir, "NotoSans-Bold.ttf"), { family: "NotoSans", weight: "bold" });
  }
  if (fs.existsSync(path.join(fontDir, "NotoSans-SemiBold.ttf"))) {
    registerFont(path.join(fontDir, "NotoSans-SemiBold.ttf"), { family: "NotoSans", weight: "600" });
  }
  if (fs.existsSync(path.join(fontDir, "NotoSans-Regular.ttf"))) {
    registerFont(path.join(fontDir, "NotoSans-Regular.ttf"), { family: "NotoSans", weight: "normal" });
  }
  if (fs.existsSync(path.join(fontDir, "BeVietnamPro-Bold.ttf"))) {
    registerFont(path.join(fontDir, "BeVietnamPro-Bold.ttf"), { family: "BeVietnamPro", weight: "bold" });
  }
  if (fs.existsSync(path.join(fontDir, "BeVietnamPro-SemiBold.ttf"))) {
    registerFont(path.join(fontDir, "BeVietnamPro-SemiBold.ttf"), { family: "BeVietnamPro", weight: "600" });
  }
} catch (e) {
  console.log("BalanceCard: Using fallback fonts");
}

const CURRENCY_SYMBOL = "$";

function formatMoneyShort(n) {
  if (n < 1000) return n;
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
  if (n >= 1e9) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return +(n / 1e3).toFixed(1) + "k";
  return n;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function getProfilePicture(uid) {
  try {
    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(avatarURL, { responseType: "arraybuffer", timeout: 10000 });
    return await loadImage(Buffer.from(response.data));
  } catch (error) {
    return null;
  }
}

// Updated Default Avatar Design (Matching Premium Gold Theme)
function drawDefaultAvatar(ctx, x, y, size) {
  const gradient = ctx.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);
  gradient.addColorStop(0, "#4b4b4b"); // Dark Grey
  gradient.addColorStop(1, "#1c1c1c"); // Almost Black
  
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.fillStyle = "#d4af37"; // Gold
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2 - 15, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size / 2 + 45, 45, 35, 0, Math.PI, 0, true);
  ctx.fill();
}

// Function for drawing a realistic Contactless (Wi-Fi like) icon
function drawContactlessIcon(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(x, y, i * 6, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
  }
  ctx.restore();
}

// NEW: Premium Luxury Black & Gold Card Design
async function createBalanceCard(userData, userID, balance) {
  const width = 950;
  const height = 520;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const displayBalance = formatMoneyShort(balance);

  // 1. Background Base (Obsidian Dark)
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, "#0f0f11"); // Rich Dark
  bgGradient.addColorStop(0.5, "#1a1a24"); // Deep Grey-Blue
  bgGradient.addColorStop(1, "#050505"); // Pitch Black

  drawRoundedRect(ctx, 0, 0, width, height, 30);
  ctx.clip(); // Clip all drawing inside the card shape
  ctx.fillStyle = bgGradient;
  ctx.fill();

  // 2. Premium Frosted Glass / Light Reflection Effect
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, height * 0.4);
  ctx.bezierCurveTo(width * 0.4, height * 0.1, width * 0.6, height * 0.9, width, height * 0.3);
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  
  const glassGrad = ctx.createLinearGradient(0, 0, width, height);
  glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
  glassGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glassGrad;
  ctx.fill();
  ctx.restore();

  // 3. Subtle Texture (Premium Dot Matrix)
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  for (let x = 0; x < width; x += 30) {
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Border (Platinum/Gold Mix)
  const borderGrad = ctx.createLinearGradient(0, 0, width, height);
  borderGrad.addColorStop(0, "rgba(212, 175, 55, 0.5)"); // Gold
  borderGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
  borderGrad.addColorStop(1, "rgba(212, 175, 55, 0.5)");
  
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 2, 2, width - 4, height - 4, 28);
  ctx.stroke();

  // 5. Draw Realistic Smart Chip
  const chipX = 50, chipY = 120;
  drawRoundedRect(ctx, chipX, chipY, 65, 50, 8);
  const chipGradient = ctx.createLinearGradient(chipX, chipY, chipX + 65, chipY + 50);
  chipGradient.addColorStop(0, "#e6c27a"); // Light Gold
  chipGradient.addColorStop(0.5, "#d4af37"); // Solid Gold
  chipGradient.addColorStop(1, "#996515"); // Dark Gold
  
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = chipGradient;
  ctx.fill();
  ctx.shadowBlur = 0; // reset shadow
  
  // Chip inner details
  ctx.strokeStyle = "rgba(50, 30, 0, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(chipX + 20, chipY); ctx.lineTo(chipX + 20, chipY + 50);
  ctx.moveTo(chipX + 45, chipY); ctx.lineTo(chipX + 45, chipY + 50);
  ctx.moveTo(chipX, chipY + 25); ctx.lineTo(chipX + 65, chipY + 25);
  ctx.moveTo(chipX + 20, chipY + 15); ctx.lineTo(chipX + 45, chipY + 15);
  ctx.moveTo(chipX + 20, chipY + 35); ctx.lineTo(chipX + 45, chipY + 35);
  ctx.stroke();

  // Contactless Icon beside Chip
  drawContactlessIcon(ctx, chipX + 90, chipY + 25);

  // 6. Header Text (RAHA BANK)
  ctx.save();
  const bankGrad = ctx.createLinearGradient(50, 50, 250, 50);
  bankGrad.addColorStop(0, "#bf953f");
  bankGrad.addColorStop(0.5, "#fcf6ba");
  bankGrad.addColorStop(1, "#b38728");
  
  ctx.fillStyle = bankGrad;
  ctx.font = 'bold 38px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.shadowColor = "rgba(212, 175, 55, 0.3)";
  ctx.shadowBlur = 15;
  ctx.fillText("RAHA BANK", 50, 75);
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.font = '600 14px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.letterSpacing = "2px";
  ctx.fillText("WORLD ELITE", 50, 95);

  // 7. Balance Section
  ctx.font = '600 15px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText("AVAILABLE BALANCE", 50, 230);

  // Balance Main Text (Huge & Crisp)
  ctx.save();
  const balanceGradient = ctx.createLinearGradient(50, 240, 450, 300);
  balanceGradient.addColorStop(0, "#ffffff");
  balanceGradient.addColorStop(1, "#e0e0e0"); 
  ctx.fillStyle = balanceGradient;
  ctx.font = 'bold 75px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
  ctx.shadowBlur = 20;
  ctx.fillText(`${CURRENCY_SYMBOL}${displayBalance}`, 48, 295);
  ctx.restore();

  // 8. User ID (Formatted like Account Number) & Valid Thru
  ctx.font = '600 13px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("ACCOUNT / USER ID", 50, 380);
  ctx.fillText("VALID THRU", 350, 380);

  ctx.font = 'bold 22px "NotoSans", "BeVietnamPro", monospace';
  ctx.fillStyle = "#d4af37"; // Gold for numbers
  // Formatting UID to look like a spaced card number
  let spacedUID = String(userID).match(/.{1,4}/g)?.join(" ") || userID;
  ctx.fillText(spacedUID, 50, 410);
  ctx.fillText("12/30", 350, 410);

  // 9. Card Holder
  ctx.font = '600 13px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("CARD HOLDER", 50, 465);

  ctx.font = 'bold 24px "NotoSans", "BeVietnamPro", sans-serif';
  ctx.fillStyle = "#ffffff";
  const displayName = (userData.name || "Unknown").toUpperCase().slice(0, 22);
  ctx.fillText(displayName, 50, 495);

  // 10. Mock Payment Network Logo (Bottom Right)
  ctx.globalCompositeOperation = "screen";
  ctx.beginPath();
  ctx.arc(840, 470, 22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(212, 175, 55, 0.8)"; // Gold
  ctx.fill();
  ctx.beginPath();
  ctx.arc(870, 470, 22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(200, 200, 200, 0.6)"; // Silver/Platinum
  ctx.fill();
  ctx.globalCompositeOperation = "source-over"; // reset

  // 11. Avatar Design
  const profilePic = await getProfilePicture(userID);
  const picSize = 135;
  const picX = width - picSize - 55; 
  const picY = 50;

  // Avatar Luxury Gold Rings
  ctx.save();
  for (let i = 15; i > 0; i--) {
    ctx.beginPath();
    ctx.arc(picX + picSize / 2, picY + picSize / 2, picSize / 2 + i, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${0.015 * i})`; // Gold Glow
    ctx.fill();
  }
  ctx.restore();

  if (profilePic) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(picX + picSize / 2, picY + picSize / 2, picSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profilePic, picX, picY, picSize, picSize);
    ctx.restore();
  } else {
    drawDefaultAvatar(ctx, picX, picY, picSize);
  }

  // Avatar Solid Border (Platinum)
  ctx.beginPath();
  ctx.arc(picX + picSize / 2, picY + picSize / 2, picSize / 2, 0, Math.PI * 2);
  ctx.strokeStyle = "#e5e4e2"; // Platinum color
  ctx.lineWidth = 4;
  ctx.stroke();

  // Avatar Status Indicator (Emerald)
  const statusX = picX + picSize - 18;
  const statusY = picY + picSize - 18;
  ctx.beginPath();
  ctx.arc(statusX, statusY, 14, 0, Math.PI * 2);
  ctx.fillStyle = "#10b981"; 
  ctx.fill();
  ctx.strokeStyle = "#050505";
  ctx.lineWidth = 4;
  ctx.stroke();

  return canvas.toBuffer("image/png");
}

module.exports = {
  config: {
    name: "bal",
    aliases: ["wallet", "balance"],
    version: "14.0.0",
    author: "Neoaz x Washiq",
    countDown: 5,
    role: 0,
    description: "Canvas Balance Card (uses usersData money)",
    category: "economy",
    guide: "{pn}"
  },

  onStart: async function ({ message, event, usersData }) {
    try {
      message.reaction("⏳", event.messageID);
      await fs.ensureDir(cacheDir);

      let targetID = event.senderID;
      if (event.messageReply) targetID = event.messageReply.senderID;
      else if (Object.keys(event.mentions).length > 0) targetID = Object.keys(event.mentions)[0];

      const userData = await usersData.get(targetID);

      // ✅ ONLY usersData money (persisted by GoatBot)
      const balance = (await usersData.get(targetID, "money")) || 0;

      const buffer = await createBalanceCard(userData, targetID, balance);
      const imagePath = path.join(cacheDir, `bal_${targetID}.png`);
      await fs.writeFile(imagePath, buffer);

      await message.reply({
        body: `${userData.name}\nBalance: ${CURRENCY_SYMBOL}${Number(balance).toLocaleString()}`,
        attachment: fs.createReadStream(imagePath)
      });

      message.reaction("✅", event.messageID);
      setTimeout(() => fs.unlink(imagePath).catch(() => {}), 5000);
    } catch (error) {
      console.error(error);
      message.reply("Error!");
    }
  }
};
