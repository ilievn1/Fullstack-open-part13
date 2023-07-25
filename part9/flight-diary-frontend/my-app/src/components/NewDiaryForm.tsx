import React, { useRef } from "react";
import axios from 'axios';
import { NonSensitiveDiaryEntry } from "../types";

const NewDiaryForm = ({ setDiaries, setNotification }: {
  setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>>,
  setNotification: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const newDateRef = useRef<HTMLInputElement>(null!);
  const newVisibilityRef = useRef<HTMLInputElement>(null!);
  const newWeatherRef = useRef<HTMLInputElement>(null!);
  const newCommentRef = useRef<HTMLInputElement>(null!);

  const handleDiaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const newDiaryEntry = {
      date: newDateRef.current.value,
      weather: newWeatherRef.current.value,
      visibility: newVisibilityRef.current.value,
      comment: newCommentRef.current.value,
    }

    try {
      const response = await axios.post<NonSensitiveDiaryEntry>('http://localhost:3001/api/diaries', newDiaryEntry)
      setDiaries((prevDiar: NonSensitiveDiaryEntry[]) => prevDiar.concat(response.data))
      newDateRef.current.value = ''
      newWeatherRef.current.value = ''
      newVisibilityRef.current.value = ''
      newCommentRef.current.value = ''
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNotification(error.response?.data);
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } else {

        console.error(error);
      }
    }


  };

  return (
    <>
      <h3>Add new diary</h3>
      <form onSubmit={handleDiaryCreation}>
        <label htmlFor="newDateInput">date</label>
        <input id='newDateInput' ref={newDateRef} type="date" />
        <br />
        <label>visibility</label>
        <div>
          <label htmlFor="visibilityGreat">great</label>
          <input
            type="radio"
            id="visibilityGreat"
            value="great"
            ref={newVisibilityRef}
          />
          <label htmlFor="visibilityGood">good</label>
          <input
            type="radio"
            id="visibilityGood"
            value="good"
            ref={newVisibilityRef}
          />
          <label htmlFor="visibilityOk">ok</label>
          <input
            type="radio"
            id="visibilityOk"
            value="ok"
            ref={newVisibilityRef}
          />
          <label htmlFor="visibilityPoor">poor</label>
          <input
            type="radio"
            id="visibilityPoor"
            value="poor"
            ref={newVisibilityRef}
          />
        </div>
        <label>weather</label>
        <div>
          <label htmlFor="weatherSunny">sunny</label>

          <input
            type="radio"
            id="weatherSunny"
            value="sunny"
            ref={newWeatherRef}
          />
          <label htmlFor="weatherRainy">rainy</label>
          <input
            type="radio"
            id="weatherRainy"
            value="rainy"
            ref={newWeatherRef}
          />
          <label htmlFor="weatherCloudy">cloudy</label>
          <input
            type="radio"
            id="weatherCloudy"
            value="cloudy"
            ref={newWeatherRef}
          />
          <label htmlFor="weatherStormy">stormy</label>
          <input
            type="radio"
            id="weatherStormy"
            value="stormy"
            ref={newWeatherRef}
          />
          <label htmlFor="weatherWindy">windy</label>
          <input
            type="radio"
            id="weatherWindy"
            value="windy"
            ref={newWeatherRef}
          />
        </div>
        <br />
        <label htmlFor="newCommentInput">comment</label>
        <input id='newCommentInput' ref={newCommentRef} />
        <br />
        <button type='submit'>add</button>
      </form>
    </>
  )
}

export default NewDiaryForm