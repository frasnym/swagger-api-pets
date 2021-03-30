import { Router, Request, Response } from 'express';
import { PetDoc } from '../models/pet-model';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - type
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the pet
 *         type:
 *           type: string
 *           description: The pet type
 *         name:
 *           type: string
 *           description: The pet name
 *       example:
 *         _id: XfgLrDDr5jQxyyqs
 *         type: dog
 *         name: Alexander
 */

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: The pets managing APIs
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Returns the list of all pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Success to get the pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Pet"
 */

router.get('/', async (req: Request, res: Response) => {
	const pets = await req.db.find<PetDoc>({});
	return res.send(pets);
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet's id
 *     responses:
 *       200:
 *         description: Success to get the pet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pet"
 *       404:
 *         description: The pet does not found
 */

router.get('/:id', async (req: Request, res: Response) => {
	const pet = await req.db.findOne<PetDoc>({ _id: req.params.id });
	if (!pet) {
		return res.sendStatus(404);
	}
	return res.send(pet);
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create new record of pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Pet"
 *     responses:
 *       201:
 *         description: Success to create new record of pet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pet"
 *       500:
 *         description: Internal server error while processing request
 */

router.post('/', async (req: Request, res: Response) => {
	try {
		const pet: PetDoc = {
			...req.body,
		};
		const insertedPet = await req.db.insert<PetDoc>(pet);
		return res.status(201).send(insertedPet);
	} catch (error) {
		return res.status(500).send(error.message);
	}
});

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet by the id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet's id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Pet"
 *     responses:
 *       200:
 *         description: Successfully update a pet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pet"
 *       404:
 *         description: The pet does not found
 *       500:
 *         description: Internal server error while processing request
 */

router.put('/:id', async (req: Request, res: Response) => {
	try {
		const pet = await req.db.findOne<PetDoc>({ _id: req.params.id });
		if (!pet) {
			return res.sendStatus(404);
		}
		const updatedPet = await req.db.update<PetDoc>(
			{ _id: req.params.id },
			{ $set: req.body },
			{ returnUpdatedDocs: true }
		);

		return res.send(updatedPet);
	} catch (error) {
		return res.status(500).send(error.message);
	}
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Remove a pet record by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet's id
 *     responses:
 *       200:
 *         description: The pet was deleted
 *       404:
 *         description: The pet was not found
 */

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const pet = await req.db.findOne<PetDoc>({ _id: req.params.id });
		if (!pet) {
			return res.sendStatus(404);
		}

		await req.db.remove({ _id: req.params.id }, {});

		return res.sendStatus(200);
	} catch (error) {
		return res.status(500).send(error.message);
	}
});

export default router;
