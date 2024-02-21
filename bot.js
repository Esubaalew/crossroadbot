const {Telegraf, session} = require('telegraf')
const {
    insertUser,
    insertAdmin,
    isAdmin, isUser,
    findUserById,
    findAdminById,
    deleteUserById,
    deleteAdminById,
    getAllAdmins, getAllUsers
} = require('./crud')

const {message} = require('telegraf/filters')
const {Admin} = require("./database");


const bot = new Telegraf(process.env.TOKEN)
bot.use(session());

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


    const isAdminUser = await isAdmin(telegramId);
    if (isAdminUser) {
        ctx.reply(`Welcome back, Admin!\n\n ${formatDateTimeInEAT()}`);
    } else {

        const isRegularUser = await isUser(telegramId);
        if (isRegularUser) {
            ctx.reply(`Welcome back, User!\n see your info using /myinfo. \n\n ${formatDateTimeInEAT()}`);
        } else {
            ctx.reply(`Hey, I am CrossRoadBot!!\nPlease hit /register to register !\n\n ${formatDateTimeInEAT()}`);
        }
    }
});

// Register command
bot.command('register', async (ctx) => {
    const telegramId = ctx.from.id;
    const username = ctx.from.username;

    const isAdminUser = await isAdmin(telegramId);
    const isRegularUser = await isUser(telegramId);

    if (isAdminUser) {
        ctx.reply(`You are already registered as an Admin!\n\n ${formatDateTimeInEAT()}`);
    } else if (isRegularUser) {
        ctx.reply(`You are already registered as a User!\n\n ${formatDateTimeInEAT()}`);
    } else {

        await insertUser(telegramId, username);
        ctx.reply(`You have been registered as a User. \n\n ${formatDateTimeInEAT()}`);
    }
});

// Unregister command
bot.command('unregister', async (ctx) => {
    const telegramId = ctx.from.id;


    const isRegularUser = await isUser(telegramId);
    const isAdminUser = await isAdmin(telegramId);


    if (isRegularUser) {

        await deleteUserById(telegramId);
        ctx.reply(`You have been unregistered. \n\n ${formatDateTimeInEAT()}`);
    } else {

        if (isAdminUser) {
            ctx.reply(`Admins cannot unregister. If needed, contact support.`);
        } else {
            ctx.reply(`You are not registered as a regular user. Use /register to register.`);
        }
    }
});


bot.command('myinfo', async (ctx) => {
    const telegramId = ctx.from.id;

    const isRegularUser = await isUser(telegramId);

    if (isRegularUser) {

        const user = await findUserById(telegramId);

        if (user) {
            const {id, username, createdAt, role} = user;
            const formattedDate = new Date(createdAt).toLocaleString('en-US', {
                timeZone: 'Africa/Nairobi',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short',
            });

            ctx.reply(`Your Info:\nName: ${ctx.from.first_name}\nID: ${id}\nUsername: @${username}\n Role: ${role}\n Created At: ${formattedDate}\n`);
        } else {
            ctx.reply(`Couldn't retrieve your information. Please try again later.`);
        }
    } else {
        ctx.reply(`You are not registered as a regular user. Use /register to register.`);
    }
});

// Command to list all users (only for admins)
bot.command('listusers', async (ctx) => {

    const isAdminUser = await isAdmin(ctx.from.id);

    if (isAdminUser) {

        const admins = await getAllAdmins();
        const users = await getAllUsers();


        admins.sort((a, b) => a.createdAt - b.createdAt);


        users.sort((a, b) => a.createdAt - b.createdAt);

        const formattedList = [];


        if (admins.length > 0) {
            formattedList.push('*Admins*');
            admins.forEach((admin, index) => {
                const adminInfo = `${index + 1}. @${admin.username || 'ID ' + admin.id}: ${admin.createdAt}`;
                formattedList.push(adminInfo);
            });
            formattedList.push('...');
        }


        if (users.length > 0) {
            formattedList.push('*Users*');
            users.forEach((user, index) => {
                const userInfo = `${index + 1}. @${user.username || 'ID ' + user.id}: ${user.createdAt}`;
                formattedList.push(userInfo);
            });
        } else {
            ctx.reply(`There are no users`)
        }

        ctx.reply(`List of Users and Admins:\n\n${formattedList.join('\n')}`);
    } else {
        ctx.reply('You do not have permission to use this command.');
    }
});


bot.launch().then(() => console.log("Bot is living"));