import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { IItemDao, Item } from './models'
import { IItem } from '@groceries/shared';
import { pinoHttp } from 'pino-http';

dotenv.config();

const INTERNAL_SERVER_ERROR = "Internal Server Error";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(pinoHttp({
  serializers: {
    req: (req: Request) => ({
      id: req.id,
      method: req.method,
      url: req.url
    }),
    res: (res: Response) => ({
      statusCode: res.statusCode
    })
  }
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there');
});

app.get('/items', async (req: Request, res: Response) => {
  Item.find()
    .then(data => res.send(data.map(item => item.dto())))
    .catch(err => res.status(500).send(INTERNAL_SERVER_ERROR))
});

app.post('/items', (req: Request<any, any, IItemDao>, res: Response<IItem | string>) => {
  const data = new Item({...req.body});
  data.save()
    .then(data => res.send(data.dto()))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err.message);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR);
      }
    });
});

app.put('/items/:itemId', (req: Request<any, any, IItemDao>, res: Response) => {
  Item.findByIdAndUpdate(req.params.itemId, {...req.body}, {new: true})
    .then(data => {
      if (data) {
        res.send(data.dto())
      } else {
        res.status(404).send("Not Found")
      }
    })
    .catch(err => {
      res.status(500).send(INTERNAL_SERVER_ERROR)
    });
});

app.delete('/items/:itemId', (req: Request<any, any, IItemDao>, res: Response) => {
  Item.findByIdAndDelete(req.params.itemId)
    .then(_ => res.status(204).send())
    .catch(err => {
      if (err.name == 'CastError') {
        res.status(404).send('Item not found');
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR);
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

