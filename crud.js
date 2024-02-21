

const { sequelize, User, Admin } = require('./database');

// Function to insert a new user
async function insertUser(telegramId, username, role = 'user') {
    try {
        const newUser = await User.create({
            id: telegramId,
            username,
            role,
        });
        console.log('User inserted:', newUser.toJSON());
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

// Function to insert a new admin
async function insertAdmin(telegramId, username) {
    try {
        const newAdmin = await Admin.create({
            id: telegramId,
            username,
        });
        console.log('Admin inserted:', newAdmin.toJSON());
    } catch (error) {
        console.error('Error inserting admin:', error);
        throw error;
    }
}

// Function to search for a user by Telegram ID
async function findUserById(telegramId) {
    try {
        const user = await User.findByPk(telegramId);
        console.log('User found:', user ? user.toJSON() : 'Not found');
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

// Function to search for an admin by Telegram ID
async function findAdminById(telegramId) {
    try {
        const admin = await Admin.findByPk(telegramId);
        console.log('Admin found:', admin ? admin.toJSON() : 'Not found');
        return admin;
    } catch (error) {
        console.error('Error finding admin:', error);
        throw error;
    }
}


/// Function to check if a user is an admin based on the Telegram ID
async function isAdmin(telegramId) {
    try {
        const admin = await Admin.findOne({ where: { id: telegramId } });
        return admin !== null;
    } catch (error) {
        console.error('Error checking admin status:', error);
        throw error;
    }
}

// Function to check if a user is a regular user based on the Telegram ID
async function isUser(telegramId) {
    try {
        const user = await User.findOne({ where: { id: telegramId } });
        return user !== null;
    } catch (error) {
        console.error('Error checking user status:', error);
        throw error;
    }
}

module.exports = {isAdmin, isUser, findAdminById, findUserById, insertUser, insertAdmin};