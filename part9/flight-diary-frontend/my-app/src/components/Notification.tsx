const Notification = ({ message }: {message: string | null} ) => {
    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    const failStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    let chosenStyle = null

    if (message === null) {
        return null
    } else if (message.includes('added')
        || message.includes('successfully')) {
        chosenStyle = successStyle
    } else {
        chosenStyle = failStyle
    }

    return (
        <div className='notification' style={chosenStyle}>
            {message}
        </div>
    )
}

export default Notification