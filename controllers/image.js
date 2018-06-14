const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: 'a5b7e6142ead4be8be340389abe45e70'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'))
}

const handleImagePut = (req, res, db) => {
	const { id } = req.body;
	db('users_tb').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImagePut, // ES6
	handleApiCall
}