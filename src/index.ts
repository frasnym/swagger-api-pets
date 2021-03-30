import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import Datastore from 'nedb-promises';

import petsRouter from './routes/pets';

declare global {
	namespace Express {
		interface Request {
			db: Datastore;
		}
	}
}

const datastore = Datastore.create({
	filename: 'nedb.db',
	inMemoryOnly: false,
});

const PORT = process.env.PORT || 3000;

const options: swaggerJsDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Pets API',
			version: '1.0.0',
			description: 'A simple Express Pets API',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Local server',
			},
		],
	},
	apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsDoc(options);

const app = express();

app.request.db = datastore;
app.use(express.json());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/pets', petsRouter);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
