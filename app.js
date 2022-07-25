require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine(
	'handlebars',
	exphbs.engine({
		extname: 'handlebars',
		defaultLayout: 'contact',
		layoutsDir: 'views',
	})
);
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.render('contact');
});

app.post('/send', (req, res) => {
	const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Name: ${req.body.company}</li>
    <li>Name: ${req.body.email}</li>
    <li>Name: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

	// async..await is not allowed in global scope, must use a wrapper
	async function main() {
		// Generate test SMTP service account from ethereal.email
		// Only needed if you don't have a real mail account for testing
		//let testAccount = await nodemailer.createTestAccount();

		console.log(process.env.GMAIL_USERNAME);
		console.log(process.env.GMAIL_PASSWORD);

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			host: 'smtp.gmail.com',
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.GMAIL_USERNAME, // generated ethereal user
				pass: process.env.GMAIL_PASSWORD, // generated ethereal password
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: `"Nelson Correia" <${process.env.GMAIL_USERNAME}>`, // sender address
			to: `${process.env.GMAIL_USERNAME}`, // list of receivers
			subject: 'Email build testing for Gmail', // Subject line
			text: 'Hello world?', // plain text body
			html: output, // html body
		});

		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		res.render('contact', { msg: 'Email has been sent' });
	}

	main().catch((error) => {
		if (error) {
			return console.error(error);
		}
		return console.log('Email sent!');
	});
});

app.listen(8080, () => {
	console.log('Server started...');
});

// Resources
// https://stackoverflow.com/questions/51973751/nodemailer-missing-credentials-for-plain
//