const mongoose = require('mongoose');

//........................for database connection...............//

mongoose.connect(process.env.MONGODB_KEY);
