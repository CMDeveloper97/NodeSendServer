const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB(); 

// const corsOptions = {
// 	origin: process.env.FRONTEND_URL,
// 	credentials:true,
// 	optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());

app.use(express.json({extend: true}));
const port = process.env.PORT || 4000;

//Public carpet
app.use(express.static('uploads'));

app.use('/api/users/', require('./routes/users'));
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/links/', require('./routes/links'));
app.use('/api/files/', require('./routes/files'));
 
app.listen(port, '0.0.0.0', () => {
	console.log(`Server works on ${port}`);
})