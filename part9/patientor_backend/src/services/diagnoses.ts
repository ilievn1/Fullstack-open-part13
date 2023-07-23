import diagnosesData from '../../data/diagnoses';
import { DiagnosisEntry } from '../types';

const getEntries = (): DiagnosisEntry[] => {
    return diagnosesData;
};

const addDiary = () => {
    return null;
};

export default {
    getEntries,
    addDiary
};