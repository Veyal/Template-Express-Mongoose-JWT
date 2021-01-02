const mongoose = require('mongoose');
const mongoPath = `mongodb://${
    process.env.db.username
}:${
    process.env.db.password
}@${
    process.env.db.host
}:${
    process.env.db.port
}/${
    process.env.db.database
}`;
mongoose.connect(mongoPath,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
