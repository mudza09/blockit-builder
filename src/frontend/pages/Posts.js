import React, { useState, useEffect } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import bs from '../utils/bs'
import { slicePage, calcPage, entryPage } from '../utils/tablePagination'
import UIkit from 'uikit'
import trimUtils from '../utils/trimUtils'
import postLink from '../utils/postLink'
import hbsTemplate from '../utils/hbsTemplate'
import Notification from '../components/Notification'

export default function Posts() {
    let navigate = useNavigate()
    const [data, setData] = useState([])
    const [dataLength, setDataLength] = useState('')
    const [pagination, setPagination] = useState([])
    const [paginationEntry, setPaginationEntry] = useState('')
    const [activePage, setActivePage] = useState(1)
    const [notif, setNotif] = useState({
        status: false,
        filename: ''
    })
    const [postTag, setPostTag] = useState({})

    // table sort state
    const [sortCat, setSortCat] = useState(true)

    // get data from socket
    const socketPosts = () => {
        bs.socket.emit('getPostsData', 'empty')
        bs.socket.once('postsData', data => {
            const sortDate = data.sort((a,b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`))
            setData(slicePage(sortDate, 1, 10))
            setDataLength(data.length)
            setPagination(calcPage(data, 10))
            setPaginationEntry(entryPage(data.length)[0])
        })
    }

    // handle add post
    const handleAddPost = () => {
        navigate('/posts/add')
    }

    // handle edit post
    const handleEditPost = (data) => {
        navigate({
            pathname: '/posts/edit',
            search: `?${createSearchParams({
                title: data.title,
                date: data.date,
                time: data.time
            })}`
        })
    }

    // handle delete post
    const handleDeletePost = (e) => {
        const titleName = e.target.closest('tr').querySelector('.page-name').innerText
        const fileName = postLink(titleName)

        UIkit.modal.confirm(`"${titleName}" will be deleted, are you ok with that?`).then(async () => {
            bs.socket.emit('deletePostData', fileName, postTag)
            await new Promise(resolve => bs.socket.once('deleteDone', message => {
                resolve(
                    setData(data.filter(item => item.link != `${fileName}.html`)),
                    setNotif({
                        status: true,
                        filename: titleName
                    }),
                    bs.socket.emit('getPostsData', 'empty'),
                    bs.socket.once('postsData', data => {
                        setDataLength(data.length)
                        setPaginationEntry(entryPage(data.length)[activePage -1])
                    })
                )
            }))
        }, () => null)
    }

    // set notif to false from notification component
    const handleNotifCallback = (data) => {
        setNotif({
            status: data,
            filename: ''
        })
    }

    // handle pagination button
    const handlePagination = (num) => {
        if(!sortCat) {
            bs.socket.emit('getPostsData', 'empty')
            bs.socket.once('postsData', data => {
                const sortCategory = data.sort((a, b) => a.category.localeCompare(b.category))
                setData(slicePage(sortCategory, num, 10))
                setActivePage(num)
                setPaginationEntry(entryPage(data.length)[num -1])
            })
        } else {
            bs.socket.emit('getPostsData', 'empty')
            bs.socket.once('postsData', data => {
                const sortDate = data.sort((a,b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`))
                setData(slicePage(sortDate, num, 10))
                setActivePage(num)
                setPaginationEntry(entryPage(data.length)[num -1])
            })
        }
    }

    // handle sort posts category
    const handleSortCategory = () => {
        setSortCat(!sortCat)
        if(sortCat) {
            bs.socket.emit('getPostsData', 'empty')
            bs.socket.once('postsData', data => {
                const sortCategory = data.sort((a, b) => a.category.localeCompare(b.category))
                setData(slicePage(sortCategory, 1, 10))
                setDataLength(data.length)
                setPagination(calcPage(data, 10))
                setPaginationEntry(entryPage(data.length)[0])
                setActivePage(1)
            })
        } else {
            bs.socket.emit('getPostsData', 'empty')
            bs.socket.once('postsData', data => {
                const sortDate = data.sort((a,b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`))
                setData(slicePage(sortDate, 1, 10))
                setDataLength(data.length)
                setPagination(calcPage(data, 10))
                setPaginationEntry(entryPage(data.length)[0])
                setActivePage(1)
            })
        }
    }

    useEffect(() => socketPosts(), [])
    useEffect(() => setPostTag(hbsTemplate), [])

    return (
        <div className="uk-section blockit-pages">
            <div className="uk-container">
                <div className="uk-grid uk-flex uk-flex-middle in-offset-bottom-40">
                    <div className="uk-width-1-3">
                        <h4 className="head-title">Posts</h4>
                    </div>
                    <div className="uk-width-expand uk-flex uk-flex-right blockit-notif">
                        <Notification status={notif} callback={handleNotifCallback} message="has been successfully deleted" />
                        <button id="add-page" className="uk-button uk-button-primary uk-border-rounded" onClick={handleAddPost}><i className="fas fa-plus-circle fa-sm uk-margin-small-right"></i>Add new post</button>
                    </div>
                </div>
                
                <div className="uk-grid">
                    <div className="uk-width-1-1 uk-margin-top">
                        <table className="uk-table uk-table-divider uk-table-hover uk-table-middle uk-margin-small-bottom">
                            <thead>
                                <tr>
                                    <th className="in-title-width">Post title</th>
                                    <th className="in-modified-width">Modified</th>
                                    <th className="uk-width-small">Author</th>
                                    <th className="uk-width-small"><span onClick={handleSortCategory}>Category<i className={sortCat ? 'fas fa-caret-up uk-margin-small-left in-sort-icon' : 'fas fa-caret-up uk-margin-small-left'}></i></span></th>
                                    <th className="uk-width-auto"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {                                    
                                    data.map((item, index) => {
                                        const params = {
                                            title: item.title,
                                            date: item.dateCreated,
                                            time: item.timeCreated
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="page-wrapper uk-inline">
                                                        <div className="page-icon uk-float-left">
                                                            <i className="fas fa-align-left"></i>
                                                        </div>
                                                        <div className="uk-margin-small-left uk-float-left">
                                                            <span className="page-name">{trimUtils(item.title)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="in-sort-icon">{item.dateModified} at {item.timeModified}</span></td>
                                                <td>{item.author.name}</td>
                                                <td><span className="uk-label uk-label-warning uk-text-small uk-border-rounded">{item.category}</span></td>
                                                <td>
                                                    <div className="action-wrap uk-flex uk-flex-right">
                                                        <button className="btn-edit uk-button uk-button-text uk-button-small" onClick={handleEditPost.bind(this, params)}><i className="fas fa-wrench"></i>Edit</button>
                                                        <button className="btn-delete uk-button uk-button-text uk-button-small" onClick={handleDeletePost}><i className="fas fa-trash-alt"></i>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="uk-flex uk-flex-middle uk-flex-right">
                            <span className="uk-text-small uk-text-muted uk-margin-right">Showing {paginationEntry} of {dataLength} entries</span>
                            <ul className="uk-pagination uk-margin-remove-vertical" data-uk-margin>
                                {
                                    pagination.map((item, index) => {
                                        return (
                                            <li key={index} {...(item == activePage && { className: "uk-active" })}><a onClick={handlePagination.bind(this, item)}>{item}</a></li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}