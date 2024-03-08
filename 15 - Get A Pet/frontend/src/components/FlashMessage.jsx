import './FlashMessage.css'

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const FlashMessage = (props) => {
    const [visible, setVisible] = useState(false)
    const [cancelCross, setCancelCross] = useState(false)
    const [prevLocation, setPrevLocation] = useState(useLocation().pathname)
    const location = useLocation()

    useEffect(() => {
        setVisible(true)
        // setTimeout(() => {
        //     setVisible(false)
        // }, props.)
    }, [props.flashMessage.count])

    useEffect(() => {
        if (props.flashMessage.type === 'inner' || cancelCross) {
            setVisible(false)
            setCancelCross(false)
        }
        else if (props.flashMessage.type == 'cross') {
            props.flashMessage.type = 'inner'
            setCancelCross(true)
        }

    }, [location.pathname])

    return (
        <>
            {visible && (
                <div id='flash-container'>
                    <div className={`flash-${props.flashMessage.level}`}>
                        <h4>
                            {props.flashMessage.message}
                        </h4>
                    </div>
                </div>
            )}
        </>
    )
}

export default FlashMessage