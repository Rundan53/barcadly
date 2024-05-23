const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const pageController = require('./controller/pages')

const userAuthentication = require('./middleware/auth')

const userRoutes = require('./routes/user')
const shopRoutes = require('./routes/shop')

require('dotenv').config();
app.use(express.static('public'));
app.use(bodyParser.json())

//route middlewares
app.get('/', pageController.mainPage)
app.use('/user', userRoutes);
app.use(userAuthentication.authenticate);
app.use('/shop', shopRoutes)



const PORT = process.env.PORT_NO;
const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

//initiates server
function initiate() {
    mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.taxt5br.mongodb.net/barcadly-ecommerce?retryWrites=true`)
        .then(() => {
            console.log('connected to db')
            app.listen(PORT, ()=>{
                console.log(`>>>>>>>>server running on port ${PORT}`)
            });
        })
        .catch(err => console.log(err));
}

initiate();