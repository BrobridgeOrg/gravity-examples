const stan = require('node-nats-streaming');

const sc = stan.connect('test-cluster', 'example', '0.0.0.0:32803');

const publish = (channel, message) => {
	return new Promise((resolve, reject) => {

		sc.publish(channel, JSON.stringify(message), (err, guid) => {
			if (err) {
				return reject(err);
			}

			resolve(guid);
		})

	});
};

sc.on('connect', async () => {

	let num = 50;

	// Simulate creating 100 user
	for (let i = 0; i < num; i++) {

		let message = {
			eventName: 'userDeleted',
			payload: {
				id: i + 1,
			}
		}

		try {
			console.log('sending message:', i);

			// Publish userCreated event
			await publish('example.userevent', message)
		} catch(e) {
			console.log(e);
		}
	}

	sc.close();
})

sc.on('close', () => {
	process.exit()
})
