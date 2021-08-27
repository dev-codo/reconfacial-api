const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//from documentation | connect server to DB.
const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'devca',
		password: '',
		database: 'reconfacial-db'
	}
});

db.select('*').from('users_tb').then(data => {
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(database.users) });

app.post('/signin', signin.handleSignin(db, bcrypt)); //advanced function way

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImagePut(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(2000, () => {
	console.log("Servidor ligado na porta 2000");
})