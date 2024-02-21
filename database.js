// main definition of sequelize

const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite://./data.sqlite');


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

const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {tableName: "Users"}
)

const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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

module.exports = {sequelize, User, Admin};