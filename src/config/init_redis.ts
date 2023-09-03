// const redis = require('redis');

// const client = redis.createClient({
//     port: 6379,
//     host: '127.0.0.1'
// });

// client.on('connect', () => {
//     console.log('Client Connected to redis....');
// });

// client.on('ready', () => {
//     console.log('Client Connected to redis and ready to use....');
// });

// client.on('error', (error: Error) => {
//     console.log(error.message);
// });

// client.on('end', () => {
//     console.log('Client Disconnected from reddis');
// });

// process.on('SIGINT', () => {
//     client.quit(() => {
//         console.log('Client Quit. Goodbye!');
//         process.exit(0);
//     });
// });

// export { client };
