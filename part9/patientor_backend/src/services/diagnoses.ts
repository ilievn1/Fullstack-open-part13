import diagnosesData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => {
    return diagnosesData;
};

const addDiary = () => {
    return null;
};

export default {
    getEntries,
    addDiary
};