import React, { useState, useEffect } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import bs from '../utils/bs'
import { slicePage, calcPage, entryPage } from '../utils/tablePagination'
import UIkit from 'uikit'
import Notification from '../components/Notification'

export default function Pages() {
    let navigate = useNavigate()
    const [data, setData] = useState([])
    const [dataLength, setDataLength] = useState('')
    const [pagination, setPagination] = useState([])
    const [paginationEntry, setPaginationEntry] = useState('')
    const [activePage, setActivePage] = useState(1)
    const [currentBlog, setCurrentBlog] = useState([])
    const [notif, setNotif] = useState({
        status: false,
        filename: ''
    })

    // get data from socket
    const socketPages = () => {
        bs.socket.emit('getPagesData', 'empty')
        bs.socket.once('pagesCurrentBlog', data => setCurrentBlog(data))
        bs.socket.once('pagesData', data => {
            setData(slicePage(data, 1, 10))
            setDataLength(data.length)
            setPagination(calcPage(data, 10))
            setPaginationEntry(entryPage(data.length)[0])
        })
    }

    // handle add page
    const handleAddPage = () => {
        navigate({
            pathname: '/pages/add',
            search: `?${createSearchParams({
                asBlog: currentBlog
            })}`
        })
    }

    // handle edit page
    const handleEditPage = (data) => {
        if(!data.sections[0].includes('section-blog')) {
            navigate({
                pathname: '/pages/edit',
                search: `?${createSearchParams({
                    page: data.page,
                    title: data.title,
                    layout: data.layout,
                    breadcrumb: data.breadcrumb,
                    asBlog: currentBlog,
                    sections: [data.sections]
                })}`
            })
        } else {
            navigate({
                pathname: '/pages/edit',
                search: `?${createSearchParams({
                    page: data.page,
                    title: data.title,
                    layout: data.layout,
                    breadcrumb: data.breadcrumb,
                    asBlog: currentBlog,
                    sections: [data.sections[0]]
                })}`
            })
        }
    }

    // handle delete page
    const handleDeletePage = (params, e) => {
        const fileName = e.target.closest('tr').querySelector('.page-name').innerText

        UIkit.modal.confirm(`"${fileName}" page will be deleted, are you ok with that?`).then(() => {
            bs.socket.emit('deletePageData', fileName, params.sections)
            bs.socket.emit('getPagesData', 'empty')

            setData(data.filter(item => item.page != fileName))
            setNotif({
                status: true,
                filename: fileName
            })

            bs.socket.once('pagesCurrentBlog', data => setCurrentBlog(data))
            bs.socket.once('pagesData', data => {
                setDataLength(data.length)
                setPaginationEntry(entryPage(data.length)[activePage -1])
            })
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
        bs.socket.emit('getPagesData', 'empty')
        bs.socket.once('pagesData', data => {
            setData(slicePage(data, num, 10))
            setActivePage(num)
            setPaginationEntry(entryPage(data.length)[num -1])
        })
    }

    useEffect(() => socketPages(), [])

    return (
        <div className="uk-section blockit-pages">
            <div className="uk-container">
                <div className="uk-grid uk-flex uk-flex-middle in-offset-bottom-40">
                    <div className="uk-width-1-2">
                        <h4 className="head-title">Pages</h4>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-right blockit-notif">
                        <Notification status={notif} callback={handleNotifCallback} message="has been successfully deleted" />
                        <button id="add-page" className="uk-button uk-button-primary uk-border-rounded" onClick={handleAddPage}><i className="fas fa-plus-circle fa-sm uk-margin-small-right"></i>Add new page</button>
                    </div>
                </div>
                
                <div className="uk-grid">
                    <div className="uk-width-1-1 uk-margin-top">
                        <table className="uk-table uk-table-divider uk-table-hover uk-table-middle uk-margin-small-bottom">
                            <thead>
                                <tr>
                                    <th className="uk-width-large">Page name</th>
                                    <th className="uk-width-medium">Modified</th>
                                    <th className="uk-width-small">Layout type</th>
                                    <th className="uk-width-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item, index) => {
                                        const date = new Date(item.date)
                                        const dateObj = {
                                            year: new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date),
                                            month: new Intl.DateTimeFormat('en', { month: 'long' }).format(date),
                                            day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date),
                                            time: new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h12' }).format(date)
                                        }
                                        const params = {
                                            page: item.page,
                                            title: item.title,
                                            layout: item.layout,
                                            breadcrumb: item.breadcrumb,
                                            sections: item.sections
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="page-wrapper uk-inline">
                                                        <div className="page-icon uk-float-left">
                                                            <i className="fas fa-swatchbook"></i>
                                                        </div>
                                                        <div className="uk-margin-small-left uk-float-left">
                                                            <span className="page-name">{item.page}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="uk-text-muted">{dateObj.month} {dateObj.day}, {dateObj.year} at {dateObj.time}</span></td>
                                                <td><span className="uk-label uk-label-warning uk-text-small uk-border-rounded">{item.layout}</span></td>
                                                <td>
                                                    <div className="action-wrap uk-flex uk-flex-right">
                                                        <button className="btn-edit uk-button uk-button-text uk-button-small" onClick={handleEditPage.bind(this, params)}><i className="fas fa-wrench"></i>Edit</button>
                                                        <button className="btn-delete uk-button uk-button-text uk-button-small" onClick={handleDeletePage.bind(this, params)}><i className="fas fa-trash-alt"></i>Delete</button>
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
                                            <li {...(item == activePage && { className: "uk-active" })} key={index}><a onClick={handlePagination.bind(this, item)}>{item}</a></li>
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