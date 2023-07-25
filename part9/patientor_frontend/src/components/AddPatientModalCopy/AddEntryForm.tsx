import { useState, SyntheticEvent } from "react";

import { TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent, ListItemText, Checkbox, OutlinedInput } from '@mui/material';

import { HealthCheckRating, EntryWithoutId, TypeOption, SickLeave, HospitalDischarge, Diagnosis } from "../../types";
import _ from "lodash";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  diagnoses: Diagnosis[];

}

interface gettersAndSettersProps {
  type: TypeOption;
  healthCheckRating: HealthCheckRating;
  onRatingChange: (event: SelectChangeEvent<number>) => void;
  employerName: string;
  setEmployerName: React.Dispatch<React.SetStateAction<string>>;
  sickLeave: SickLeave
  onSickLeaveChange: (startDate: string, endDate: string) => void;
  discharge: HospitalDischarge
  onDischargeChange: (date: string, criteria: string) => void
}

interface RatingOption {
  value: HealthCheckRating;
  label: string;
}

const ratingOptions: RatingOption[] = Object.keys(HealthCheckRating)
  .filter((key) => isNaN(Number(key))) // Filter out enum keys (numbers)
  .map((key) => ({ value: HealthCheckRating[key as keyof typeof HealthCheckRating], label: key }));

const renderTypeSpecificFields = (gettersAndSetters: gettersAndSettersProps) => {

  switch (gettersAndSetters.type) {
    case "HealthCheck":
      return (
        <>
          <InputLabel style={{ marginTop: 20 }}>Health Rating</InputLabel>
          <Select
            label="rating"
            fullWidth
            value={gettersAndSetters.healthCheckRating}
            onChange={gettersAndSetters.onRatingChange}
          >
            {ratingOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}: {option.value}
              </MenuItem>
            ))}
          </Select>
        </>
      )
    case "OccupationalHealthcare":
      return (
        <>
          <TextField
            label="employerName"
            fullWidth
            value={gettersAndSetters.employerName}
            onChange={({ target }) => gettersAndSetters.setEmployerName(target.value)}
          />
          <TextField
            type='date'
            fullWidth
            value={gettersAndSetters.sickLeave?.startDate}
            onChange={({ target }) => gettersAndSetters.onSickLeaveChange(target.value, gettersAndSetters.sickLeave?.endDate)}
          />
          <TextField
            type='date'
            fullWidth
            value={gettersAndSetters.sickLeave?.endDate}
            onChange={({ target }) => gettersAndSetters.onSickLeaveChange(gettersAndSetters.sickLeave?.startDate, target.value)}
          />
        </>
      )
    case "Hospital":
      return (
        <>
          <TextField
            type='date'
            fullWidth
            value={gettersAndSetters.discharge?.date}
            onChange={({ target }) => gettersAndSetters.onDischargeChange(target.value, gettersAndSetters.discharge?.criteria)}
          />
          <TextField
            label="criteria"
            fullWidth
            value={gettersAndSetters.discharge?.criteria}
            onChange={({ target }) => gettersAndSetters.onDischargeChange(gettersAndSetters.discharge?.date, target.value)}
          />
        </>
      )
    default:
      throw new Error(`Unhandled discriminated union member:`);
  }
};

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  // Shared fields by all entries
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [type, setType] = useState<TypeOption>(TypeOption.HealthCheck);
  const [selectedDiagnosesCodes, setSelectedDiagnosesCodes] = useState<string[]>([]);

  // Type specific fields 
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.CriticalRisk);
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState<SickLeave>({startDate: '', endDate: '' });
  const [discharge, setDischarge] = useState<HospitalDischarge>({ date: '', criteria: '' });

  // Event handlers
  const onRatingChange = (event: SelectChangeEvent<number>) => {
    event.preventDefault();
    if (typeof event.target.value === "number") {
      const value = event.target.value;
      const rating = Object.values(HealthCheckRating).find(g => g === value);
      setHealthCheckRating(Number(rating)); 
    }
  };

  const onSickLeaveChange = (startDate: string, endDate: string) => {
    const newSickLeave: SickLeave = {
      startDate,
      endDate,
    };

    setSickLeave(newSickLeave);
  };

  const onDischargeChange = (date: string, criteria: string) => {
    const newDischarge: HospitalDischarge = {
      date,
      criteria,
    };

    setDischarge(newDischarge);
  };

  const onDiagnoseCodesChange = (event: SelectChangeEvent<typeof selectedDiagnosesCodes>) => {
    const {
      target: { value },
    } = event;
    setSelectedDiagnosesCodes(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    switch (type) {
      case "HealthCheck":
        onSubmit({
          description,
          specialist,
          date,
          diagnosisCodes : selectedDiagnosesCodes,
          type,
          healthCheckRating
        });
        break;
      case "Hospital":
        onSubmit({
          description,
          specialist,
          date,
          diagnosisCodes: selectedDiagnosesCodes,
          type,
          discharge
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          description,
          specialist,
          date,
          diagnosisCodes: selectedDiagnosesCodes,
          type,
          employerName,
          sickLeave
        });
        break;
      default:
        throw new Error(`Unhandled discriminated union member inside addEntry submit handler`);
    }
  };

  const gettersAndSetters = {
    type,
    healthCheckRating,
    onRatingChange,
    employerName,
    setEmployerName,
    sickLeave,
    onSickLeaveChange,
    discharge,
    onDischargeChange,
  }

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField
          label="description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Disease codes</InputLabel>
        <Select
          multiple
          fullWidth
          value={selectedDiagnosesCodes}
          onChange={onDiagnoseCodesChange}
          input={<OutlinedInput label="Codes" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {diagnoses.map((diagnose) => (
            <MenuItem key={diagnose.code} value={diagnose.code}>
              <Checkbox checked={selectedDiagnosesCodes.indexOf(diagnose.code) > -1} />
              <ListItemText primary={diagnose.code} />
            </MenuItem>
          ))}
        </Select>

        <TextField
          type='date'
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />

        <TextField
          label="specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Type</InputLabel>
        <Select
          label="Type"
          fullWidth
          value={type}
          onChange={({ target }) => setType(target.value as TypeOption)}
        >
          {_.map(TypeOption, (value, key) => (
            <MenuItem value={key} key={key}>
              {value}
            </MenuItem>
          )
          )
          }
        </Select>

        {renderTypeSpecificFields(gettersAndSetters)}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;