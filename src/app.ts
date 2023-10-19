import express from "express";
import lusca from "lusca";
import flash from "express-flash";
import clientRoutes from "./routes/routes";
import { setupBot } from "./utils/telegramBot";

const app = express();

app.set("port", 5000);

app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(clientRoutes);

// Initialize the bot with your bot token
const botToken = '6827187794:AAHtKnrS7NS2skercYFbWj94lIMxpzls0tA'; // Replace with your actual bot token
setupBot(botToken);

export default app;
