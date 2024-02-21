// main definition of sequelize

const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('sqlite://./data.sqlite');

// Getting tables from models
const User = require('models/User');
const Admin = require('models/Admin');

// testing if the connection is succeeded
function checkConnection() {
    sequelize
        .authenticate()
        .then(() => {
            console.log("Success");
        })
        .catch((error) => {
            console.log('Ahh', error);
        });
}


module.exports = {sequelize, User, Admin};