import React, { useEffect, useRef } from 'react'

export default function PostsActionAuthorSelect(props) {
    const authorSelect = useRef(null)

    // author select
    const setAuthor = (current) => {
        const select = authorSelect.current
        current.length == 0 ? select.value = '0' : select.value = current
    }

    useEffect(() => {
        if(props.data !== undefined) {
            setAuthor(props.data.current)
        }
    }, [props.data])

    return (
        <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="post-author">Author name</label>
            <select className={props.status ? "uk-select uk-border-rounded uk-form-danger" : "uk-select uk-border-rounded"} id="post-author" onFocus={() => props.callback(false)} ref={authorSelect}>
                <option value="0">Please select...</option>
                {
                    props.data !== undefined
                        ? props.data.select.map(item => {
                            return <option key={item.id} data-id={item.id} value={item.name}>{item.name}</option>
                        })
                        : null
                }
            </select>
        </div>
    )
}