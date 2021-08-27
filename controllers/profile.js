const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
	handleProfileGet: handleProfileGet
}