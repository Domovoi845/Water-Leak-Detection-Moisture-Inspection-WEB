# Telegram Form Setup

The frontend does not contain the Telegram bot token.

## Netlify setup

1. Deploy this folder to Netlify.
2. In Netlify, open:
   Site settings -> Environment variables
3. Add:
   `BOT_TOKEN=your_new_token_from_BotFather`
4. The group chat id is already set in the backend function:
   `CHAT_ID=-5158715004`

The form posts to:

```text
/.netlify/functions/send-telegram
```

The backend function sends the message to Telegram using:

```text
netlify/functions/send-telegram.js
```

## Important

Opening `index.html` directly as a local `file://` page will show the form, but Telegram sending requires the Netlify backend function to be deployed or run with Netlify Dev.
