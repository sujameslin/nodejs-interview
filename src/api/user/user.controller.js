const UserModel = require('./user.model');

class UserController {

  static async getList (req, res) {
    // TODO: TDD me & Refactor me
		const pagination = {
			limit: Math.abs(req.param('limit')) || 3,
			skip: Math.abs(req.param('skip')) || 0
		};

		try {
			let users = await UserModel.find({}, null, pagination);

			res.json(users);
		} catch (e) {
			console.error(e.message);
		}
  }

  static async create (req, res) {
    // TODO: Write implementation here

		const user = new UserModel(req.body);
		const validateError = user.validateSync();

		if (validateError) {
			return res.status(422).send(validateError.message);
		}

		try {
			await user.save();
			res.sendStatus(201);
		} catch (e) {
			console.log(e.message);
			res.send(400).send(e.message);
		}
  }
}

module.exports = UserController;
