import { Gender, NewPatientEntry } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string';
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};


const parseName = (name: unknown): string => {
    if (!isString(name)) {
        throw new Error('Incorrect name');
    }
    return name;
};

const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error(`Incorrect date: ${date}`);
    }
    return date;
};

const parseSSN = (ssn: unknown): string => {
    if (!isString(ssn)) {
        throw new Error(`Incorrect SSN ${ssn}`);
    }
    return ssn;
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error(`Incorrect ${gender}`);
    }
    return gender;
};

const parseOccupation = (occ: unknown): string => {
    if (!isString(occ)) {
        throw new Error(`Incorrect occupation ${occ}`);
    }
    return occ;
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing request data');
    }
    const isFieldsPresent = 'name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object;

    if (isFieldsPresent) {
        const newEntry: NewPatientEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSSN(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation)
        };
        return newEntry;
    }
    throw new Error('Incorrect request data: some fields are missing');

};

export default toNewPatientEntry;