const {Telegraf} = require('telegraf')
const {message} = require('telegraf/filters')

const bot = new Telegraf(process.env.TOKEN)

// Function to format date and time in East African Time (GMT+3)
function formatDateTimeInEAT() {
    const currentDate = new Date();
    const options = {
        timeZone: 'Africa/Nairobi', // East African Time (GMT+3)
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    };

    return currentDate.toLocaleString('en-US', options);
}
bot.start((ctx) => {
    const introduction = `Welcome to CrossRoadBot!\n\n${formatDateTimeInEAT()}`;
    ctx.reply(introduction);
});
bot.launch().then(() => console.log("Bot is living"));