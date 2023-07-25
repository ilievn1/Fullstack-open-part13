import { Diagnosis, EntryWithoutId, Gender, HealthCheckRating, HospitalDischarge, NewPatientInfo, SickLeave } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string';
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseName = (name: unknown): string => {
    if (!name ||!isString(name)) {
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

export const toNewPatientInfo = (object: unknown): NewPatientInfo => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing request data');
    }
    const isFieldsPresent = 'name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object;

    if (isFieldsPresent) {
        const newEntry: NewPatientInfo = {
            name: parseName(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSSN(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: []
        };
        return newEntry;
    }
    throw new Error('Incorrect request data: some fields are missing');

};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {

    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        return [] as Array<Diagnosis['code']>;
    }

    return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
    if (isNaN(Number(rating)) || !isHealthCheckRating(Number(rating))) {
        throw new Error(`Error inside parseHealthCheckRating: Non-valid HealthCheckRating - ${rating}`);
    }
    return Number(rating);
};

const parseDischarge = (discharge: unknown): HospitalDischarge => {
    const isRequiredFieldsPresent = discharge && typeof discharge === 'object' && ("date" in discharge) && ("criteria" in discharge);

    if (isRequiredFieldsPresent) {
        const newDischarge: HospitalDischarge = {
            date: parseDate(discharge.date),
            criteria: parseName(discharge.criteria)
        };
        return newDischarge;
    } else {
        throw new Error('Error inside parseDischarge: Incorrect/missing data');

    }
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
    if (!sickLeave || typeof sickLeave !== 'object' || !("startDate" in sickLeave) || !("endDate" in sickLeave)) return undefined;

    const isRequiredFieldsPresent = sickLeave.startDate && sickLeave.endDate;
    if (isRequiredFieldsPresent) {
        const newSickLeave: SickLeave = {
            startDate: parseDate(sickLeave.startDate),
            endDate: parseDate(sickLeave.endDate),
        };
        return newSickLeave;
    } else {
        throw new Error('Error inside parseSickLeave: Incorrect/missing data');

    }

};

export const toNewPatientEntry = (object: unknown): EntryWithoutId => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing request data');
    }

    const isBaseFieldsPresent = 'description' in object && 'date' in object && 'specialist' in object && 'type' in object;

    if (isBaseFieldsPresent) {

        switch (object.type) {
            case "Hospital": {
                if ('discharge' in object) {
                    const newEntry: EntryWithoutId = {
                        type: object.type,
                        description: parseName(object.description),
                        date: parseDate(object.date),
                        specialist: parseName(object.specialist),
                        discharge: parseDischarge(object.discharge),
                        diagnosisCodes: parseDiagnosisCodes(object)
                    };
                    return newEntry;
                }
            }
                break;
            case "OccupationalHealthcare":{
                if ('employerName' in object) {
                    const newEntry: EntryWithoutId = {
                        type: object.type,
                        description: parseName(object.description),
                        date: parseDate(object.date),
                        specialist: parseName(object.specialist),
                        employerName: parseName(object.employerName),
                        sickLeave: 'sickLeave' in object ? parseSickLeave(object.sickLeave) : undefined,
                        diagnosisCodes: parseDiagnosisCodes(object)
                    };
                    return newEntry;
                }
                break;
            }
            case "HealthCheck":{
                if ('healthCheckRating' in object) {
                    const newEntry: EntryWithoutId = {
                        type: object.type,
                        description: parseName(object.description),
                        date: parseDate(object.date),
                        specialist: parseName(object.specialist),
                        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
                        diagnosisCodes: parseDiagnosisCodes(object)
                    };
                    return newEntry;
                }
                break;
            }
            default:
                throw new Error("Invalid entry type");

        }
    }
    throw new Error('Incorrect request data: some fields are missing');

};