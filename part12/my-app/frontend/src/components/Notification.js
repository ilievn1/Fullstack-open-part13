import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const [message, dispatch] = useContext(NotificationContext)

  let chosenStyle = null

  if (message === null) {
    return null
  } else if (message.includes('added')
            || message.includes('successfully')) {
    chosenStyle = "success"
  } else {
    chosenStyle = "error"
  }

  return (
    <Alert className="notification" severity={chosenStyle}>
      {message}
    </Alert>
  );
}

export default Notification