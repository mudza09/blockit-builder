import React, { useState, useEffect, useRef } from 'react'
import uploadImage from '../utils/uploadImage'
import removeParam from '../utils/removeParam'
import '../assets/js/coloris'

export default function SettingsSiteinfo(props) {
    const siteInfoForm = useRef(null)

    // favicon and touch icon
    const [faviconLoading, setFaviconLoading] = useState(false)
    const [touchIconLoading, setTouchIconLoading] = useState(false)
    const [imageFavicon, setImageFavicon] = useState(`http://localhost:3000/img/in-lazy.gif`)
    const [imageTouchIcon, setImageTouchIcon] = useState(`http://localhost:3000/img/in-lazy.gif`)

    // coloris button color for meta theme color
    const buttonMetaThemeColor = (color) => {
        const form = siteInfoForm.current
        const buttonColor = form[4]
        buttonColor.style.backgroundColor = color
        form.querySelector('#setting-meta-themecolor').addEventListener('change', e => {
            props.data.metaThemeColor = e.target.value
        })
    }

    // handle site info form
    const handleSiteInfoForm = () => {
        const form = siteInfoForm.current
        const favicon = form.querySelector('img[alt="setting-favicon"]').getAttribute('src').replace(`http://localhost:3000/`, '')
        const touchIcon = form.querySelector('img[alt="setting-touch-icon"]').getAttribute('src').replace(`http://localhost:3000/`, '')

        props.data.pageTitle = form.querySelector('#setting-page-title').value
        props.data.metaDescription = form.querySelector('#setting-meta-description').value
        props.data.metaKeywords = form.querySelector('#setting-meta-keywords').value.replace(/\s/g, '').split(',')
        props.data.metaAuthor = form.querySelector('#setting-meta-author').value
        props.data.favicon = removeParam('browsersync', favicon)
        props.data.touchIcon = removeParam('browsersync', touchIcon)
    }

    // handle upload favicon
    const handleUploadFavicon = (e) => {
        uploadImage({
            favicon: true,
            inputEvent: e.target,
            selector: "setting-favicon",
            fileName: "favicon",
            useButton: true,
            loading: setFaviconLoading,
            path: setImageFavicon
        })
        setTimeout(() => {
            handleSiteInfoForm()
        }, 500)
    }

    // handle upload touch icon
    const handleUploadTouchIcon = (e) => {
        uploadImage({
            touchIcon: true,
            inputEvent: e.target,
            selector: "setting-touch-icon",
            fileName: "touch-icon",
            useButton: true,
            loading: setTouchIconLoading,
            path: setImageTouchIcon
        })
        setTimeout(() => {
            handleSiteInfoForm()
        }, 500)
    }

    useEffect(() => {
        if(props.data !== undefined) {
            buttonMetaThemeColor(props.data.metaThemeColor)
            setImageFavicon(`http://localhost:3000/${props.data.favicon}`)
            setImageTouchIcon(`http://localhost:3000/${props.data.touchIcon}`)
        }
        Coloris({el: '#setting-meta-themecolor'})
    }, [props.data])

    return (
        <li className="site-info">
            <h4 className="uk-heading-line"><span>Site info</span></h4>
            <form className="uk-form-horizontal uk-margin-medium" onChange={handleSiteInfoForm} ref={siteInfoForm}>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-page-title">Page Title</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-page-title" type="text" defaultValue={props.data !== undefined ? props.data.pageTitle : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-meta-description">Meta description</label>
                    <div className="uk-form-controls">
                        <textarea className="uk-textarea uk-border-rounded" id="setting-meta-description" rows="4" defaultValue={props.data !== undefined ? props.data.metaDescription : ''}></textarea>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-meta-keywords">Meta keywords <i className="fas fa-info-circle fa-xs" data-uk-tooltip="title: Separate tags with commas; pos: right"></i></label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-meta-keywords" type="text" defaultValue={props.data !== undefined ? props.data.metaKeywords.join(', ') : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-meta-author">Meta author</label>
                    <div className="uk-form-controls">
                        <select className="uk-select uk-border-rounded" id="setting-meta-author" defaultValue={props.data !== undefined ? props.data.metaAuthor : ''}>
                        {
                            props.authorsSelect !== undefined
                            ? props.authorsSelect.map(item => {
                                return <option key={item.id} data-id={item.id} value={item.name}>{item.name}</option>
                            })
                            : null
                        }
                        </select>
                    </div>
                </div>
                <div className="uk-margin setting-colors">
                    <label className="uk-form-label" htmlFor="setting-meta-themecolor">Meta theme color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-meta-themecolor" type="text" defaultValue={props.data !== undefined ? props.data.metaThemeColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-favicon">Favicon</label>
                    <div className="uk-grid-small uk-flex uk-flex-middle setting-favicon" data-uk-grid>
                        <div className="uk-width-auto uk-flex uk-flex-center uk-flex-middle">
                            <img src={imageFavicon} alt="setting-favicon" />
                        </div>
                        <div className="uk-width-expand">
                            <div data-uk-form-custom>
                                <input className="favicon-upload" type="file" onChange={handleUploadFavicon} />
                                <button className="uk-button uk-button-secondary uk-border-rounded upload-favicon-btn" type="button">
                                    { faviconLoading 
                                        ? <><i className="fas fa-spinner fa-sm fa-spin uk-margin-small-right"></i>Loading...</>
                                        : <><i className="fas fa-upload fa-sm uk-margin-small-right"></i>Change favicon</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-touch-icon">Touch icon</label>
                    <div className="uk-grid-small uk-flex uk-flex-middle setting-touch-icon" data-uk-grid>
                        <div className="uk-width-auto uk-flex uk-flex-center uk-flex-middle">
                            <img src={imageTouchIcon} alt="setting-touch-icon" />
                        </div>
                        <div className="uk-width-expand">
                            <div data-uk-form-custom>
                                <input className="touch-icon-upload" type="file" onChange={handleUploadTouchIcon} />
                                <button className="uk-button uk-button-secondary uk-border-rounded upload-touch-icon-btn" type="button">
                                    { touchIconLoading 
                                        ? <><i className="fas fa-spinner fa-sm fa-spin uk-margin-small-right"></i>Loading...</>
                                        : <><i className="fas fa-upload fa-sm uk-margin-small-right"></i>Change icon</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </li>
    )
}