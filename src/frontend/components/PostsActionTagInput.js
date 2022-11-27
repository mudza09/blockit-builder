import React, { useState, useEffect } from 'react'

export default function PostsActionTagInput(props) {
    const [tagPost, setTagPost] =  useState([])

    useEffect(() => {
        if(props.mode == 'edit' && props.data !== undefined) {
            setTagPost(props.data == 'untagged' ? null : props.data.join(', '))
        }
    }, [props.data])

    return (
        <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="post-tags">Tags <i className="fas fa-info-circle fa-xs" data-uk-tooltip="title: Separate tags with commas; pos: right"></i></label>
            <input className="uk-input uk-border-rounded" id="post-tags" type="text" defaultValue={tagPost} />
        </div>
    )
}