import express from "express";
const app = express();
import cors from 'cors';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';

app.use(cors());
app.use(express.json());


app.get("/api/ping", (_req, res) => {
  console.log("connection from client to server established upon startup");
  res.send("pong");
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
