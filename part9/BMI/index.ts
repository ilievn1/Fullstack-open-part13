import express from 'express';
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

import { isNotNumber } from './utils';
const app = express();
app.use(express.json());
app.get('/hello', (_req, res) => {
    res.send('Hello Fullstack!');
});

app.get('/bmi', (req, res) => {

    const { height, weight } = req.query;

    if (!height || !weight ||
        typeof height !== "string" || typeof weight !== "string" ||
        isNotNumber(height) || isNotNumber(weight))
    {
        return res.status(400).json({
            error: "malformatted parameters"
        });
    } else {
        const bmi = calculateBmi(Number(height), Number(weight));
        return res.status(200).json({ weight: Number(weight), height: Number(height), bmi });
    }

});

app.post('/exercises', (req, res) => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const daily_exercises: any = req.body.daily_exercises;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const target: any = req.body.target;

    if (!target || !daily_exercises) {
        return res.status(400).json({ error: "parameters missing" });
    } else if (!Array.isArray(daily_exercises) || !daily_exercises.every((h: any) => !isNotNumber(h)) || isNotNumber(target)) {
        return res.status(400).json({ error: "malformatted parameters" });
    } else {
        return res.json(calculateExercises(daily_exercises, Number(target)));
    }
});
const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});