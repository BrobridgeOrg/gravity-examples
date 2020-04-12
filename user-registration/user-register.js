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

	let num = 100;

	// Simulate creating 100 user
	for (let i = 0; i < num; i++) {

		let message = {
			event: 'userCreated',
			payload: {
				id: i + 1,
				name: 'Fred_' + i,
				email: 'fred_' + i + '@brobridge.com'
			}
		}

		try {
			console.log('sending message:', message.payload.name);

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
