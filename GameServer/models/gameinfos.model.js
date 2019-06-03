module.exports = (sequelize, Sequelize) => {
    return sequelize.define('gameinfos', {
        username: {
            type: Sequelize.STRING
        },
        money: {
            type: Sequelize.INTEGER
        }
    });
};