import { v1 as uuid } from 'uuid';

import patientsData from '../../data/patients';
import { NonSensitivePatientInfo, Patient, NewPatientInfo, Entry, EntryWithoutId } from '../types';

const getEntries = (): Patient[] => {
    return patientsData;
};

const getNonSensitiveEntries = (): NonSensitivePatientInfo[] => {
    return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const findById = (id: string): Patient | undefined => {
    const entry = patientsData.find(p => p.id === id);
    return entry;
};

const addPatient = (entry: NewPatientInfo): Patient => {
    const id = uuid();
    const newPatientEntry = {
        id,
        ...entry
    };

    patientsData.push(newPatientEntry);
    return newPatientEntry;
};

const addPatientEntry = (patientID: string,entry: EntryWithoutId): Entry => {
    const id = uuid();
    const patient = findById(patientID);
    const newPatientEntry = {
        id,
        ...entry
    };
    patient?.entries.push(newPatientEntry);
    patientsData.map(p => p.id === patientID ? patient : p);
    return newPatientEntry;
};

export default {
    getEntries,
    getNonSensitiveEntries,
    findById,
    addPatient,
    addPatientEntry
};