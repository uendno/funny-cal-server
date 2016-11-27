var config = {};

config.db = {URI: 'mongodb://localhost:27017/funny-cal'};

config.auth = {
    SECRET: "funnycal123",
    EXP_TIME: 86400
};

config.server = {
    IP_ADDRESS_OLD: "localhost",
    IP_ADDRESS: "128.199.167.164",
    PORT: 3000
};

module.exports = config;

