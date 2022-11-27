import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

export default function Navigation() {
    const location = useLocation().pathname
    const nav = [
        {
            title: "Dashboard",
            link: "dashboard"
        },
        {
            title: "Pages",
            link: "pages",
            icon: "fa-clone"
        },
        {
            title: "Navigation",
            link: "navigation",
            icon: "fa-compass"
        },
        {
            title: "Posts",
            link: "posts",
            icon: "fa-thumbtack"      
        },
        {
            title: "Components",
            link: "components",
            icon: "fa-plug"
        },
        {
            title: "Settings",
            link: "settings",
            icon: "fa-cog"
        }
    ]

    return (
        <nav className="uk-navbar-container" data-uk-sticky="show-on-up: true; animation: uk-animation-slide-top;">
            <div className="uk-container uk-container-expand" data-uk-navbar>
                <div className="uk-navbar-left">
                    <div className="uk-navbar-item">
                        <Logo />
                    </div>
                    <ul className="uk-navbar-nav uk-visible@m">
                    {
                        nav.map(
                            item => {
                                if(item.icon !== undefined) {
                                    return <li {...(item.link == location.split("/")[1] ? {className: "uk-active"} : {})} key={item.title}><Link to={item.link}>{item.icon !== undefined ? <i className={'fa ' + item.icon + ' fa-sm'}></i> : ''}{item.title}</Link></li>
                                }
                            }
                        )
                    }
                    </ul>
                </div>
                <div className="uk-navbar-right">
                    <div className="uk-navbar-item uk-visible@m in-optional-nav uk-margin-medium-left">
                        <a href={`http://localhost:3000`} className="uk-button uk-button-primary uk-button-small uk-border-pill" target="_blank"><i className="fas fa-expand"></i>Preview</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}