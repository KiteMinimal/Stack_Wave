
require("dotenv").config();
const config = require("./src/config/config");
const app = require("./src/app");

const connect = require("./src/db/db");
connect();
require("./src/utils/redisConnection");

app.listen(config.PORT, function(){
    console.log(`app is running on port ${config.PORT}`);
})
