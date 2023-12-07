const app = require('./app/app.js');

module.exports = async () => {
    // close Sequelize connections here
    await app.db.sequelize.close();
};