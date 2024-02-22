

const { sequelize, User, Admin, Request } = require('./database');

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

// Function to delete a user by ID from the Users table
async function deleteUserById(userId) {
    try {
        const deletedUser = await User.destroy({
            where: { id: userId },
        });

        if (deletedUser > 0) {
            console.log(`User with ID ${userId} deleted successfully.`);
            return true;
        } else {
            console.log(`User with ID ${userId} not found.`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
}

// Function to delete an admin by ID from the Admins table
async function deleteAdminById(adminId) {
    try {
        const deletedAdmin = await Admin.destroy({
            where: { id: adminId },
        });

        if (deletedAdmin > 0) {
            console.log(`Admin with ID ${adminId} deleted successfully.`);
            return true;
        } else {
            console.log(`Admin with ID ${adminId} not found.`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting admin with ID ${adminId}:`, error);
        throw error;
    }
}


// Function to get all users from the Users table
async function getAllUsers() {
    try {
        const users = await User.findAll();
        console.log('All Users:', users.map(user => user.toJSON()));
        return users;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
}

// Function to get all admins from the Admins table
async function getAllAdmins() {
    try {
        const admins = await Admin.findAll();
        console.log('All Admins:', admins.map(admin => admin.toJSON()));
        return admins;
    } catch (error) {
        console.error('Error getting all admins:', error);
        throw error;
    }
}

// Function to insert a new request
async function insertAdminRequest(telegramId, username) {
    try {
        const newRequest = await Request.create({
            id: telegramId,
            username,
        });
        console.log('Admin request inserted:', newRequest.toJSON());
    } catch (error) {
        console.error('Error inserting admin request:', error);
        throw error;
    }
}

// Function to get all requests from the Requests table
async function getAllRequests() {
    try {
        const requests = await Request.findAll();
        console.log('All Requests:', requests.map(request => request.toJSON()));
        return requests;
    } catch (error) {
        console.error('Error getting all requests:', error);
        throw error;
    }
}

// Function to find a request by Telegram ID
async function findRequestById(telegramId) {
    try {
        const request = await Request.findByPk(telegramId);
        console.log('Request found:', request ? request.toJSON() : 'Not found');
        return request;
    } catch (error) {
        console.error('Error finding request:', error);
        throw error;
    }
}

// Function to delete a request by ID from the Requests table
async function deleteRequestById(requestId) {
    try {
        const deletedRequest = await Request.destroy({
            where: { id: requestId },
        });

        if (deletedRequest > 0) {
            console.log(`Admin request with ID ${requestId} deleted successfully.`);
            return true;
        } else {
            console.log(`Admin request with ID ${requestId} not found.`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting admin request with ID ${requestId}:`, error);
        throw error;
    }
}


module.exports = {
    isAdmin,
    isUser,
    findAdminById,
    findUserById,
    insertUser,
    insertAdmin,
    deleteAdminById,
    deleteUserById,
    getAllUsers,
    getAllAdmins,
    insertAdminRequest,
    getAllRequests,
    findRequestById,
    deleteRequestById,
};