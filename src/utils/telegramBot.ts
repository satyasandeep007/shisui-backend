import TelegramBot from 'node-telegram-bot-api';

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
    });

    // Handle callback queries
    bot.on('callback_query', (query: any) => {
        const chatId = query.message.chat.id;
        const reaction = query.data;

        // Handle different reactions
        if (reaction === 'like') {
            bot.sendMessage(chatId, 'You liked the message! 👍');
        } else if (reaction === 'dislike') {
            bot.sendMessage(chatId, 'You disliked the message! 👎');
        }

        // Answer the callback query to remove the "loading" status
        bot.answerCallbackQuery(query.id);
    });
}