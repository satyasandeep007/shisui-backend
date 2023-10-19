const Twit = require('twit');

export const twitterBot = () => {

  const twitterConfig = {
    consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };

  console.log(twitterConfig, "twitterConfig");


  const bot = new Twit(twitterConfig);

  // Keywords to listen for in tweets
  const keywords = ['hello', 'nodejs', 'bot'];

  // Stream tweets containing the specified keywords
  const stream = bot.stream('statuses/filter', { track: keywords });

  stream.on('tweet', (tweet: any) => {
    const tweetId = tweet.id_str;
    const screenName = tweet.user.screen_name;

    console.log(tweet, "tweet");

    // Reply message
    const replyMessage = `Hello @${screenName}! Thanks for mentioning me! 👋`;

    // Reply to the tweet
    // bot.post('statuses/update', {
    //   status: replyMessage,
    //   in_reply_to_status_id: tweetId
    // }, (err: any, data: any, response: any) => {
    //   if (err) {
    //     console.error('Error replying to tweet:', err);
    //   } else {
    //     console.log('Replied to tweet:', data.text);
    //   }
    // });
  });
}
