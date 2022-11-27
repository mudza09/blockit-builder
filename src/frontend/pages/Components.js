import React, { useState, useEffect } from 'react'
import bs from '../utils/bs'
import ComponentsSlideshow from '../components/ComponentsSlideshow'
import ComponentsHeader from '../components/ComponentsHeader'
import ComponentsFooter from '../components/ComponentsFooter'
import ComponentsContactMap from '../components/ComponentsContactMap'
import ComponentsSocialMedia from '../components/ComponentsSocialMedia'
import ButtonLoader from '../components/ButtonLoader'

export default function Components() {
    const [data, setData] = useState({})

    // get data from socket
    const socketComponents = () => {
        bs.socket.emit('getComponentsData', 'empty')
        bs.socket.once('componentsData', data => setData(data))
    }

    // handle save components button
    const handleSaveComponents = () => {
        sessionStorage.clear()
        bs.socket.emit('saveComponents', data)
    }

    // components slideshow callback
    const componentsSlideshowCallback = (resultData, indexPosition, mode) => {
        if(mode == 'delete') {
            const filteredSlide = data.slideshow
            filteredSlide[indexPosition].slides = resultData

            setData( {...data, slideshow: filteredSlide} )
        }

        if(mode == 'add') {
            const filteredSlide = data.slideshow
            filteredSlide[indexPosition].slides.push(resultData)

            setData( {...data, slideshow: filteredSlide} )
        }
    }

    // components contact callback
    const componentsContactCallback = (resultData) => {
        setData( {...data, contact: resultData} )
    }

    useEffect(() => socketComponents(), [])
    
    return (
        <div className="uk-section blockit-components">
            <div className="uk-container">
                <div className="uk-grid uk-flex uk-flex-middle in-offset-bottom-40">
                    <div className="uk-width-1-2">
                        <h4 className="head-title">Components</h4>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-right blockit-notif">
                        <ButtonLoader
                            id="save-components"
                            class="uk-button uk-button-primary uk-border-rounded"
                            default="Save components"
                            success="Saved successfully"
                            callback={handleSaveComponents}
                        />
                    </div>
                </div>
                <div className="uk-grid">
                    <div className="uk-width-1-1">
                        <div className="components-wrap" data-uk-grid>
                            <div className="uk-width-1-5">
                                <ul className="uk-tab-left" data-uk-tab="connect: #component-tab-left; animation: uk-animation-fade">
                                    <li><a href="#slideshow">Slideshow</a></li>
                                    <li><a href="#header">Header</a></li>
                                    <li><a href="#footer">Footer</a></li>
                                    <li><a href="#contact">Contact &amp; Map</a></li>
                                    <li><a href="#social-media">Social media</a></li>
                                </ul>
                            </div>
                            <div className="uk-width-expand@m">
                                <div className="uk-card uk-card-default uk-card-body uk-border-rounded">
                                    <ul id="component-tab-left" className="uk-switcher">
                                        <ComponentsSlideshow data={data.slideshow} callback={componentsSlideshowCallback} />
                                        <ComponentsHeader data={data.header} />
                                        <ComponentsFooter data={data.footer} />
                                        <ComponentsContactMap data={data.contactMap} callback={componentsContactCallback} />
                                        <ComponentsSocialMedia data={data.socialMedia} />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}