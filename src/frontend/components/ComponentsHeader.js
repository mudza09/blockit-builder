import React, { useState, useEffect, useRef } from 'react'
import uploadImage from '../utils/uploadImage'
import removeParam from '../utils/removeParam'

export default function SettingsHeader(props) {
    const headerForm = useRef(null)

    // site logo
    const [logoLoading, setLogoLoading] = useState(false)
    const [imageLogo, setImageLogo] = useState(`http://localhost:3000/img/in-lazy.gif`)

    // handle header form
    const handleHeaderForm = () => {
        const form = headerForm.current
        const logo = form.querySelector('img[alt="setting-site-logo"]').getAttribute('src').replace(`http://localhost:3000/`, '')

        props.data.siteLogo.src = removeParam('browsersync', logo)
        props.data.siteLogo.width = form.querySelector('#setting-logo-width').value
        props.data.siteLogo.height = form.querySelector('#setting-logo-height').value

        props.data.signup.title = form.querySelector('#setting-signup-title').value
        props.data.signup.url = form.querySelector('#setting-signup-url').value
        props.data.signup.external = form.querySelector('#setting-signup-url').value.substring(0, 4) == 'http' ? true : false
        props.data.signup.display = form.querySelector('#setting-signup-title').value.length !== 0 ? true : false

        props.data.signin.title = form.querySelector('#setting-signin-title').value
        props.data.signin.url = form.querySelector('#setting-signin-url').value
        props.data.signin.external = form.querySelector('#setting-signin-url').value.substring(0, 4) == 'http' ? true : false
        props.data.signin.display = form.querySelector('#setting-signin-title').value.length !== 0 ? true : false
    }

    // handle upload logo
    const handleUploadLogo = (e) => {
        uploadImage({
            inputEvent: e.target,
            selector: "setting-site-logo",
            fileName: "logo",
            useButton: true,
            loading: setLogoLoading,
            path: setImageLogo
        })
        setTimeout(() => {
            handleHeaderForm()
        }, 500)
    }

    useEffect(() => {
        if(props.data !== undefined) {
            setImageLogo(`http://localhost:3000/${props.data.siteLogo.src}`)
        }
        Coloris({el: '#setting-meta-themecolor'})
    }, [props.data])

    return (
        <li className="header">
            <h4 className="uk-heading-line"><span>Header</span></h4>
            <form className="uk-form-horizontal uk-margin-medium" onChange={handleHeaderForm} ref={headerForm}>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-site-logo">Site logo</label>
                    <div className="uk-grid-small setting-site-logo uk-flex uk-flex-middle" data-uk-grid>
                        <div className="uk-width-auto">
                            <img src={imageLogo} alt="setting-site-logo" />
                        </div>
                        <div className="uk-width-expand">
                            <div data-uk-form-custom>
                                <input className="site-logo-upload" type="file" onChange={handleUploadLogo} />
                                <button className="uk-button uk-button-secondary uk-border-rounded upload-logo-btn" type="button">
                                    { logoLoading
                                        ? <><i className="fas fa-spinner fa-sm fa-spin uk-margin-small-right"></i>Loading...</>
                                        : <><i className="fas fa-upload fa-sm uk-margin-small-right"></i>Change logo</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-logo-dimension">Logo dimension <i className="fas fa-info-circle fa-xs" data-uk-tooltip="title: Size in pixels; pos: right"></i></label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded setting-number-dimension" id="setting-logo-width" type="number" defaultValue={props.data !== undefined ? props.data.siteLogo.width : ''} />
                        <span className="uk-text-muted uk-margin-small-left uk-margin-small-right">x</span>
                        <input className="uk-input uk-border-rounded setting-number-dimension" id="setting-logo-height" type="number" defaultValue={props.data !== undefined ? props.data.siteLogo.height : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-signup">Sign up title &amp; url</label>
                    <div className="uk-form-stacked uk-grid-small uk-grid" data-uk-grid>
                        <div className="uk-width-1-2">
                            <input className="uk-input uk-border-rounded" id="setting-signup-title" type="text" defaultValue={props.data !== undefined ? props.data.signup.title : ''} key={props.data !== undefined ? props.data.signup.title : ''} />
                        </div>
                        <div className="uk-width-1-2">
                            <input className="uk-input uk-border-rounded" id="setting-signup-url" type="text" defaultValue={props.data !== undefined ? props.data.signup.url : ''} key={props.data !== undefined ? props.data.signup.url : ''} />
                        </div>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-signin">Sign in title &amp; url</label>
                    <div className="uk-form-stacked uk-grid-small uk-grid" data-uk-grid>
                        <div className="uk-width-1-2">
                            <input className="uk-input uk-border-rounded" id="setting-signin-title" type="text" defaultValue={props.data !== undefined ? props.data.signin.title : ''} key={props.data !== undefined ? props.data.signin.title : ''} />
                        </div>
                        <div className="uk-width-1-2">
                            <input className="uk-input uk-border-rounded" id="setting-signin-url" type="text" defaultValue={props.data !== undefined ? props.data.signin.url : ''} key={props.data !== undefined ? props.data.signin.url : ''} />
                        </div>
                    </div>
                </div>
            </form>
        </li>
    )
}