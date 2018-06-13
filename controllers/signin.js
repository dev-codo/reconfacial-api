const handleSignin = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
	handleSignin: handleSignin
}