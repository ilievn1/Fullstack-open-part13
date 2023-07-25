import { PermContactCalendar, Numbers, Work, Female, Male } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Diagnosis, EntryWithoutId, Patient } from "../../types";
import { Button, Chip } from "@mui/material";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddPatientModalCopy";
import axios from "axios";

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
    const [patient, setPatient] = useState<Patient | null>();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;

        const fetchPatient = async () => {
            const retrievedPatient = await patientService.getPatient(id);
            setPatient(retrievedPatient);
        };

        void fetchPatient();

    }, [id]);

    if (!patient || !id) return null;



    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            const newEntry = await patientService.createEntry(id, values);
            setPatient({ ...patient, entries: [...patient.entries, newEntry] });
            setModalOpen(false);
        } catch (e: unknown) {
            console.log('.log inspecting error element shape\n', e);
            if (axios.isAxiosError(e)) {
                if (e?.response?.data && typeof e?.response?.data === "string") {
                    const message = e.response.data.replace('Something went wrong. Error: ', '');
                    console.error(message);
                    setError(message);
                } else {
                    setError("Unrecognized axios error");
                }
            } else {
                console.error("Unknown error", e);
                setError("Unknown error");
            }
        }
    };

    return (
        <div style={{ marginTop: 10 }}>
            <h4>{patient.name}</h4>
            <Chip label={patient.gender} icon={patient.gender === 'male' ? <Male /> : <Female />} />

            {patient.ssn && (
                <Chip
                    label={patient.ssn}
                    icon={<Numbers />}
                />
            )}

            <Chip
                label={patient.occupation}
                icon={<Work />}
            />

            {patient.dateOfBirth && (
                <Chip
                    label={new Date(patient.dateOfBirth).toLocaleDateString()}
                    icon={<PermContactCalendar />}
                />
            )}
            <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
                diagnoses={diagnoses}
            />
            <Button variant="contained" onClick={() => openModal()}>
                Add New Entry
            </Button>

            <h3>Entries</h3>
            {
                patient.entries.map(entry => (<EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />))
            }

        </div>

    );
};

export default PatientPage;
