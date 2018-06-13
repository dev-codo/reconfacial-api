const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login_tb')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if(isValid) {
				return db.select('*').from('users_tb')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('incapaz de achar o user'))
			} else {
				res.status(400).json('credenciais errados')
			}
		})
		.catch(err => res.status(400).json('credenciais errados, fora'))
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login_tb')
		.returning('email')
		.then(loginEmail => {
			return trx('users_tb')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
			
		})
		.then(trx.commit) // when pass, then insert to login
		.catch(trx.rollback) //if not, then return to previous normal state
	})
	.catch(err => {
		res.status(400).json('Erro. Ja existe este cadastro em nosso sistema.');
	});
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params; //grab from inputed params
	let found = false;
	db.select('*').from('users_tb').where({
		id: id // localhost:2000/profile/id | id = db : id = url
	}).then(user => {
		if(user.length) { // not 0
			res.json(user[0]);
 		} else {
 			res.status(400).json('Not found');
 		}
	}).catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users_tb').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))
})

app.listen(2000, () => {
	console.log("Servidor ligado na porta 2000");
})