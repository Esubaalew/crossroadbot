
// Admin.js
// model definition for Admins

const {DataTypes} = require('sequelize');
const sequelize = require('../database');

const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'admin'
        },
    },
    {tableName: "Admins"}
);

module.exports = Admin;