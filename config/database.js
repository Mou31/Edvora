const config = require('./config');
const Sequelize = require('sequelize');

const database = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
})

const db = {};
db.Sequelize = Sequelize;
db.databaseConf = database;

// function to drop existing tables and re-sync database
db.dropRestApiTable = () => {
    db.databaseConf.sync({force: true}).then(() => {
        console.log("Table just dropped and db resynced");
    }).catch((err) => {
        console.log("Err", err);
    });
};

module.exports = db;