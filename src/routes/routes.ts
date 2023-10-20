import { addUserOtp, getMessageReactionsById, getUserOtpById } from "../controllers/firebase";
import { tgBot } from "../app";

const routes = require("express").Router();

routes.get("/", (req: any, res: any) => {
    res.send("ohio !");
});

routes.get("/verify/:telegramId", async (req: any, res: any) => {
    const { telegramId } = req.params
    const docs = await getMessageReactionsById(telegramId)

    console.log("Verfied!" + telegramId);
    const isUserExists = docs.length > 0
    // Todo send message to the user to verify
    if (!isUserExists) return res.json({ success: false, message: "User does not exist" })
    const userChatId = docs[0].userId
    if (userChatId) {
        const otp = Math.floor(1000 + Math.random() * 9000)
        const messageText = `Here is your otp ${otp}`
        await tgBot.sendMessage(userChatId, messageText);
        addUserOtp({ userTelegramId: telegramId, otp })
        return res.json({
            success: true,
            data: "Sent otp to your Telegram Handle"
        })
    }

});

routes.get("/verify-otp/:telegramId/:otp", async (req: any, res: any) => {
    const { telegramId, otp } = req.params
    const docs = await getUserOtpById(telegramId)

    console.log("Verfied!" + telegramId);
    const isUserExists = docs.length > 0
    if (!isUserExists) return res.json({ success: false, message: "User does not exist" })
    const userTelegramId = docs[0].userTelegramId
    const otpDb = docs[0].otp
    console.log(userTelegramId, otpDb, otp);

    if (userTelegramId && otpDb && otpDb == otp) {
        return res.json({
            success: true,
            data: "Your telegram is verified"
        })
    }
    else {
        return res.json({ success: false, message: "incorrect otp" })
    }


});

export default routes;
