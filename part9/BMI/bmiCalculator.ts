import { isNotNumber } from "./utils";


export const calculateBmi = (heightInCm: number, weightInKg: number): string => {
    const heightInMeters: number = heightInCm / 100.0;
    
    const bmi: number = weightInKg / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return 'Normal (healthy weight)';
    } else if (bmi >= 25 && bmi < 29.9) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
};

interface bmiValues {
    height: number;
    weight: number;
}

export const parseArguments = (args: string[]): bmiValues => {
    if (args.length < 2) throw new Error('Not enough arguments');
    if (args.length > 2) throw new Error('Too many arguments');

    const isValidArguments = args.every(arg => !isNotNumber(arg));
    if (isValidArguments) {
        return {
            height: Number(args[0]),
            weight: Number(args[1])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};
if (require.main === module) {
    try {
        const { height, weight } = parseArguments(process.argv.slice(2));
        console.log(calculateBmi(height, weight));
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        console.log(error);
    }
}

