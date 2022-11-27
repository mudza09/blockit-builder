import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import UIkit from 'uikit'

export default function PagesCanvas(props) {
    let navigate = useNavigate()
    const [data, setData] = useState([])
    const params = new URLSearchParams(location.search)
    const sections = params.get('sections')
    const canvasWrap = props.canvasAreaRef
    const placeholdWrap = props.placeholderRef
    const editorWrap = useRef([])

    // handle drag and drop event
    const handleDragDrop = () => {
        UIkit.util.on(canvasWrap.current, 'added', () => {
            Array.from(canvasWrap.current.children).forEach(item => {
                item.querySelector('.uk-transition-fade').classList.remove('uk-flex-bottom')
                item.querySelector('.uk-transition-fade').classList.add('uk-flex-middle')
                item.querySelector('.uk-text-small').setAttribute('hidden', '')
                item.querySelector('.uk-button').removeAttribute('hidden')

                const modalEl = item.querySelector('.uk-modal-container')
                if(modalEl !== null && modalEl.hasAttribute('hidden')) {
                    modalEl.removeAttribute('hidden')
                }
            })
        })

        UIkit.util.on(canvasWrap.current, 'removed', () => {
            if(canvasWrap.current.childElementCount === 0) {
                placeholdWrap.current.removeAttribute('hidden')
            }
        })
    }

    // slideshow html edit condition
    const htmlCodeCondition = (item, index) => {
        item.includes('slideshow')
            ? navigate('/components') 
            : props.handleEditor(item, index)
    }

    useEffect(() => {
        if(sections !== null) setData(sections.split(','))
        handleDragDrop()
        props.callback(editorWrap)
    }, [])

    return data.map((item, index) => {
        const checkPath = item.includes('section-slideshow') ? item : item.substring(0, item.lastIndexOf('-'))
        return (
            <div key={item} className={'sections-name '+item}>
                <div className="uk-inline-clip uk-transition-toggle">
                    { !item.includes('section-blog') && <img className="uk-border-rounded" src={"../assets/img/sections/"+checkPath+".webp"} alt={item}/> }
                    <div className="uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle">
                        <span className="uk-text-small" hidden>{item}</span>
                        <button className="uk-button uk-button-secondary uk-border-rounded section-button" type="button" data-uk-toggle={item.includes('slideshow') ? 'disable' : `target: #modal-${item}`} onClick={(e) => htmlCodeCondition(item, index)}>
                            <i className="fas fa-code fa-sm uk-margin-small-right"></i>Edit HTML code
                        </button>
                        <div id={'modal-'+item} className="uk-modal-container uk-flex-top uk-modal" data-uk-modal>
                            <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor">
                                <div id={'editor-'+item} ref={(element) => {editorWrap.current[index] = element}}></div>
                                <div className="uk-flex uk-flex-right">
                                    <button className="uk-button uk-button-secondary uk-border-rounded uk-modal-close" type="button">Cancel</button>
                                    <button className="uk-button uk-button-primary uk-border-rounded uk-margin-small-left section-save" type="button">Save code</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })
}   