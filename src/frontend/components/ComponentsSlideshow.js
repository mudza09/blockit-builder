import React from 'react'
import ShortUniqueId from 'short-unique-id'
import bs from '../utils/bs'
import UIkit from 'uikit'
import ComponentsSlideshowForm from './ComponentsSlideshowForm'
import ComponentsSlideshowPlaceholder from './ComponentsSlideshowPlaceholder'

export default function ComponentsSlideshow(props) {
    // id generator
    const uid = new ShortUniqueId({ length: 6 })

    // handle add slide item
    const handleAddSlide = async (e) => {
        const indexPosition = e.target.closest('li').classList[0].split('-')[2] - 1
        const newSlide = uid()

        bs.socket.emit('getSlideItem', `slide-${newSlide}`)
        await new Promise(resolve => bs.socket.once('slideItem', data => resolve(sessionStorage.setItem(data.blocks[0].id, JSON.stringify(data))))) 

        const resultSlide = {
            id: newSlide,
            text: JSON.parse(sessionStorage.getItem(`slide-${newSlide}`)).blocks[0].data.text
        }
        props.callback(resultSlide, indexPosition, 'add')
    }

    // handle delete slide item
    const handleDeleteSlide = (e, data, parentData) => {
        e.preventDefault()

        UIkit.modal.confirm(`Slide with id : "${data}" will be deleted, are you ok with that?`).then(() => {
            const groupPosition = e.target.closest('li').classList[0].split('-')[2] - 1
            const rawData = parentData.slides
            const deletedSlide = rawData.filter(item => item.id !== data)
            props.callback(deletedSlide, groupPosition, 'delete')
            sessionStorage.removeItem(`slide-${data}`)
        }, () => null)
    }
    
    return (
        <li className="slideshows">
            <h4 className="uk-heading-line"><span>Slideshow</span></h4>
            <div className="slideshows-form-wrap uk-margin-medium">
                <ul className="uk-subnav uk-subnav-pill slide-group-nav" data-uk-switcher="animation: uk-animation-fade">
                    {
                        props.data !== undefined
                        ? props.data.map((group, index) => {
                            return (
                                <li key={index + 1}>
                                    <a href="#">Preset {index + 1}</a>
                                </li>
                            )
                        })
                        : null
                    }
                </ul>
                <ul className="uk-switcher uk-margin slide-group-content">
                    {
                        props.data !== undefined
                        ? props.data.map((group, index) => {
                            return (
                                <li key={index + 1} className={`slide-group-${index + 1}`}>
                                    {
                                        group.slides.length == 0
                                        ? <ComponentsSlideshowPlaceholder />
                                        : group.slides.map((each, index) => {
                                            return (
                                                <ComponentsSlideshowForm key={index + 1} data={each} parentData={group} index={index} callback={handleDeleteSlide} />
                                            )
                                        })
                                    }
                                    <hr className="uk-margin-medium-top" />
                                    <div className="uk-width-1-1 uk-flex uk-flex-right uk-margin-small-bottom">
                                        <button className="add-slide uk-button uk-button-secondary uk-border-rounded" onClick={(e) => handleAddSlide(e)}>
                                            <i className="fas fa-plus-circle fa-sm uk-margin-small-right"></i>Add new slide
                                        </button>
                                    </div>
                                </li>
                            )
                        })
                        : null
                    }
                </ul>
            </div>
        </li>
    )
}