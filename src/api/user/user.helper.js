const UserSchema = require('./user.model');

async function addDevice (params) {

  // TODO: Refactor and rewrite me, I'm bad function!
  if(!params.userId){
    return 'No userId provided';
  }

  if(!params.deviceId){
    return 'Missing deviceId';
  }

	try {
		await UserSchema.findOneAndUpdate(
			{_id: params.userId},
			{deviceId: params.deviceId}
		);

		return 'Success';
	} catch (e) {
		return e.message;
	}
}

module.exports = addDevice;
