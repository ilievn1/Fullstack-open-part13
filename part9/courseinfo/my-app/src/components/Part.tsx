import { CoursePart } from "../types";

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const Part = ({ coursePart }: { coursePart: CoursePart }): JSX.Element => {
    switch (coursePart.kind) {
        case 'basic': {
            return (
                <div>
                    <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
                    <i>{coursePart.description}</i>
                </div>
            )
        }
        case 'group': {
            return (
                <div>
                    <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
                    <p>project exercises {coursePart.groupProjectCount}</p >
                </div>
            )
        }
        case 'background': {
            return (
                <div>
                    <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
                    <i>{coursePart.description}</i >
                    <p>background material {coursePart.backgroundMaterial}</p>
                </div>
            )
        }
        case 'special': {
            return (
                <div>
                    <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
                    <i>{coursePart.description}</i >
                    <p>Prerequisites: {coursePart.requirements.join(', ')}</p>
                </div>
            )
        }
        default:
            assertNever(coursePart);
            return (<></>)
    }
}

export default Part