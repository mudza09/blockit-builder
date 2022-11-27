import React, { useState, useEffect } from 'react'
import bs from '../utils/bs'
import UIkit from 'uikit'
import uploadImage from '../utils/uploadImage'

export default function PostsActionFeaturedImage(props) {
    const [imagePost, setImagePost] = useState('../assets/img/blockit-image-post.svg')
    const [uploadLoading, setUploadLoading] = useState(false)

    // handle upload featured image
    const handleUploadFeatured = (e) => {
        uploadImage({
            inputEvent: e.target,
            selector: "post-image",
            fileName: "image-post",
            useButton: false,
            loading: setUploadLoading,
            path: setImagePost
        })
    }

    // handle delete featured image
    const handleDeleteFeatured = async (e, path) => {
        e.preventDefault()

        const deletedAsset = path.replace(`http://localhost:3000/img/user/`, ``)

        UIkit.modal.confirm('Featured image will be deleted, are you ok with that?').then(async () => {
            setUploadLoading(true)        
            bs.socket.emit('assetsDelete', deletedAsset)
            await new Promise(resolve => bs.socket.once('deleteDone', message => {
                resolve(
                    setUploadLoading(false),
                    setImagePost('../assets/img/blockit-image-post.svg')
                )
            }))
        }, () => null)
    }

    useEffect(() => {
        if(props.data !== undefined) {
            setImagePost(props.data !== false ? `http://localhost:3000/${props.data}` : '../assets/img/blockit-image-post.svg')
        }
    }, [props.data])

    return (
        <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="form-author-avatar">
                Featured image <i className="fas fa-info-circle fa-xs" data-uk-tooltip="title: Use 1170 x 528 px image size; pos: right"></i><button className="delete-image-btn uk-button fas fa-trash-alt uk-label uk-border-pill uk-float-right" onClick={(e) => handleDeleteFeatured(e, imagePost)} hidden={ imagePost == '../assets/img/blockit-image-post.svg' ? true : false }></button>
            </label>
            <div className="uk-form-controls uk-margin-small-bottom">
                <div className="uk-width-1-1" data-uk-form-custom>
                    <div className="uk-inline-clip uk-transition-toggle post-image uk-flex uk-flex-center uk-flex-middle" tabIndex="0">
                        { uploadLoading ? <i className="fas fa-spinner fa-spin fa-2x uk-text-muted"></i> : <img src={imagePost} alt="post-image" /> }
                        <div className="uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle" hidden={ imagePost !== '../assets/img/blockit-image-post.svg' ? true : false }>                                                        
                            <input className="img-post-upload" type="file" onChange={handleUploadFeatured} />
                            <button className="uk-button uk-button-secondary uk-border-rounded" type="button" tabIndex="-1">
                                <i className="fas fa-upload fa-sm uk-margin-small-right"></i>Upload image
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}