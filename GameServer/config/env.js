const env = {
    database: 'flowerfight',
    username: 'root',
    password: '1q2w3e4r',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = env;
