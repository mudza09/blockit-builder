import React, { useState, useEffect } from 'react'
import bs from '../utils/bs'
import ButtonLoader from '../components/ButtonLoader'
import SettingsSiteinfo from '../components/SettingsSiteinfo'
import SettingsColors from '../components/SettingsColors'
import SettingsAuthors from '../components/SettingsAuthors'
import SettingsBlog from '../components/SettingsBlog'
import SettingsOptimization from '../components/SettingsOptimization'
import hbsTemplate from '../utils/hbsTemplate'

export default function Settings() {
    const [data, setData] = useState({})
    const [postTag, setPostTag] = useState({})

    // get data from socket
    const socketSettings = () => {
        bs.socket.emit('getSettingsData', 'empty')
        bs.socket.once('settingsData', data => setData(data))
    }

    // handle save settings button
    const handleSaveSettings = () => {
        bs.socket.emit('saveSettingsData', data, postTag)
    }

    // handle author callback
    const handleAuthorCallback = (result, mode) => {
        if(mode == 'add') {
            const finalAuthor = data.authors
            finalAuthor.push(result)
            setData( {...data, authors: finalAuthor} )
        }
        if(mode == 'delete') {
            setData( {...data, authors: result} )
        }
    }

    // handle blog callback
    const handleBlogCallback = (result, mode) => {
        if(mode == 'add') {
            const newData = data.blog
            const addCategory = newData.categories

            addCategory.push(result)
            newData.categories = addCategory

            setData( {...data, blog: newData} )
        }
        if(mode == 'delete') {
            const newData = data.blog
            const deleteCategories = data.blog.categories.filter(each => each !== result)

            newData.categories = deleteCategories

            setData( {...data, blog: newData} )
        }
    }

    useEffect(() => socketSettings(), [])
    useEffect(() => setPostTag(hbsTemplate), [])

    return (
        <div className="uk-section blockit-settings">
            <div className="uk-container">
                <div className="uk-grid uk-flex uk-flex-middle in-offset-bottom-40">
                    <div className="uk-width-1-2">
                        <h4 className="head-title">Settings</h4>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-right blockit-notif">
                        <ButtonLoader
                            id="save-settings"
                            class="uk-button uk-button-primary uk-border-rounded"
                            default="Save settings"
                            success="Saved successfully"
                            callback={handleSaveSettings}
                        />
                    </div>
                </div>
                <div className="uk-grid">
                    <div className="uk-width-1-1">
                        <div className="setting-wrap" data-uk-grid>
                            <div className="uk-width-1-5">
                                <ul className="uk-tab-left" data-uk-tab="connect: #component-tab-left; animation: uk-animation-fade">
                                    <li><a href="#site-info">Site info</a></li>
                                    <li><a href="#colors">Colors</a></li>
                                    <li><a href="#authors">Authors</a></li>
                                    <li><a href="#blog">Blog</a></li>
                                    <li><a href="#blog">Optimization</a></li>
                                </ul>
                            </div>
                            <div className="uk-width-expand@m">
                                <div className="uk-card uk-card-default uk-card-body uk-border-rounded">
                                    <ul id="component-tab-left" className="uk-switcher">
                                        <SettingsSiteinfo data={data.siteInfo} authorsSelect ={data.authors} />
                                        <SettingsColors data={data.colors} />
                                        <SettingsAuthors data={data.authors} callback={handleAuthorCallback} />
                                        <SettingsBlog data={data.blog} callback={handleBlogCallback} />
                                        <SettingsOptimization data={data.optimization} />
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