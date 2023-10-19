import express from "express";
import lusca from "lusca";
import clientRoutes from "./routes/routes";
import { setupBot } from "./utils/telegramBot";
import { twitterBot } from "./utils/twitterBot";
import dotenv from "dotenv"
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
if (botToken) setupBot(botToken);
// twitterBot()

export default app;
