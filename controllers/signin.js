const handleSignin = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if(!email || !password) {
		return res.status(400).json('empty field');
	}
	db.select('email', 'hash').from('login_tb')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid) {
				return db.select('*').from('users_tb')
					.where('email', '=', email)
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