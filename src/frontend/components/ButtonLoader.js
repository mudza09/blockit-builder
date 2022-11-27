import React, { useState } from 'react'

export default function ButtonLoader(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [btnSuccess, setBtnSuccess] = useState(false)

    const handleButton = () => {
        if(props.callback !== undefined) {
            props.callback()

            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
                setBtnSuccess(true)
            }, 1500)
            setTimeout(() => {
                setBtnSuccess(false)
            }, 3000)
        } else if(props.status == true && props.refElement !== undefined) {
            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
                setBtnSuccess(true)
            }, 1500)
            setTimeout(() => {
                setBtnSuccess(false)
            }, 3000)
        }
    }

    return (
        <button id={props.id} className={props.class} type={props.type} onClick={handleButton} ref={props.refElement}>
            {isLoading 
                ? <><i className="fas fa-spinner fa-spin fa-sm uk-margin-small-right"></i>Loading...</> 
                : btnSuccess
                    ? <><i className="fas fa-check fa-sm uk-margin-small-right"></i>{props.success}</>
                    : <><i className="fas fa-save fa-sm uk-margin-small-right"></i>{props.default}</>
            }
        </button>
    )
}