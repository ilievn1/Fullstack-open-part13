import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':{
            return action.payload
        }
        case 'CLR':{
            return ''
        }
        default:
            return state
        }
}

export const notificationChange = message => {
    return {
      type: 'SET',
      payload: message,
    }
}

export const notificationClear = () => {
    return {
      type: 'CLR',
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext