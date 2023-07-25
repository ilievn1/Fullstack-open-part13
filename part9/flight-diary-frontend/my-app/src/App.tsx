import { useEffect, useState } from "react";
import axios from 'axios';
import NewDiaryForm from './components/NewDiaryForm';
import Notification from "./components/Notification";
import Diaries from './components/Diaries';
import { NonSensitiveDiaryEntry } from "./types";


const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [notification, setNotification] = useState<string|null>(null);



  useEffect(() => {
    axios.get('http://localhost:3001/api/diaries').then(response => {
      setDiaries(response.data as NonSensitiveDiaryEntry[])
    })
  }, [])



  return (
    <>
      <Notification message={notification} />
      <NewDiaryForm setDiaries={setDiaries} setNotification={setNotification}/>
      <Diaries diaries={diaries} />
    </>
  )
}
export default App;