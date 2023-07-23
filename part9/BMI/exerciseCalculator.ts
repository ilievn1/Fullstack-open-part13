import { isNotNumber } from "./utils";

interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}
export const calculateExercises = (dailyExerciseHours: number[], dailyTargetHours: number): Result => {
    const periodLength = dailyExerciseHours.length;
    const trainingDays = dailyExerciseHours.filter(hours => hours > 0).length;
    const totalHours = dailyExerciseHours.reduce((sum, hours) => sum + hours, 0);
    const average = totalHours / periodLength * 1.0;
    const target = dailyTargetHours;
    const success = average >= target;
    let rating: number;
    let ratingDescription: string;

    if (success) {
        rating = 3;
        ratingDescription = "excellent";
    } if (average >= target - 0.5) {
        rating = 2;
        ratingDescription = "meh";
    } else {
        rating = 1;
        ratingDescription = "poor";
    }

    const result = {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average,
    };

    return result;
};

interface varSizeArgs {
    dailyExerciseHours: number[];
    target: number;
}
const parseArguments = (args: string[]): varSizeArgs => {
    if (args.length < 2) throw new Error('Not enough arguments\n, need at least target and one exercise day');

    const isValidArguments = args.every(arg => !isNotNumber(arg));

    if (isValidArguments) {
        const argsAsNumbers = args.map(arg => Number(arg));
        return {
            dailyExerciseHours: argsAsNumbers.slice(1),
            target: argsAsNumbers[0]
        };

    } else {
        throw new Error('Provided values were not numbers!');
    }
};

if (require.main === module) {
    try {
        const { dailyExerciseHours, target } = parseArguments(process.argv.slice(2));
        console.log(calculateExercises(dailyExerciseHours, target));
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        console.log(error);
    }
}



