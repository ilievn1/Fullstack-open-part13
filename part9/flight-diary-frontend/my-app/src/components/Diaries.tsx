import { NonSensitiveDiaryEntry } from "../types"

const Diaries = ({ diaries }: { diaries: NonSensitiveDiaryEntry[] }): JSX.Element => {
    return (
        <div>
            <h2>Diary entries</h2>
            <ul>
                {diaries.map(d =>
                    <li key={d.id}>{d.date} {d.visibility} {d.weather}</li>
                )}
            </ul>
        </div>
    )
}

export default Diaries