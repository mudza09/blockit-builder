import React, { useRef } from 'react'

export default function Notification(props) {
    const { status, filename } = props.status
    const notifWrap = useRef(null)

    if(status) {
        setTimeout(() => {
            notifWrap.current.classList.remove('uk-animation-slide-top-small')
            notifWrap.current.classList.add('uk-animation-slide-bottom-small', 'uk-animation-reverse')
        }, 3000)

        setTimeout(() => props.callback(false), 3300)

        return (
            <div className="uk-alert-primary uk-animation-slide-top-small" ref={notifWrap} data-uk-alert>
                <i className="fas fa-exclamation-circle"></i> "{filename}" {props.message}
            </div>
        )
    } else {
        return null
    }
}