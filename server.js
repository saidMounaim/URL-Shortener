import express from 'express';
import dotenv from 'dotenv';
import ShortUrl from './models/shortUrl.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
	const shortsUrl = await ShortUrl.find();
	res.render('index', {
		shortsUrl: shortsUrl,
	});
});

app.post('/shortUrl', async (req, res, next) => {
	await ShortUrl.create({ full: req.body.fullUrl });
	res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

	if (shortUrl === null) return res.sendStatus(404);

	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server is running'));
