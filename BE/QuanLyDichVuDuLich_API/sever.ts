import { Request, Response } from 'express';
import express from 'express';
const app = express();
const port = 6000;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
  });

