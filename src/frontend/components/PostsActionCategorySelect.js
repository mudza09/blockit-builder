import React, { useEffect, useRef } from 'react'

export default function PostsActionCategorySelect(props) {
    const categorySelect = useRef(null)

    // category select
    const setCategory = (current) => {
        const select = categorySelect.current
        current.length == 0 || current == 'Uncategorized' ? select.value = '0' : select.value = current
    }

    useEffect(() => {
        if(props.data !== undefined) {
            setCategory(props.data.current)
        }
    }, [props.data])

    return (
        <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="post-category">Category</label>
            <select className="uk-select uk-border-rounded" id="post-category" ref={categorySelect}>        
                <option value="0">Uncategorized</option>
                {
                    props.data !== undefined
                        ? props.data.select.map(item => {
                            return <option key={item} value={item}>{item}</option>
                        })
                        : null
                }
            </select>
        </div>
    )
}