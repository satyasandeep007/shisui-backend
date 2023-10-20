import express from "express";
import lusca from "lusca";
import clientRoutes from "./routes/routes";
import { setupBot } from "./utils/telegramBot";
import dotenv from "dotenv"
import TelegramBot from 'node-telegram-bot-api';

const path = require("path");
const envPath = path.join(__dirname, "../.env");
console.log(envPath, "envPath");

dotenv.config({ path: envPath });
const app = express();

app.set("port", 5000);

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(clientRoutes);

// Initialize the bot with your bot token
const botToken = process.env.TELEGRAM_BOT_TOKEN
export const tgBot = new TelegramBot(botToken, { polling: true });
if (botToken) setupBot(tgBot);

export default app;
