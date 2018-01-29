const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();

const SQL_SYNC = `
	DROP TABLE IF EXISTS tweets;
	CREATE TABLE tweets(
		id SERIAL PRIMARY KEY,
		name VARCHAR(255),
		handle VARCHAR(255),
		tweet VARCHAR(255)
	);
`;

const SQL_SEED = `
	INSERT INTO tweets(name, handle, tweet) VALUES ('Katy Perry', '@katyperry', 'California girls are unforgettable!');
	INSERT INTO tweets(name, handle, tweet) VALUES ('Justin Bieber', '@justinbieber', 'My momma don't like you and she likes everyone.');
	INSERT INTO tweets(name, handle, tweet) VALUES ('Taylor Swift', '@taylorswift13', 'Are you ready for it?');
`;

const seed = (cb)=> {
	client.query(SQL_SEED, cb);
};

const sync = (cb)=>{
	client.query(SQL_SYNC, cb);
}

const getTweets = (cb) => {
	client.query('SELECT * from tweets', (err, result)=>{
		if(err) return cb(err);
		cb(null, result.rows);
	});
}

const getTweet = (id, cb)=> {
	client.query('SELECT * from tweets WHERE id=$1', [id], (err, result)=>{
		if(err) return cb(err);
		cb(null, result.rows.length ? result.rows[0] : null);
	});
}

module.exports = {
	sync,
	getTweets,
	getTweet,
	seed
};