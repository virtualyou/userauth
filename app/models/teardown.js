const app = require('./src/src.js');

module.exports = async () => {
    // close Sequelize connections here
    await app.db.sequelize.close();
};