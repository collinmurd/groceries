import express, { Request, Response , Application } from 'express';
import mongoose from 'mongoose';

import { ItemData, Item } from './models/item'
import { IItem } from '@groceries/shared';
import { pinoHttp } from 'pino-http';
import { pino } from 'pino';
import { Feature, FeatureData } from './models/feature';

const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
const ENV = process.env.ENV || 'dev';

const app: Application = express();
const port = process.env.PORT || 8000;
const logger = pino();

const INTERNAL_SERVER_ERROR = 'Internal Server Error';

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

// CORS
app.use((req, res, next) => {
  if (ENV === 'dev') {
    // allow any origin for dev
    res.header('Access-Control-Allow-Origin', req.headers.origin)
  } else if (ENV === 'prod') {
    // TODO: determine origin from runtime environment
    // just gonna hardcode this for now... gonna need to fix http too...
    res.header('Access-Control-Allow-Origin', 'http://149.130.214.183');
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there');
});

////////// Items

app.get('/items', async (req: Request, res: Response) => {
  Item.find()
    .then(data => res.send(data.map(item => item.dto())))
    .catch(_ => res.status(500).send(INTERNAL_SERVER_ERROR))
});

app.post('/items', (req: Request<any, any, ItemData>, res: Response<IItem | string>) => {
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

app.post('/items:batchDelete', (req: Request<any, any, string[]>, res: Response) => {
  Item.deleteMany({_id: { $in: req.body }})
    .then(_ => res.status(204).send())
    .catch(err => {
      res.status(500).send(INTERNAL_SERVER_ERROR)
    });
});

app.put('/items/:itemId', (req: Request<any, any, ItemData>, res: Response) => {
  Item.findByIdAndUpdate(req.params.itemId, {...req.body}, {new: true})
    .then(data => {
      if (data) {
        res.send(data.dto())
      } else {
        res.status(404).send('Not Found')
      }
    })
    .catch(err => {
      res.status(500).send(INTERNAL_SERVER_ERROR)
    });
});

app.delete('/items/:itemId', (req: Request<any, any, ItemData>, res: Response) => {
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

////////// Features

app.post('/features', (req: Request<any, any, FeatureData>, res: Response) => {
  const data = new Feature({...req.body});
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

app.get('/features', (req: Request, res: Response) => {
  Feature.find()
    .then(data => res.send(data.map(item => item.dto())))
    .catch(_ => res.status(500).send(INTERNAL_SERVER_ERROR))
});

interface FeaturePatchPayload {name?: string, enabled?: string};
app.patch('/features/:featureId', (req: Request<any, any, FeaturePatchPayload>, res: Response) => {
  Feature.findByIdAndUpdate(req.params.featureId, {enabled: req.body.enabled}, {new: true})
    .then(data => {
      if (data) {
        res.send(data.dto())
      } else {
        res.status(404).send('Not Found')
      }
    })
    .catch(_ => {
      res.status(500).send(INTERNAL_SERVER_ERROR)
    });
});

function initFeatures() {
  // define features
  const features = [
    {name: 'default-sections', enabled: true},
  ];

  features.forEach(feature => {
    Feature.findOne({name: feature.name})
      .then(data => {
        if (!data) {
          const newFeature = new Feature(feature);
          newFeature.save();
        }
      });
  });
}

async function main() {
  logger.info('Connecting to mongoDB');
  await mongoose.connect(`mongodb://${MONGO_HOST}:27017/groceries`);
  mongoose.Schema.Types.String.checkRequired(v => v != null); // 'required' in mongoose by default will reject empty strings, https://github.com/Automattic/mongoose/issues/7150

  logger.info('Initializing features');
  initFeatures();

  app.listen(port, () => {
    logger.info('Server is ready');
  });
}

main();

