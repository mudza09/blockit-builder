import React, { useEffect, useRef } from 'react'
import UIkit from 'uikit'

export default function NavigationCanvas(props) {
    const navWrap = useRef(null)

    // handle drag and drop event
    const handleDragDrop = () => {
        UIkit.util.on(navWrap.current, 'moved', (item) => {
            const navName = item.detail[1].querySelector('.label-name').textContent
            const prevIndex = item.detail[0].origin.index
            const newIndex = item.detail[0].items.map(el => el.querySelector('.label-name').textContent).indexOf(navName)

            // parent condition
            if(props.data[0] !== undefined && item.path[1].tagName !== 'LI') {
                handleArrayMenu(props.data, prevIndex, newIndex)
            }

            // child condition
            if(props.data[0] !== undefined && item.path[1].tagName == 'LI') {
                const parentName = item.path[1].querySelector('.label-name').textContent
                const parentActive = props.data.find(item => item.title == parentName)
                handleArrayMenu(Object.values(parentActive.dropdown)[0], prevIndex, newIndex)
            }
        })
    }

    // handle array index position of menu
    const handleArrayMenu = (arr, fromIndex, toIndex) => {
        const element = arr[fromIndex]
        arr.splice(fromIndex, 1)
        arr.splice(toIndex, 0, element)
    }

    // handle navigation child
    const handleNavigationChild = (nav) => {
        if(nav.dropdown !== undefined && nav.dropdown.child !== undefined) {
            return (
                <ul className="as-child uk-list uk-margin-medium-left" data-uk-sortable="handle: .child-nav; cls-custom: drag-nav" hidden={nav.dropdown.child.length == 0 ? true : false}>
                    {
                        nav.dropdown.child.map((item, index) => {
                            return (
                                <li key={index}>
                                    <div className="wrap-nav child-nav">
                                        {
                                            item.icon !== undefined
                                            ? <span className="label-name" data-label-link={item.link} data-label-icon={item.icon.name}><i className="fas fa-level-up-alt fa-sm uk-margin-small-right"></i>{item.title}</span>
                                            : <span className="label-name" data-label-link={item.link}><i className="fas fa-level-up-alt fa-sm uk-margin-small-right"></i>{item.title}</span>
                                        }
                                        <button className="btn-edit uk-button uk-button-text uk-button-small uk-margin-left" onClick={(e) => props.editNav(e, item, props.internalData)}>Edit</button>
                                        <div className="uk-position-top-right">
                                            <button className="btn-delete uk-button fas fa-trash-alt uk-label uk-border-pill" onClick={(e) => props.deleteNav(e, item, props.data)}></button>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
    }

    // handle navigation child text
    const handleNavigationChildText = (nav) => {
        if(nav.dropdown !== undefined && nav.dropdown.child_text !== undefined) {
            return (
                <div className="wrap-nav text-nav uk-margin-medium-left uk-transition-toggle">
                    {nav.dropdown.child_text}
                </div>
            )
        }
    }

    useEffect(() => handleDragDrop(), [props.data])

    return (
        <div className="nav-arrange">
            <ul className="as-parent uk-list" data-uk-sortable="handle: .parent-nav; cls-custom: drag-nav" ref={navWrap}>
                {
                    props.data.map((item, index) => {
                        return (
                            <li key={index}>
                                <div className="wrap-nav parent-nav">
                                    <span className="label-name" data-label-link={item.link}><i className="fas fa-bars fa-sm uk-margin-small-right"></i>{item.title}</span>
                                    <button className="btn-edit uk-button uk-button-text uk-button-small uk-margin-left" onClick={(e) => props.editNav(e, item, props.internalData)}>Edit</button>
                                    <button className="btn-child uk-button uk-button-text uk-button-small" onClick={() => props.addChildNav(item)}>Add child</button>
                                    <div className="uk-position-top-right">
                                        <button className="btn-delete uk-button fas fa-trash-alt uk-label uk-border-pill" onClick={(e) => props.deleteNav(e, item, props.data)}></button>
                                    </div>
                                </div>
                                {handleNavigationChildText(item)}
                                {handleNavigationChild(item)}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}