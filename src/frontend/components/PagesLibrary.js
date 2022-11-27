import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import UIkit from 'uikit'

export default function PagesLibrary(props) {
    let navigate = useNavigate()
    const libraryWrap = useRef(null)
    const placeholdWrap = props.placeholderRef

    // handle drag and drop event
    const handleDragDrop = () => {
        UIkit.util.on(libraryWrap.current, 'start', () => {
            placeholdWrap.current.setAttribute('hidden', '')
        })

        UIkit.util.on(libraryWrap.current, 'added', () => {
            libraryWrap.current.querySelectorAll('.sections-name').forEach(item => {
                item.querySelector('.uk-transition-fade').classList.remove('uk-flex-middle')
                item.querySelector('.uk-transition-fade').classList.add('uk-flex-bottom')
                item.querySelector('.uk-text-small').removeAttribute('hidden', '')
                item.querySelector('.uk-button').setAttribute('hidden', '')
                
                const modalEl = item.querySelector('.uk-modal-container')
                if(modalEl !== null && !modalEl.hasAttribute('hidden')) {
                    modalEl.setAttribute('hidden', '')
                }
            })
        })
    }

    // slideshow html edit condition
    const htmlCodeCondition = (item, index) => {
        item.includes('slideshow') 
            ? navigate('/components') 
            : props.handleEditor(item, index)
    }

    useEffect(() => handleDragDrop(), [])

    return (
        <div className="scrollable-content sortable-library" ref={libraryWrap}>
            {
                props.data.map(library => {
                    return (
                        <div key={library.name} id={'wrap-'+library.name.toLowerCase()}>
                            <h5 className="uk-heading-line"><span><i className={'fas '+library.icon+' fa-sm uk-margin-small-right'}></i>{library.name}</span></h5>
                            <div className="sortable-box uk-grid-small uk-child-width-1-2" data-uk-sortable="group: sortable-group;" data-uk-grid="masonry: true">
                                {
                                    library.sections.sort((a,b) => a.length - b.length).map((each, index) => {                        
                                        const item = each.split('.')[0]
                                        return (
                                            <div key={item} className={'sections-name '+item}>
                                                <div className="uk-inline-clip uk-transition-toggle">
                                                    <img className="uk-border-rounded" src={"../assets/img/sections/"+item+".webp"} alt={item}/>
                                                    <div className="uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-bottom">
                                                        <span className="uk-text-small">{item}</span>
                                                        <button className="uk-button uk-button-secondary uk-border-rounded section-button" type="button" data-uk-toggle={item.includes('slideshow') ? 'disable' : `target: #modal-${item}`} onClick={(e) => htmlCodeCondition(item, index)} hidden>
                                                            <i className="fas fa-code fa-sm uk-margin-small-right"></i>Edit HTML code
                                                        </button>
                                                        <div id={'modal-'+item} className="uk-modal-container uk-flex-top uk-modal" data-uk-modal hidden>
                                                            <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor">
                                                                <div id={'editor-'+item}></div>
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
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}