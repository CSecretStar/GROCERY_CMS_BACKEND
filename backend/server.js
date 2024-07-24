const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const router = require('./routes')
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB =  require('./config/db');

connectDB();
app.use(cors());
app.use(morgan('dev')); // Log requests to the console
app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before your handlers, available under req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
