import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  