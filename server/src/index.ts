import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { IItem, Item } from './models'

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there');
});

app.get('/items', async (req: Request, res: Response) => {
  Item.find()
    .then(data => res.send(data.map(item => item.dto())));
});

app.post('/items', (req: Request<any, any, IItem>, res: Response) => {
  const data = new Item({...req.body});
  data.save()
    .then(data => res.send(data.dto()))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err.message);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/groceries');

  app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
  });
}

main();

