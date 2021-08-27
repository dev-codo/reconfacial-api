const handleRegister = (req, res, db, bcrypt) => { //db, bcrypt: dependencies injection
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	if(!email || !name || !password) { //if empty
		return res.status(400).json('empty field');
	}
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
}

module.exports = {
	handleRegister: handleRegister
}