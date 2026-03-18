const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "info",
        version: "3.5",
        author: "Washiq Adnan",
        countDown: 5,
        role: 0,
        shortDescription: "Premium Admin Info Card with precise layout",
        category: "info",
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        
        // তুমি যে লিংকগুলো দিয়েছ:
        const botImgUrl = "https://files.catbox.moe/9341tn.jpg"; // Raha AI
        const adminsImgUrl = "https://files.catbox.moe/fvg5xo.jpg"; // Owner and Operator jointly
        
        const bgColor = "#0A0D14"; 

        try {
            api.setMessageReaction("⏳", messageID, () => {}, true);

            const canvas = createCanvas(1200, 1600);
            const ctx = canvas.getContext("2d");

            // ব্যাকগ্রাউন্ড ড্র করা
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // টেক্সট ড্র করার ফাংশন (উন্নত বর্ডার ও গ্লো সহ)
            const drawText = (text, x, y, font, color, align = "left", weight = "normal", shadowColor = null, shadowBlur = 0) => {
                ctx.font = `${weight} ${font}`;
                ctx.fillStyle = color;
                ctx.textAlign = align;
                if (shadowColor && shadowBlur > 0) {
                    ctx.save();
                    ctx.shadowColor = shadowColor;
                    ctx.shadowBlur = shadowBlur;
                    ctx.fillText(text, x, y);
                    ctx.restore();
                } else {
                    ctx.fillText(text, x, y);
                }
            };

            // গোল করে ছবি ড্র করার উন্নত ফাংশন
            const drawCircleImage = async (url, x, y, radius, borderColor, borderWidth, shadowColor, shadowBlur) => {
                const img = await loadImage(url);
                
                // বর্ডার ও গ্লো ড্র করা
                if (borderWidth > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x, y, radius + borderWidth, 0, Math.PI * 2, true);
                    ctx.fillStyle = shadowColor;
                    ctx.shadowColor = shadowColor;
                    ctx.shadowBlur = shadowBlur;
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.arc(x, y, radius + (borderWidth / 2), 0, Math.PI * 2, true);
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    ctx.shadowColor = null;
                    ctx.shadowBlur = 0;
                    ctx.stroke();
                    ctx.restore();
                }

                // ছবি ক্লিপ করা ও ড্র করা
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                
                const aspect = img.width / img.height;
                let drawWidth, drawHeight;
                if (aspect > 1) {
                    drawHeight = radius * 2;
                    drawWidth = drawHeight * aspect;
                } else {
                    drawWidth = radius * 2;
                    drawHeight = drawWidth / aspect;
                }
                
                ctx.drawImage(img, x - (drawWidth / 2), y - (drawHeight / 2), drawWidth, drawHeight);
                ctx.restore();
            };

            // --- লেআউট সেকশন ---

            // ১. রাহা এআই (বট) সেকশন - উপরে (এটি ওনারদের ছবির চেয়ে ছোট হবে)
            await drawCircleImage(botImgUrl, 600, 220, 160, "#9B59B6", 10, "#7A418A", 15); // বটের ছবির রেডিয়াস ১৬০
            drawText("RAHA AI SYSTEM", 600, 480, "80px Arial", "#ffffff", "center", "bold", "#9B59B6", 15);
            drawText("Version: 1.5 | Status: Active", 600, 540, "30px Arial", "#B1B8C0", "center");

            // ২. অ্যাডমিন/ওনার (যৌথ ছবি) সেকশন - মাঝখানে (এটি বটের ছবির চেয়ে বড় হবে)
            await drawCircleImage(adminsImgUrl, 600, 880, 260, "#3498DB", 15, "#25689E", 25); // ওনারদের ছবির রেডিয়াস ২৬০

            // ৩. তথ্য সেকশন - ছবির নিচে আলাদা আলাদা তথ্য
            const detailsStartX = 200;
            const detailsStartY = 1220;
            const lineHeight = 45;

            // অ্যাডমিন ১: WASHIQ ADNAN (অপারেটর)
            drawText("WASHIQ ADNAN", detailsStartX, detailsStartY, "50px Arial", "#2ECC71", "left", "bold", "#2ECC71", 10);
            drawText("• Role: Operator / Developer", detailsStartX, detailsStartY + lineHeight + 10, "32px Arial", "#ffffff");
            drawText("• Age: 18+", detailsStartX, detailsStartY + (lineHeight * 2) + 20, "28px Arial", "#B1B8C0");
            drawText("• Edu: HSC 2nd year", detailsStartX, detailsStartY + (lineHeight * 3) + 30, "28px Arial", "#B1B8C0");
            drawText("• Loc: Dinajpur, BD", detailsStartX, detailsStartY + (lineHeight * 4) + 40, "28px Arial", "#B1B8C0");

            // অ্যাডমিন ২: SIMRAN (মালিক)
            const detailsStartX2 = 700;
            drawText("SIMRAN", detailsStartX2, detailsStartY, "50px Arial", "#3498DB", "left", "bold", "#3498DB", 10);
            drawText("• Role: Bot Owner", detailsStartX2, detailsStartY + lineHeight + 10, "32px Arial", "#ffffff");
            drawText("• Age: 21+", detailsStartX2, detailsStartY + (lineHeight * 2) + 20, "28px Arial", "#B1B8C0");
            drawText("• Edu: Honours 3rd year", detailsStartX2, detailsStartY + (lineHeight * 3) + 30, "28px Arial", "#B1B8C0");
            drawText("• Loc: Pabna, BD", detailsStartX2, detailsStartY + (lineHeight * 4) + 40, "28px Arial", "#B1B8C0");

            // ফুটনোট
            drawText("Powered by Raha AI Team", 600, 1550, "24px Arial", "#4E5760", "center");

            const imagePath = path.join(__dirname, "cache", `info_${threadID}.png`);
            const out = fs.createWriteStream(imagePath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            
            out.on('finish', async () => {
                await api.sendMessage({
                    body: "RAHA AI SYSTEM INFORMATION",
                    attachment: fs.createReadStream(imagePath)
                }, threadID, () => fs.unlinkSync(imagePath), messageID);
                api.setMessageReaction("✅", messageID, () => {}, true);
            });

        } catch (e) {
            console.error(e);
            api.sendMessage("ক্যানভাস ফাইলটি তৈরি করতে সমস্যা হয়েছে।", threadID, messageID);
            api.setMessageReaction("❌", messageID, () => {}, true);
        }
    }
};
                              
