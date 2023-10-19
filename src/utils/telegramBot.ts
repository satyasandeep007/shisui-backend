import TelegramBot from 'node-telegram-bot-api';

const messageReactions: any = {};

export function setupBot(token: string) {
    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', (msg: any) => {
        console.log(msg, "msg");

        const chatId = msg.chat.id;
        const messageId = msg.message_id;

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

        messageReactions[messageId] = { like: 0, dislike: 0, from: msg.from };

    });

    // Handle callback queries
    bot.on('callback_query', (query: any) => {

        const chatId = query.message.chat.id;
        const messageId = query.message.reply_to_message.message_id;
        const messageIdTwo = query.message.message_id; // Use query.message.message_id here
        const reaction = query.data;

        // Handle different reactions
        if (reaction === 'like') {
            messageReactions[messageId].like++;
            // Check if the number of likes is 10 or more
            if (messageReactions[messageId].like === 10) {
                // Send a message to the user who sent the original message
                const userId = messageReactions[messageId].from.id;
                bot.sendMessage(userId, 'Congratulations! Your message received 10 likes! You are eligible for a Free NFT for your contributions');
            }
        } else if (reaction === 'dislike') {
            messageReactions[messageId].dislike++;
        }
        console.log(messageReactions, "messageReactions");
        // Update the inline keyboard with the new like count
        const messageText = `How do you feel about this message?`;
        const keyboard = {
            inline_keyboard: [
                [
                    { text: `👍 Like ${messageReactions[messageId].like}`, callback_data: 'like' },
                    { text: `👎 Dislike ${messageReactions[messageId].dislike}`, callback_data: 'dislike' }
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
    });


}