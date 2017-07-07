const UserModel = require('./user.model');

class UserController {

  static async getList (req, res) {
    // TODO: TDD me & Refactor me
		const pagination = {
			limit: Math.abs(req.query.limit) || 3,
			skip: Math.abs(req.query.skip) || 0
		};
		const query = {};

		try {
			let users = await UserModel.find(query, null, pagination);
			let total = await UserModel.count(query);

			res.json(Object.assign(pagination, {
				total,
				data: users
			}));
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
