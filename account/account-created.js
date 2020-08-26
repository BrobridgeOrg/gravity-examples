const stan = require('node-nats-streaming');
const FakeDataGenerator = require('fake-data-generator-taiwan');

const sc = stan.connect('test-cluster', 'example', '0.0.0.0:32803');
const eventCount = 100;

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

	let generator = new FakeDataGenerator();
	let tasks = [];

	// Simulate creating 100 user
	for (let i = 0; i < eventCount; i++) {

		// Generate fake data
		let name = generator.Name.generate();
		let mobile = generator.Mobile.generate(0, 10);
		let id = generator.IDNumber.generate();
		let address = generator.Address.generate();
		let type = Math.floor(Math.random() * 2) + 1;

		let message = {
			event: 'accountCreated',
			payload: {
				id: i + 1,
				idNum: id,
				name: name,
				phone: mobile,
				address: address,
				type: '0' + type.toString(),
			}
		}

		try {
			console.log('sending message:', message.payload.name);

			// Publish event
			let task = publish('example.accountevent', message);
			tasks.push(task);
		} catch(e) {
			console.log(e);
		}
	}

	await Promise.all(tasks);

	sc.close();
})

sc.on('close', () => {
	process.exit()
})
