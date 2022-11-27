import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bs from '../utils/bs'

export default function Dashboard() {
    const [data, setData] = useState([])

    // get data from socket
    const socketDashboard = () => {
        bs.socket.emit('getDashboardData', 'empty')
        bs.socket.once('dashboardData', data => setData(data))
    }

    useEffect(() => socketDashboard(), [])

    return (
        <div className="uk-section uk-section-primary uk-preserve-color uk-background-cover uk-background-bottom-center blockit-index" style={{backgroundImage: 'url("assets/img/in-home-background.png")'}}>
            <div className="uk-container">
                <div className="uk-grid uk-flex uk-flex-middle" data-uk-height-viewport="expand: true">
                    <div className="uk-width-1-1 in-margin-bottom-60@s">
                        <div className="uk-grid uk-flex uk-flex-center">
                            <div className="uk-width-3-5@m uk-light in-offset-top-50 in-margin-top-30@s uk-text-center">
                                <h2 className="uk-margin-small-top uk-margin-remove-bottom">Hi, this is a Blockit</h2>
                                <p className="uk-margin-remove-top">A static HTML builder from Indonez.</p>
                            </div>
                            <div className="uk-width-1-1@m">
                                <div className="uk-grid uk-grid-small uk-child-width-1-3@m uk-margin-medium-top blockit-dashboard" data-uk-grid data-uk-height-match="target: > div > .uk-card">
                                    <div>
                                        <Link to="/pages" className="uk-card uk-card-body uk-card uk-card-default uk-border-rounded">
                                            <div className="uk-flex uk-flex-middle">
                                                <i className="fas fa-clone fa-lg uk-margin-small-right uk-text-primary"></i>
                                                <h4 className="uk-margin-remove uk-text-primary">Pages</h4>
                                            </div>
                                            <p className="uk-text-small uk-margin-top uk-margin-small-bottom">Add an HTML page dynamically and easily. just named, drag and drop every sections do you like.</p>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/navigation" className="uk-card uk-card-body uk-card uk-card-default uk-border-rounded">
                                            <div className="uk-flex uk-flex-middle">
                                                <i className="fas fa-compass fa-lg uk-margin-small-right uk-text-primary"></i>
                                                <h4 className="uk-margin-remove uk-text-primary">Navigation</h4>
                                            </div>
                                            <p className="uk-text-small uk-margin-top uk-margin-small-bottom">Create your website navigation, choose the name you like and then direct the link to the page.</p>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/posts" className="uk-card uk-card-body uk-card uk-card-default uk-border-rounded">
                                            <div className="uk-flex uk-flex-middle">
                                                <i className="fas fa-thumbtack fa-lg uk-margin-small-right uk-text-primary"></i>
                                                <h4 className="uk-margin-remove uk-text-primary">Posts</h4>
                                            </div>
                                            <p className="uk-text-small uk-margin-top uk-margin-small-bottom">Starting to become a blog writer is as easy as typing whatever you like, let us create the code for you.</p>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/components" className="uk-card uk-card-body uk-card uk-card-default uk-border-rounded">
                                            <div className="uk-flex uk-flex-middle">
                                                <i className="fas fa-plug fa-lg uk-margin-small-right uk-text-primary"></i>
                                                <h4 className="uk-margin-remove uk-text-primary">Components</h4>
                                            </div>
                                            <p className="uk-text-small uk-margin-top uk-margin-small-bottom">Set and customize the components used to match and complement the needs of the site you want.</p>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/settings" className="uk-card uk-card-body uk-card uk-card-default uk-border-rounded">
                                            <div className="uk-flex uk-flex-middle">
                                                <i className="fas fa-cog fa-lg uk-margin-small-right uk-text-primary"></i>
                                                <h4 className="uk-margin-remove uk-text-primary">Settings</h4>
                                            </div>
                                            <p className="uk-text-small uk-margin-top uk-margin-small-bottom">Find more settings here, you can personalize the website according to your wishes easily &amp; quickly.</p>
                                        </Link>
                                    </div>
                                    <div>
                                        <div className="uk-card uk-card-small uk-card-body uk-card uk-card-default uk-border-rounded">
                                            <p className="uk-text-center">Overview</p>
                                            <div className="uk-grid-divider uk-grid-small uk-child-width-1-3@m uk-text-center blockit-overview" data-uk-grid>
                                                <div>
                                                    <h3 id="pages-data" className="uk-margin-remove uk-text-primary">{data.pages}</h3>
                                                    <p className="uk-text-small uk-margin-remove">Pages</p>
                                                </div>
                                                <div>
                                                    <h3 id="posts-data" className="uk-margin-remove uk-text-primary">{data.posts}</h3>
                                                    <p className="uk-text-small uk-margin-remove">Posts</p>
                                                </div>
                                                <div>
                                                    <h3 id="authors-data" className="uk-margin-remove uk-text-primary">{data.authors}</h3>
                                                    <p className="uk-text-small uk-margin-remove">Authors</p>
                                                </div>
                                                <div className="uk-width-1-1 uk-text-center">
                                                    <p className="uk-text-small uk-text-muted uk-margin-remove-bottom">
                                                        <span id="bk-desc">{data.theme}</span> running on <span id="bk-name">{data.name}</span> <span id="bk-ver">{data.version}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}