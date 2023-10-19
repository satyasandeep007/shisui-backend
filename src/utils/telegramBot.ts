import TelegramBot from 'node-telegram-bot-api';
import { editMessageReaction } from '../controllers/firebase';
import { getMessageReaction } from '../controllers/firebase';
import { addMessageReaction } from '../controllers/firebase';

interface MessageReaction {
    dislikes: number;
    likes: number;
    messageId: string;
    userFullName: string;
    userId: string;
    userTelegramId: string;
}

export function setupBot(token: string) {
    const bot = new TelegramBot(token, { polling: true });
    console.log("Telegram Bot is started and running");

    bot.on('message', async (msg: any) => {
        console.log(msg, "msg");

        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const userFullName = msg.from.first_name;
        const userId = msg.from.id;
        const userTelegramId = msg.from.username;

        // Message text
        const messageText = 'How do you feel about this message?';

        // Inline keyboard with reactions
        const keyboard = {
            inline_keyboard: [
                [
                    { text: '👍 Like', callback_data: 'like' },
                    { text: '👎 Dislike', callback_data: 'dislike' }
                ]
            ]
        };

        // Send message with inline keyboard
        bot.sendMessage(chatId, messageText, {
            reply_markup: JSON.stringify(keyboard),
            reply_to_message_id: messageId
        });

        // Add new message reaction object to Firebase
        const reactionItem: MessageReaction = {
            dislikes: 0,
            likes: 0,
            messageId: messageId.toString(),
            userFullName,
            userId: userId.toString(),
            userTelegramId
        };

        try {
            console.log(reactionItem, "reactionItem");
            await addMessageReaction(reactionItem);
        } catch (error) {
            console.error('Error adding message reaction to Firebase:', error);
        }

    });

    // Handle callback queries
    bot.on('callback_query', async (query: any) => {
        const chatId = query.message.chat.id;
        const messageId = query.message.reply_to_message.message_id;
        const messageIdTwo = query.message.message_id;
        const reaction = query.data;

        // Find the message reaction object in Firebase based on messageId
        const messageReaction = await getMessageReaction(messageId.toString());

        if (messageReaction) {
            // Handle different reactions
            if (reaction === 'like') {
                messageReaction.likes++;
                // Check if the number of likes is 10 or more
                if (messageReaction.likes === 10) {
                    // Send a message to the user who sent the original message
                    const userTelegramId = messageReaction.userTelegramId;
                    bot.sendMessage(userTelegramId, 'Congratulations! Your message received 10 likes! You are eligible for a Free NFT for your contributions');
                }
            } else if (reaction === 'dislike') {
                messageReaction.dislikes++;
            }

            // Update the inline keyboard with the new like and dislike count
            const messageText = `How do you feel about this message?`;
            const keyboard = {
                inline_keyboard: [
                    [
                        { text: `👍 Like ${messageReaction.likes}`, callback_data: 'like' },
                        { text: `👎 Dislike ${messageReaction.dislikes}`, callback_data: 'dislike' }
                    ]
                ]
            };

            // Edit the original message to update the inline keyboard
            bot.editMessageText(messageText, {
                chat_id: chatId,
                message_id: messageIdTwo,
                reply_markup: JSON.stringify(keyboard)
            });

            // Answer the callback query to remove the "loading" status
            bot.answerCallbackQuery(query.id);

            // Update message reaction object in Firebase
            try {
                await editMessageReaction(messageReaction, messageId.toString());
            } catch (error) {
                console.error('Error updating message reaction in Firebase:', error);
            }
        }
    });


}