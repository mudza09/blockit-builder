import React, { useRef } from 'react'

export default function SettingsSocialMedia(props) {
    const socialMediaForm = useRef(null)

    // handle social media form
    const handleSocialMediaForm = () => {
        const form = socialMediaForm.current

        props.data[0].facebook = form.querySelector('#setting-social-facebook').value
        props.data[1].twitter = form.querySelector('#setting-social-twitter').value
        props.data[2].instagram = form.querySelector('#setting-social-instagram').value
        props.data[3].linkedin = form.querySelector('#setting-social-linkedin').value
        props.data[4].behance = form.querySelector('#setting-social-behance').value
        props.data[5].whatsapp = form.querySelector('#setting-social-whatsapp').value
        props.data[6].telegram = form.querySelector('#setting-social-telegram').value
        props.data[7].youtube = form.querySelector('#setting-social-youtube').value
    }

    return (
        <li className="social-media">
            <h4 className="uk-heading-line"><span>Social media</span></h4>
            <span className="uk-text-small uk-text-muted setting-info"><i className="fas fa-info-circle fa-xs uk-margin-small-right"></i>Leave blank if you don't want use</span>
            <form className="uk-form-horizontal uk-margin-medium" onKeyUp={handleSocialMediaForm} ref={socialMediaForm}>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-facebook"><i className="fab fa-facebook-square fa-lg uk-margin-small-right"></i>Facebook</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-facebook" type="text" defaultValue={props.data !== undefined ? props.data[0].facebook : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-twitter"><i className="fab fa-twitter fa-lg uk-margin-small-right"></i>Twitter</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-twitter" type="text" defaultValue={props.data !== undefined ? props.data[1].twitter : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-instagram"><i className="fab fa-instagram fa-lg uk-margin-small-right"></i>Instagram</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-instagram" type="text" defaultValue={props.data !== undefined ? props.data[2].instagram : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-linkedin"><i className="fab fa-linkedin fa-lg uk-margin-small-right"></i>Linkedin</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-linkedin" type="text" defaultValue={props.data !== undefined ? props.data[3].linkedin : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-behance"><i className="fab fa-behance fa-lg uk-margin-small-right"></i>Behance</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-behance" type="text" defaultValue={props.data !== undefined ? props.data[4].behance : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-whatsapp"><i className="fab fa-whatsapp fa-lg uk-margin-small-right"></i>Whatsapp</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-whatsapp" type="text" defaultValue={props.data !== undefined ? props.data[5].whatsapp : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-telegram"><i className="fab fa-telegram-plane fa-lg uk-margin-small-right"></i>Telegram</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-telegram" type="text" defaultValue={props.data !== undefined ? props.data[6].telegram : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-social-youtube"><i className="fab fa-youtube fa-lg uk-margin-small-right"></i>Youtube</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-social-youtube" type="text" defaultValue={props.data !== undefined ? props.data[7].youtube : ''} />
                    </div>
                </div>
            </form>
        </li>
    )
}