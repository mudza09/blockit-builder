import React from 'react'
import Navigation from './Navigation'

export default function Header() {
    return (
        <header>
            <div className="uk-section uk-padding-remove-vertical">        
                <Navigation />
            </div>
        </header>
    )
}