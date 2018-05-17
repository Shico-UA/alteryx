const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

//Middleware.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cookieParser());

// Routes
app.use("/", authRoutes);
app.use("/api", apiRoutes);

//Server start
app.listen(3000, () => console.log(`Server is running on: http://localhost:3000`));
