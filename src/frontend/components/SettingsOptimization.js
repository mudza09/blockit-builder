import React, { useEffect, useRef } from 'react'

export default function SettingsBlog(props) {
    const optimizationForm = useRef(null)
    const htmlCheck = useRef(null)
    const cssCheck = useRef(null)
    const jsCheck = useRef(null)

    // show minify check
    const minifyAssetsCheck = (condition) => {
        const form = optimizationForm.current
        if(condition.html) form.querySelector('#setting-minifying-html').checked = true
        if(condition.css) form.querySelector('#setting-minifying-css').checked = true
        if(condition.js) form.querySelector('#setting-minifying-js').checked = true
    }

    // handle optimization form
    const handleOptimizationForm = () => {
        const htmlCheckEnable = htmlCheck.current.checked
        const cssCheckEnable = cssCheck.current.checked
        const jsCheckEnable = jsCheck.current.checked

        props.data.minifyAssets.html = htmlCheckEnable ? true : false
        props.data.minifyAssets.css = cssCheckEnable ? true : false
        props.data.minifyAssets.js = jsCheckEnable ? true : false
    }

    useEffect(() => {
        if(props.data !== undefined) {
            minifyAssetsCheck(props.data.minifyAssets)
        }
    }, [props.data])

    return (
        <li className="blog">
            <h4 className="uk-heading-line"><span>Optimization</span></h4>
            <form className="uk-form-horizontal uk-margin-medium" onChange={handleOptimizationForm} ref={optimizationForm}>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-show-widgets">Minify assets</label>
                    <div className="uk-form-controls uk-form-controls-text">
                        <label><input className="uk-checkbox" type="checkbox" id="setting-minifying-html" ref={htmlCheck} /> HTML files</label><br />
                        <label><input className="uk-checkbox" type="checkbox" id="setting-minifying-css" ref={cssCheck} /> CSS files</label><br />
                        <label><input className="uk-checkbox" type="checkbox" id="setting-minifying-js" ref={jsCheck} /> JS files</label><br />
                    </div>
                </div>
            </form>
        </li>
    )
}