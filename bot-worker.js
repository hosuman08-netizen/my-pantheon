/**
 * My Pantheon — Telegram bot webhook worker (Cloudflare)
 * Decorates the bare /start into a branded welcome: hero image + evocative copy + "Open My Pantheon" web_app button.
 * Deploy: wrangler deploy -c wrangler-bot.toml  (secret: BOT_TOKEN)
 * Then set webhook (see BOT-DECOR-SETUP.md).
 *
 * Env:
 *   BOT_TOKEN   — from BotFather (secret)
 *   WEBHOOK_SECRET — optional path secret to reject spoofed calls
 */

const WEBAPP_URL = 'https://hosuman08-netizen.github.io/my-pantheon/';
// Bot medallion image (served from GitHub Pages so Telegram can fetch it).
const HERO_IMAGE = 'https://hosuman08-netizen.github.io/my-pantheon/art/icon-bot-premium.jpg';

const WELCOME_CAPTION =
  '🪷 <b>My Pantheon</b>\n' +
  '<i>Build your Echoes. Write dharma. Grow karma.</i>\n\n' +
  'Forge your own legends inspired by the ancient epics — every story you write becomes an Echo that lives in your clan.\n\n' +
  '✨ <b>Tap below to begin your Pantheon.</b>\n\n' +
  '<i>Fictional stories inspired by myth — no real deities. 100% free to start.</i>';

// 채널 귀속 허용목록 — script.js P2_SRC_ALLOW 와 동일 유지.
const P2_SRC_ALLOW = ['reddit','x','wa','insta','discord','quora','yt','tg','fb','direct','other'];
// /start 딥링크 payload("c-reddit" / "c-reddit-r-<uid>")를 안전한 startapp 태그로 재구성(백업 귀속).
function buildStartTag(payload) {
  const raw = String(payload || '').trim();
  if (raw.indexOf('c-') !== 0) return '';
  const rest = raw.slice(2), ri = rest.indexOf('-r-');
  let channel = ri >= 0 ? rest.slice(0, ri) : rest;
  let ref = ri >= 0 ? rest.slice(ri + 3) : '';
  channel = channel.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
  if (!channel || P2_SRC_ALLOW.indexOf(channel) < 0) channel = 'other';
  ref = ref.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);
  return 'c-' + channel + (ref ? '-r-' + ref : '');
}
function openButton(startTag) {
  const url = startTag ? WEBAPP_URL + '?startapp=' + encodeURIComponent(startTag) : WEBAPP_URL;
  return { text: '✨ Open My Pantheon', web_app: { url } };
}
const OPEN_BUTTON = openButton('');

const CMD_REPLIES = {
  '/create': '⚒️ <b>Build your clan</b> — open the app and forge your first Echo hero. Every hero carries a virtue.',
  '/share':  '📜 <b>Spread your story</b> — write positive dharma lore and share it to grow your clan\'s karma.',
  '/festival': '🎉 <b>Festivals</b> — seasonal clan challenges. Open the app to see what\'s live now.',
};

async function tg(token, method, payload) {
  return fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

async function sendWelcome(token, chatId, startTag) {
  // Try a rich photo welcome; fall back to text if the image can't be fetched.
  const kb = { inline_keyboard: [[openButton(startTag)]] };
  const photoRes = await tg(token, 'sendPhoto', {
    chat_id: chatId, photo: HERO_IMAGE, caption: WELCOME_CAPTION,
    parse_mode: 'HTML', reply_markup: kb,
  });
  if (!photoRes.ok) {
    await tg(token, 'sendMessage', {
      chat_id: chatId, text: WELCOME_CAPTION, parse_mode: 'HTML',
      reply_markup: kb, disable_web_page_preview: true,
    });
  }
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('My Pantheon bot', { status: 200 });
    // Optional spoof guard: Telegram sends this header if a secret_token was set on the webhook.
    if (env.WEBHOOK_SECRET) {
      const got = request.headers.get('x-telegram-bot-api-secret-token');
      if (got !== env.WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
    }
    const token = env.BOT_TOKEN;
    if (!token) return new Response('no token', { status: 500 });

    let update;
    try { update = await request.json(); } catch (e) { return new Response('bad json', { status: 400 }); }

    const msg = update.message || update.edited_message;
    if (msg && msg.chat && msg.text) {
      const chatId = msg.chat.id;
      const text = msg.text.trim();
      const cmd = text.split(/\s+/)[0].toLowerCase().replace(/@.*$/, '');
      if (cmd === '/start') {
        const startTag = buildStartTag(text.split(/\s+/)[1] || '');  // "/start c-reddit" → 백업귀속
        await sendWelcome(token, chatId, startTag);
      } else if (CMD_REPLIES[cmd]) {
        await tg(token, 'sendMessage', {
          chat_id: chatId, text: CMD_REPLIES[cmd], parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [[OPEN_BUTTON]] },
        });
      } else {
        // Any other message → gentle nudge back into the app.
        await tg(token, 'sendMessage', {
          chat_id: chatId, text: '🪷 Your Pantheon is waiting.',
          reply_markup: { inline_keyboard: [[OPEN_BUTTON]] },
        });
      }
    }
    return new Response('ok', { status: 200 });
  },
};
