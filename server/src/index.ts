import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { IItemDao, Item } from './models'
import { IItem } from '@groceries/shared';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there');
});

app.get('/items', async (req: Request, res: Response<IItem[]>) => {
  Item.find()
    .then(data => res.send(data.map(item => item.dto())));
});

app.post('/items', (req: Request<any, any, IItemDao>, res: Response<IItem | string>) => {
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

app.delete('/items/:itemId', (req: Request<any, any, IItemDao>, res: Response) => {
  Item.findByIdAndDelete(req.params.itemId)
    .then(_ => res.status(204).send())
    .catch(err => {
      if (err.name == 'CastError') {
        res.status(404).send('Item not found');
      } else {
        res.status(500).send(`Internal Server Error: ${err.name}`);
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

