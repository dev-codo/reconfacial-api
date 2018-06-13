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

db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = { //before database section
	users: [
		{
			id: '12',
			name: 'Mingau',
			email: 'mingau@gato.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '13',
			name: 'Tomtom',
			email: 'tom@gato.com',
			password: 'bags',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '111',
			hash: '',
			email: 'email@email.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password) {
			res.json(database.users[0]);
	} else {
		res.status(400).json('error loggin in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body; //destructuring.
	//`req.body`: input from Postman
	// bcrypt.hash(password, null, null, function(err, hash) {
 //    // Store hash in your password DB.
 //    console.log(hash);
	// });
	
	db('users')
	.returning('*')
	.insert({
		email: email,
		name: name,
		joined: new Date()
	})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => {
			res.status(400).json('Erro. Ja existe este cadastro em nosso sistema.');
		});


	//code do primeiro comment - melhor
	// const retUser = JSON.parse(JSON.stringify(database.users[database.users.length-1]));//last item input
	// retUser.password = '********';
	// res.json(retUser);

	//code do Instrutor
	// res.json(database.users[database.users.length-1]); //last item input
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params; //grab from inputed params
	let found = false;
	db.select('*').from('users').where({
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
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(2000, () => {
	console.log("Servidor ligado na porta 2000");
})