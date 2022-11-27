import React, { useState, useEffect, useRef } from 'react'
import uploadImage from '../utils/uploadImage'
import removeParam from '../utils/removeParam'

export default function SettingsAuthors(props) {
    const authorsForm = useRef(null)

    // upload image author state
    const [imageAuthor, setImageAuthor] = useState([`http://localhost:3000/img/in-avatar.svg`])

    // handle footer form
    const handleAuthorsForm = () => {
        const form = authorsForm.current

        props.data.forEach((each, index) => {
            const avatar = form.querySelectorAll('img[alt="profile-picture"]')[index].getAttribute('src').replace(`http://localhost:3000/`, '')

            each.avatar = removeParam('browsersync', avatar)
            each.name = form.querySelectorAll('.setting-author-name')[index].value
            each.email = form.querySelectorAll('.setting-author-email')[index].value
            each.role = form.querySelectorAll('.setting-author-role')[index].value
        })
    }

    // handle upload author image
    const handleUploadAuthor = (e, index) => {
        uploadImage({
            position: index,
            inputEvent: e.target,
            selector: "setting-profile",
            fileName: "author",
            useButton: false,
            path: updateAvatar
        })
        setTimeout(() => {
            handleAuthorsForm()
        }, 500)
    }

    // handle update avatar after upload
    const updateAvatar = (path, index) => {
        const updateAvatar = [...imageAuthor]
        updateAvatar[index] = path
        setImageAuthor(updateAvatar)
    }

    // handle add author
    const handleAddAuthor = (e) => {
        e.preventDefault()

        const newAuthor = {
            id: Math.random().toString(24).slice(8),
            name: '',
            email: '',
            role: '',
            avatar: 'img/in-avatar.svg'
        }        
        props.callback(newAuthor, 'add')
        getAuthorImage(props.data)
    }

    // handle delete author
    const handleDeleteAuthor = (e, index) => {
        e.preventDefault()
        const resultData = props.data.filter(each => each != props.data[index])
        props.callback(resultData, 'delete')
    }

    // set image author state
    const getAuthorImage = (data) => {
        data.forEach(each => {
            setImageAuthor([...imageAuthor, `http://localhost:3000/${each.avatar}`])
        })
    }

    useEffect(() => {
        if(props.data !== undefined) {
            getAuthorImage(props.data)
        }
    }, [props.data])

    return (
        <li className="authors">
            <h4 className="uk-heading-line"><span>Authors</span></h4>
            <form className="authors-form-wrap uk-margin-medium" onChange={handleAuthorsForm} ref={authorsForm}>
                {
                    props.data !== undefined
                        ? props.data.map((each, index) => {
                            return (
                                <div key={index} className="uk-form-stacked uk-grid-small uk-margin uk-grid" data-uk-grid>
                                    <div className="uk-width-auto uk-flex uk-flex-bottom uk-form-custom uk-first-column" data-uk-form-custom="">
                                        <div className="uk-inline-clip uk-transition-toggle setting-profile">
                                            <img src={imageAuthor[index]} alt="profile-picture" />
                                            <div className="uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle">
                                                <input className="img-author-upload" type="file" onChange={(e) => handleUploadAuthor(e, index)}/>
                                                <button className="uk-button fas fa-camera uk-label uk-border-pill" type="button"></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="uk-width-1-4">
                                        <label className="uk-form-label" htmlFor="setting-author-name">Name</label>
                                        <div className="uk-form-controls">
                                            <input className="uk-input uk-border-rounded setting-author-name" type="text" defaultValue={each.name} />
                                        </div>
                                    </div>
                                    <div className="uk-width-1-4">
                                        <label className="uk-form-label" htmlFor="setting-author-email">Email</label>
                                        <div className="uk-form-controls">
                                            <input className="uk-input uk-border-rounded setting-author-email" type="text" defaultValue={each.email} />
                                        </div>
                                    </div>
                                    <div className="uk-width-1-4">
                                        <label className="uk-form-label" htmlFor="setting-author-role">Role</label>
                                        <div className="uk-form-controls">
                                            <input className="uk-input uk-border-rounded setting-author-role" type="text" defaultValue={each.role} />
                                        </div>
                                    </div>
                                    <div className="uk-width-expand uk-flex uk-flex-bottom">
                                        <button className="uk-button uk-button-default uk-border-rounded delete-author-btn uk-width-1-1" onClick={(e) => handleDeleteAuthor(e, index)}>
                                            <i className="fas fa-trash-alt fa-sm uk-margin-small-right"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                        : null
                }
            </form>
            <hr />
            <div className="uk-width-1-1 uk-flex uk-flex-right uk-margin-small-bottom">
                <button id="add-author" className="uk-button uk-button-secondary uk-border-rounded" onClick={handleAddAuthor}>
                    <i className="fas fa-plus-circle fa-sm uk-margin-small-right"></i>Add new author
                </button>
            </div>
        </li>
    )
}