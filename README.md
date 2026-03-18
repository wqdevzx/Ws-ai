<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚡ WASHIQ ADNAN · Ws‑ai</title>
    <!-- Fonts & base styling -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(145deg, #0b0d14 0%, #141822 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            color: #eef3fc;
            padding: 2rem 1.5rem;
            position: relative;
        }

        /* subtle grid overlay */
        body::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(0, 210, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 210, 255, 0.02) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
        }

        .glass-panel {
            max-width: 1100px;
            width: 100%;
            background: rgba(18, 22, 32, 0.75);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(0, 210, 255, 0.18);
            border-radius: 3.5rem;
            padding: 3rem 2.5rem;
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 210, 255, 0.1) inset;
            transition: box-shadow 0.3s ease;
            position: relative;
            z-index: 10;
        }

        .glass-panel:hover {
            box-shadow: 0 35px 70px -10px rgba(0, 210, 255, 0.2), 0 0 0 1px rgba(0, 210, 255, 0.25) inset;
        }

        /* avatar + header section */
        .hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 2.5rem;
        }

        .avatar-frame {
            width: 170px;
            height: 170px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00d2ff, #ff0055, #7f00ff);
            padding: 4px;
            box-shadow: 0 15px 35px -5px #00d2ff55;
            margin-bottom: 1.8rem;
            transition: transform 0.25s ease;
        }

        .avatar-frame:hover {
            transform: scale(1.02);
        }

        .avatar-frame img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #0b0d14;
            background: #1e2434;
            display: block;
        }

        /* fallback if image unavailable — show neon letter */
        .avatar-frame img[alt] {
            background: linear-gradient(45deg, #0f1a2b, #1b253f);
            font-size: 3.5rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00d2ff;
            text-shadow: 0 0 10px cyan;
        }

        h1 {
            font-size: 3.8rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(120deg, #ffffff, #c0e4ff, #a0d0ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            line-height: 1.1;
            text-shadow: 0 0 12px rgba(0,210,255,0.3);
            margin-bottom: 0.3rem;
        }

        .subhead {
            font-size: 1.5rem;
            font-weight: 500;
            background: linear-gradient(135deg, #b0f0ff, #ff99cc);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-family: 'Space Mono', monospace;
            margin-bottom: 1rem;
            border-bottom: 2px dashed #2b354b;
            padding-bottom: 0.7rem;
            display: inline-block;
        }

        .badge-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            justify-content: center;
            margin: 1rem 0 2rem;
        }

        .badge {
            padding: 0.6rem 1.8rem;
            background: rgba(0, 30, 50, 0.7);
            border: 1px solid #00d2ff55;
            border-radius: 60px;
            font-weight: 600;
            font-size: 0.95rem;
            letter-spacing: 0.02em;
            backdrop-filter: blur(5px);
            color: #d2f0ff;
            box-shadow: 0 4px 12px #00000030;
            transition: 0.2s;
        }

        .badge:hover {
            border-color: #ff0055;
            background: #0f1a2f;
            box-shadow: 0 0 15px #ff005566;
        }

        .quote {
            font-family: 'Space Mono', monospace;
            font-size: 1.3rem;
            font-weight: 400;
            background: #0e121f;
            padding: 0.8rem 2.2rem;
            border-radius: 60px;
            border-left: 4px solid #00d2ff;
            border-right: 4px solid #ff0055;
            margin: 1.5rem 0 0.5rem;
            color: #b2d9ff;
            box-shadow: 0 0 20px #00d2ff22;
            display: inline-block;
        }

        /* project section */
        .project-head {
            font-size: 2.2rem;
            font-weight: 600;
            background: linear-gradient(145deg, #00d2ff, #ff7b9c);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .project-head span {
            font-size: 2.5rem;
        }

        .tech-tag {
            display: inline-block;
            background: #1f2a40;
            padding: 0.2rem 1.4rem;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: 600;
            border: 1px solid #ff005580;
            color: #ffb3c6;
            margin: 1rem 0 2rem;
            box-shadow: 0 0 12px #ff005533;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 2.5rem 0 2rem;
        }

        .feature-card {
            background: rgba(10, 15, 26, 0.7);
            border-radius: 2rem;
            padding: 1.8rem 1.8rem;
            border: 1px solid #2a354f;
            backdrop-filter: blur(8px);
            transition: all 0.2s;
            box-shadow: 0 18px 30px -18px black;
        }

        .feature-card:hover {
            border-color: #00d2ff;
            transform: translateY(-6px);
            box-shadow: 0 25px 30px -12px #00d2ff30;
        }

        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: inline-block;
            background: #1e293b;
            padding: 0.3rem 1rem;
            border-radius: 60px;
            border-left: 4px solid #00d2ff;
        }

        .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #ffffff;
        }

        .feature-card p {
            color: #b0c5e0;
            font-size: 1rem;
            line-height: 1.5;
            font-family: 'Space Mono', monospace;
        }

        .code-block {
            background: #070b15;
            padding: 1.8rem 2rem;
            border-radius: 2.2rem;
            border: 1px solid #00d2ff30;
            font-family: 'Space Mono', monospace;
            font-size: 1rem;
            margin: 2rem 0 2.2rem;
            box-shadow: 0 0 25px #00d2ff15;
        }

        .code-block pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #b7e0ff;
            font-weight: 500;
            text-shadow: 0 0 5px cyan;
        }

        .command-line {
            color: #ff9fca;
        }

        /* contact line */
        .contact-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem 2.5rem;
            justify-content: center;
            align-items: center;
            margin: 2.8rem 0 1rem;
            padding: 1.5rem 0 0.5rem;
            border-top: 2px solid #253044;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-size: 1.2rem;
            background: #0f172ab0;
            padding: 0.6rem 1.5rem;
            border-radius: 60px;
            border: 1px solid #3b4b68;
            backdrop-filter: blur(4px);
            transition: 0.2s;
        }

        .contact-item:hover {
            border-color: #00d2ff;
            background: #172032;
            box-shadow: 0 0 20px #00d2ff60;
        }

        .contact-item a {
            color: #d5eeff;
            text-decoration: none;
            font-weight: 500;
        }

        .contact-item a:hover {
            color: white;
            text-decoration: underline wavy #ff0055 1.5px;
        }

        .contact-icon {
            font-size: 1.8rem;
            line-height: 1;
        }

        .footer-note {
            font-size: 0.9rem;
            color: #5c6f93;
            margin-top: 2rem;
            text-align: center;
            border-top: 1px dashed #2f3b54;
            padding-top: 2rem;
        }

        .glow {
            text-shadow: 0 0 8px cyan, 0 0 18px #ff0055;
        }

        /* responsiveness */
        @media (max-width: 650px) {
            .glass-panel { padding: 2rem 1.5rem; }
            h1 { font-size: 2.6rem; }
            .subhead { font-size: 1.2rem; }
            .quote { font-size: 1rem; }
        }
    </style>
</head>
<body>
    <div class="glass-panel">
        <!-- header with avatar -->
        <div class="hero">
            <div class="avatar-frame">
                <!-- using official placeholder with fallback monogram -->
                <img src="https://i.imgur.com/4I4O6ni.jpeg" alt="WASHIQ ADNAN" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22170%22%20height%3D%22170%22%20viewBox%3D%220%200%20170%20170%22%3E%3Crect%20width%3D%22170%22%20height%3D%22170%22%20fill%3D%22%230e1622%22%2F%3E%3Ctext%20x%3D%2285%22%20y%3D%22115%22%20font-size%3D%2275%22%20text-anchor%3D%22middle%22%20fill%3D%22%2300d2ff%22%20font-family%3D%22monospace%22%20font-weight%3D%22bold%22%20filter%3D%22url(%23glow)%22%3EWA%3C%2Ftext%3E%3Cdefs%3E%3Cfilter%20id%3D%22glow%22%3E%3CfeGaussianBlur%20stdDeviation%3D%224%22%20result%3D%22coloredBlur%22%2F%3E%3CfeMerge%3E%3CfeMergeNode%20in%3D%22coloredBlur%22%2F%3E%3CfeMergeNode%20in%3D%22SourceGraphic%22%2F%3E%3C%2FfeMerge%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3C%2Fsvg%3E'">
            </div>
            <h1>⚡ WASHIQ ADNAN</h1>
            <div class="subhead">`Full-Stack Chatbot Architect | UI/UX Enthusiast`</div>

            <div class="badge-container">
                <span class="badge">📍 Dinajpur, BD</span>
                <span class="badge">🧠 Node.js v18+</span>
                <span class="badge">⚙️ GoatBot</span>
                <span class="badge">🖌️ Canvas API</span>
                <span class="badge">🚀 PM2</span>
            </div>

            <div class="quote">
                ✦ THINK FAST. BUILD CLEAN. DEPLOY BOLD. ✦
            </div>
        </div>

        <!-- Project : Ws-ai (RAHA Core) -->
        <div style="margin-top: 2.2rem;">
            <div class="project-head">
                <span>🌌</span> PROJECT: Ws-ai (The RAHA Core)
            </div>
            <p style="color: #b2d0f0; max-width: 800px; font-size: 1.1rem; margin-bottom: 0.8rem;">
                The <strong style="color:#00d2ff;">Ws-ai engine</strong> is a high‑performance Facebook Messenger automation framework built on the <strong>GoatBot</strong> architecture. It integrates advanced Node.js modules with a focus on aesthetic user interfaces.
            </p>
            <div class="tech-tag">
                🛠 Node.js · GoatBot · Canvas (3D cards) · PM2 · Hex‑glow
            </div>
        </div>

        <!-- core capabilities grid -->
        <div class="grid-2">
            <div class="feature-card">
                <div class="card-icon">⚡</div>
                <h3>Dynamic command suite</h3>
                <p><code style="color:#ff9acb;">song.js</code> · <code>pair.js</code> · <code>top.js</code> — custom‑coded modules with advanced middleware and real‑time response.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🎨</div>
                <h3>Visual excellence</h3>
                <p>Automated 3D user cards with custom hex‑glow effects. Canvas API generating high‑fidelity info cards.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⏳</div>
                <h3>24/7 Uptime</h3>
                <p>Configured on <strong>Nyxora Main Server</strong>. PM2 cluster mode ensures zero‑downtime deployment.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🧩</div>
                <h3>Advanced logic</h3>
                <p>Sophisticated debugging, modular script integration, and dynamic middleware pipelines.</p>
            </div>
        </div>

        <!-- deployment protocol (clean code block) -->
        <div class="code-block">
            <pre>
<span style="color:#5bc0ff;"># 🚀 DEPLOYMENT PROTOCOL</span>
<span class="command-line">git clone https://github.com/Washi-Dev07/Ws-ai.git</span>
<span class="command-line">cd Ws-ai</span>
<span class="command-line">npm install  <span style="color:#6f8fbb;"># provision dependencies</span></span>
<span class="command-line"><span style="color:#ffb86b;"># Authentication: update account.txt with valid session</span></span>
<span class="command-line">pm2 start index.js --name "washi-bot" --update-env</span>
<span class="command-line" style="color:#99e699;"># 🟢 online · stable · logging with pm2 monit</span>
            </pre>
        </div>

        <!-- Contact links: Facebook, WhatsApp, TikTok, GitHub (exactly as specified) -->
        <div class="contact-bar">
            <div class="contact-item">
                <span class="contact-icon">📘</span>
                <a href="https://www.facebook.com/share/1FP8A27gC1/" target="_blank" rel="noopener">Facebook</a>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📱</span>
                <a href="https://wa.me/8801340975547" target="_blank" rel="noopener">WhatsApp +8801340975547</a>
            </div>
            <div class="contact-item">
                <span class="contact-icon">🎵</span>
                <a href="https://tiktok.com/@adnansvoice101" target="_blank" rel="noopener">TikTok @adnansvoice101</a>
            </div>
            <div class="contact-item">
                <span class="contact-icon">🐙</span>
                <a href="https://github.com/Washi-Dev07" target="_blank" rel="noopener">GitHub Washi-Dev07</a>
            </div>
        </div>

        <!-- additional note with wp fb tt git summary -->
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; font-family: 'Space Mono', monospace; margin: 1rem 0;">
            <span style="background:#00000030; padding:0.3rem 1.2rem; border-radius:30px; border:1px solid #00d2ff;">📲 FB / WP / TT / GIT</span>
            <span style="background:#00000030; padding:0.3rem 1.2rem; border-radius:30px; border:1px solid #ff0055;">#Ws-ai #RAHA #GoatBot</span>
        </div>

        <!-- footer signoff -->
        <div class="footer-note">
            <span>✦ Crafting next‑gen automated experiences with precision and style ✦</span><br>
            <span style="color:#3f5579;">© WASHIQ ADNAN · Nyxora Main Server · 2025</span>
        </div>
    </div>
</body>
</html>
