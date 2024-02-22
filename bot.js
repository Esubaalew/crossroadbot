const {Telegraf, session} = require('telegraf')
const {
    insertUser,
    insertAdmin,
    isAdmin, isUser,
    findUserById,
    findAdminById,
    deleteUserById,
    deleteAdminById,
    getAllAdmins, getAllUsers, insertAdminRequest,
    getAllRequests,
    findRequestById,
    deleteRequestById,
} = require('./crud')

const {message} = require('telegraf/filters')
const {Admin} = require("./database");
const fs = require('fs');


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
        // Check if the user has a pending admin request
        const request = await findRequestById(telegramId);

        if (request) {
            // Remove the user from the Requests table
            await deleteRequestById(telegramId);
        }

        // Remove the user from the Users table
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

        const formatUser = (user, index) => {
            return `${index + 1}. @${user.username || 'ID ' + user.id}: ${user.createdAt}`;
        };

        if (admins.length > 0) {
            formattedList.push('*Admins*');
            admins.forEach((admin, index) => {
                formattedList.push(formatUser(admin, index));
            });
            formattedList.push('...');
        } else {
            formattedList.push('*Admins*');
            formattedList.push('No admins found.');
        }

        if (users.length > 0) {
            formattedList.push('*Users*');
            users.forEach((user, index) => {
                formattedList.push(formatUser(user, index));
            });
        } else {
            formattedList.push('*Users*');
            formattedList.push('No users found.');
        }

        const fullListText = formattedList.join('\n');
        const fileName = 'user_list.txt';

        fs.writeFileSync(fileName, fullListText);

        const limitedListText = formattedList.slice(0, 10).join('\n');
        await ctx.replyWithDocument({ source: fileName }, { caption: `List of Users and Admins\n\n ${limitedListText}\n\n see all list in the file` });

        fs.unlinkSync(fileName);
    } else {
        ctx.reply('You do not have permission to use this command.');
    }
});

// Admin register command
bot.command('adminregister', async (ctx) => {
    const telegramId = ctx.from.id;

    // Check if the user is an admin
    const isAdminUser = await isAdmin(telegramId);
    const isRegularUser = await isUser(telegramId);

    if (isAdminUser) {
        const requests = await getAllRequests();


        requests.sort((a, b) => a.createdAt - b.createdAt);

        // Format the list with usernames and IDs
        const formattedList = requests.map((request, index) => {
            const userInfo = `${index + 1}. @${request.username || 'ID ' + request.id}: ${request.id}`;
            return userInfo;
        });

        if (formattedList.length > 0) {
            ctx.reply(`List of Admin Requests:\n\n${formattedList.join('\n')}\n\n you can /reject userid or /approve userid `);
        } else {
            ctx.reply('No pending admin requests.');
        }
    } else if (isRegularUser) {

        const existingRequest = await findRequestById(telegramId);

        if (existingRequest) {
            const requestDate = existingRequest.createdAt.toLocaleString();
            ctx.reply(`You already have a pending admin request submitted on ${requestDate}.\n\n you can cancel your request by /cancel`);
        } else {
            // Insert admin request
            await insertAdminRequest(telegramId, ctx.from.username);
            ctx.reply(`Your request to become an admin has been submitted. \n\n you can cancel your request by /cancel`);

            // Notify all admins about the new request
            const allAdmins = await getAllAdmins();

            await Promise.all(allAdmins.map(async (admin) => {
                // Your asynchronous operation here
                await bot.telegram.sendMessage(admin.id, `New admin request:\n\nUser: @${ctx.from.username}\nID: ${telegramId}\nDate: ${formatDateTimeInEAT()}`);
            }));
        }
    } else {
        ctx.reply('You do not have permission to use this command. please /register first');
    }
});

// Cancel command
bot.command('cancel', async (ctx) => {
    const telegramId = ctx.from.id;

    const isRegularUser = await isUser(telegramId);

    if (isRegularUser) {

        const hasPendingRequest = await findRequestById(telegramId);

        if (hasPendingRequest) {

            await deleteRequestById(telegramId);
            ctx.reply('Your admin request has been canceled.');
        } else {
            ctx.reply('No pending admin request found to cancel.');
        }
    } else {
        ctx.reply('You do not have permission to use this command.');
    }
});
// Approve command
bot.command('approve', async (ctx) => {
    const telegramId = ctx.from.id;

    const isAdminUser = await isAdmin(telegramId);

    if (isAdminUser) {

        const targetId = (ctx.message.text.split(' ')[1] || '').trim();


        if (!targetId) {
            ctx.reply('Please include a valid Telegram ID to approve. like /approve id');
        } else {

            const request = await findRequestById(targetId);

            if (request) {

                await deleteRequestById(targetId);
                await deleteUserById(targetId);
                await insertAdmin(targetId, request.username);

                // Send a private message to the user
                const userTelegramId = request.id;
                await bot.telegram.sendMessage(userTelegramId, 'Congratulations! Your request to become an admin has been approved. You are now an admin.');

                ctx.reply(`Admin request for user @${request.username || 'ID ' + targetId} has been approved. A private message has been sent to notify the user.`);
            } else {
                if (await isAdmin(targetId)) {
                    ctx.reply('No pending admin request found for the provided Telegram ID. This user is an admin already');
                } else if (await isUser(targetId)) {
                    ctx.reply('No pending admin request found for the provided Telegram ID. This user is a regular user ');
                } else {
                    ctx.reply('No pending admin request found for the provided Telegram ID. This user is unregistered yet');
                }
            }
        }
    } else {
        ctx.reply('You do not have permission to use this command.');
    }
});

// Reject command
bot.command('reject', async (ctx) => {
    const telegramId = ctx.from.id;
    const isAdminUser = await isAdmin(telegramId);

    if (isAdminUser) {
        const targetId = (ctx.message.text.split(' ')[1] || '').trim();

        if (!targetId) {
            ctx.reply('Please include a valid Telegram ID to reject. like /reject id');
        } else {
            const request = await findRequestById(targetId);

            if (request) {
                await deleteRequestById(targetId);

                // Send a private message to the user (optional)
                const userTelegramId = request.id;
                await bot.telegram.sendMessage(userTelegramId, 'Your request to become an admin has been rejected. If you have any questions, please contact support.');

                ctx.reply(`Admin request for user @${request.username || 'ID ' + targetId} has been rejected. A private message has been sent to notify the user.`);
            } else {
                if (await isAdmin(targetId)) {
                    ctx.reply('No pending admin request found for the provided Telegram ID. This user is an admin already');
                } else if (await isUser(targetId)) {
                    ctx.reply('No pending admin request found for the provided Telegram ID. This user is a regular user ');
                } else {
                    ctx.reply('No pending admin request found for the provided Telegram ID. This user is unregistered yet');
                }
            }
        }
    } else {
        ctx.reply('You do not have permission to use this command.');
    }
});

bot.on('text', (ctx) => {
    const messageText = ctx.message.text;

    if (messageText.startsWith('/')) {
        ctx.reply(`Command "${messageText}" is not recognized. Use Menu to see available commands.`);
    } else {
        ctx.reply('I can only understand commands. Use Menu to talk with me');
    }
});

bot.on('photo', (ctx) => {
    ctx.reply("Sorry, I don't process photo messages currently.");
});

// Handling videos
bot.on('video', (ctx) => {
    ctx.reply("Sorry, I don't process video messages currently.");
});


bot.on('audio', (ctx) => {
    ctx.reply("Sorry, I don't process audio files currently.");
});


bot.on('video_note', (ctx) => {
    ctx.reply("Sorry, I don't process video messages (video notes) currently.");
});

// Handling documents/files
bot.on('document', (ctx) => {
    ctx.reply("Sorry, I don't process document messages currently.");
});

bot.on('poll', (ctx) => {
    ctx.reply("Sorry, I don't process polls currently.");
});


bot.on('sticker', (ctx) => {
    ctx.reply("Sorry, I don't process stickers currently.");
});

bot.on('voice', (ctx) => {
    ctx.reply("Sorry, I don't process voice messages currently.");
});


bot.on('contact', (ctx) => {
    ctx.reply("Sorry, I don't process contact messages currently.");
});

bot.on('animation', (ctx) => {
    ctx.reply("Sorry, I don't process animated GIFs currently.");
});

bot.on('location', (ctx) => {
    ctx.reply("Sorry, I don't process location messages currently.");
});
bot.launch().then(() => console.log("Bot is living"));