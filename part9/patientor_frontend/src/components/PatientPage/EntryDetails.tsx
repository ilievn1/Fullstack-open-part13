import {
    Box,
    Card,
    Chip,
    List,
    ListItem,
    Tooltip,
    Typography,
} from "@mui/material";
import { CalendarToday, Favorite } from "@mui/icons-material";
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import { getFavoriteIconColor } from "../../utils";
import _ from "lodash";

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
    return (
        <Box>
            <p>Hospital Details</p>
            <List>
                <ListItem>Discharge criteria: {entry.discharge.criteria}</ListItem>
                <ListItem>Discharge date: {entry.discharge.date}</ListItem>
            </List>
        </Box>
    );
};

const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
    return (
        <Box>
            <p>Occupational Healthcare Details</p>
            <List>
                <ListItem>Employer name: {entry.employerName}</ListItem>
                {entry.sickLeave && (
                    <>
                        <ListItem>
                            Sick leave start date: {entry.sickLeave.startDate}
                        </ListItem>
                        <ListItem>
                            Sick leave end date: {entry.sickLeave.endDate}
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {

    return (
        <Box>
            <p>Health Check Details</p>
            <Favorite style={{ color: `${getFavoriteIconColor(entry.healthCheckRating)}` }} />
        </Box>
    );
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry, diagnoses: Diagnosis[] }) => {
    const codeIDs = entry.diagnosisCodes ? entry.diagnosisCodes : [];

    const diagIDsWithDesc = _.intersectionWith(diagnoses, codeIDs, (diagnose, diagId) => diagnose.code === diagId)

    const renderSwitch = (entry: Entry) => {
        switch (entry.type) {
            case "Hospital":
                return <HospitalEntryDetails entry={entry} />;
            case "HealthCheck":
                return <HealthCheckEntryDetails entry={entry} />;
            case "OccupationalHealthcare":
                return <OccupationalHealthcareEntryDetails entry={entry} />;
            default:
                throw new Error(`Unhandled discriminated union member: ${JSON.stringify(entry)}`);
        }
    };
    return (
        <Card key={entry.id} style={{borderStyle:'dotted'}}>
            <Tooltip title="Date">
                <Chip
                    label={new Date(entry.date).toLocaleDateString()}
                    icon={<CalendarToday />}
                ></Chip>
            </Tooltip>
            <Typography>{entry.description}</Typography>
            <List>
                {diagIDsWithDesc.map(d => {
                    return (<ListItem key={d.code}>
                        {d.code} {d.name}
                    </ListItem>)
                })}
            </List>
            {renderSwitch(entry)}
        </Card>
    );
};

export default EntryDetails;