const {Telegraf} = require('telegraf')
const { insertUser, insertAdmin, isAdmin, isUser, findUserById, findAdminById } = require('./crud')
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
bot.start(async (ctx) => {
    const telegramId = ctx.from.id;

    // Check if the user is an admin
    const isAdminUser = await isAdmin(telegramId);
    if (isAdminUser) {
        ctx.reply(`Welcome back, Admin!\n\n ${formatDateTimeInEAT()}`);
    } else {
        // Check if the user is a regular user
        const isRegularUser = await isUser(telegramId);
        if (isRegularUser) {
            ctx.reply(`Welcome back, User!\n\n ${formatDateTimeInEAT()}`);
        }
        else {
            ctx.reply(`Hey I am CrossRoadBot, Please  hit /Register to register !\n\n ${formatDateTimeInEAT()}`);
        }
    }
});
bot.launch().then(() => console.log("Bot is living"));