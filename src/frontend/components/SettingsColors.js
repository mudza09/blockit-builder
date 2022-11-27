import React, { useEffect, useRef } from 'react'
import '../assets/js/coloris'

export default function SettingsColors(props) {
    const colorsForm = useRef(null)

    // coloris button color for meta theme color
    const buttonSettingsColor = (color) => {
        const form = colorsForm.current
        const buttonColor = {
            primary: form[0],
            secondary: form[2],
            success: form[4],
            info: form[6],
            warning: form[8],
            danger: form[10],
            light: form[12],
            dark: form[14],
            background: form[16],
            text: form[18],
            link: form[20]
        } 

        buttonColor.primary.style.backgroundColor = color.primaryColor
        buttonColor.secondary.style.backgroundColor = color.secondaryColor
        buttonColor.success.style.backgroundColor = color.successColor
        buttonColor.info.style.backgroundColor = color.infoColor
        buttonColor.warning.style.backgroundColor = color.warningColor
        buttonColor.danger.style.backgroundColor = color.dangerColor
        buttonColor.light.style.backgroundColor = color.lightColor
        buttonColor.dark.style.backgroundColor = color.darkColor
        buttonColor.background.style.backgroundColor = color.backgroundColor
        buttonColor.text.style.backgroundColor = color.textColor
        buttonColor.link.style.backgroundColor = color.linkColor
        
        form.querySelector('#setting-primary-color').addEventListener('change', e => props.data.primaryColor = e.target.value)
        form.querySelector('#setting-secondary-color').addEventListener('change', e => props.data.secondaryColor = e.target.value)
        form.querySelector('#setting-success-color').addEventListener('change', e => props.data.successColor = e.target.value)
        form.querySelector('#setting-info-color').addEventListener('change', e => props.data.infoColor = e.target.value)
        form.querySelector('#setting-warning-color').addEventListener('change', e => props.data.warningColor = e.target.value)
        form.querySelector('#setting-danger-color').addEventListener('change', e => props.data.dangerColor = e.target.value)
        form.querySelector('#setting-light-color').addEventListener('change', e => props.data.lightColor = e.target.value)
        form.querySelector('#setting-dark-color').addEventListener('change', e => props.data.darkColor = e.target.value)
        form.querySelector('#setting-background-color').addEventListener('change', e => props.data.backgroundColor = e.target.value)
        form.querySelector('#setting-text-color').addEventListener('change', e => props.data.textColor = e.target.value)
        form.querySelector('#setting-link-color').addEventListener('change', e => props.data.linkColor = e.target.value)
    }

    useEffect(() => {
        if(props.data !== undefined) {
            buttonSettingsColor(props.data)
        }
        Coloris({el: '#setting-primary-color'})
        Coloris({el: '#setting-secondary-color'})
        Coloris({el: '#setting-success-color'})
        Coloris({el: '#setting-info-color'})
        Coloris({el: '#setting-warning-color'})
        Coloris({el: '#setting-danger-color'})
        Coloris({el: '#setting-light-color'})
        Coloris({el: '#setting-dark-color'})
        Coloris({el: '#setting-background-color'})
        Coloris({el: '#setting-text-color'})
        Coloris({el: '#setting-link-color'})
    }, [props.data])

    return (
        <li className="colors">
            <h4 className="uk-heading-line"><span>Colors</span></h4>
            <form className="uk-form-horizontal uk-margin-medium setting-colors" ref={colorsForm}>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-primary-color">Primary color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-primary-color" type="text" defaultValue={props.data !== undefined ? props.data.primaryColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-secondary-color">Secondary color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-secondary-color" type="text" defaultValue={props.data !== undefined ? props.data.secondaryColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-success-color">Success color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-success-color" type="text" defaultValue={props.data !== undefined ? props.data.successColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-info-color">Info color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-info-color" type="text" defaultValue={props.data !== undefined ? props.data.infoColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-warning-color">Warning color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-warning-color" type="text" defaultValue={props.data !== undefined ? props.data.warningColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-danger-color">Danger color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-danger-color" type="text" defaultValue={props.data !== undefined ? props.data.dangerColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-light-color">Light color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-light-color" type="text" defaultValue={props.data !== undefined ? props.data.lightColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-dark-color">Dark color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-dark-color" type="text" defaultValue={props.data !== undefined ? props.data.darkColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-background-color">Background color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-background-color" type="text" defaultValue={props.data !== undefined ? props.data.backgroundColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-text-color">Text color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-text-color" type="text" defaultValue={props.data !== undefined ? props.data.textColor : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-link-color">Link color</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-link-color" type="text" defaultValue={props.data !== undefined ? props.data.linkColor : ''} />
                    </div>
                </div>
            </form>
        </li>
    )
}