import React, { useState, useEffect, useRef } from 'react'
import bs from '../utils/bs'
import UIkit from 'uikit'
import NavigationCanvas from '../components/NavigationCanvas'
import NavigationForm from '../components/NavigationForm'
import NavigationInstructions from '../components/NavigationInstructions'
import Notification from '../components/Notification'
import ButtonLoader from '../components/ButtonLoader'

export default function Navigation() {
    const [data, setData] = useState([])
    const [selectData, setSelectData] = useState([])
    const [activeParent, setActiveParent] = useState('')
    const [notif, setNotif] = useState({
        status: false,
        filename: ''
    })
    const formWrap = useRef(null)

    // get data from socket
    const socketNavigation = async () => {
        bs.socket.emit('getNavigationData', 'empty')
        bs.socket.once('navigationData', data => {
            setData(data.nav)
            setSelectData(data.select)
        })
    }

    // handle add navigation button
    const handleAddMenu = () => {
        const form = formWrap.current
        form.querySelector('h4').innerText = 'Add new menu item'

        defaultForm(form)
        optionForm(form)
    }

    // handle edit navigation button
    const handleEditCanvas = (e, item, data) => {
        const form = formWrap.current
        const internalLink = data.map(item => `${item.split('.')[0]}.html`)
        internalLink.push('blog/page-1.html')

        defaultForm(form)
        optionForm(form)

        form.querySelector('h4').innerText = `Edit "${item.title}" menu item`
        form.querySelector('#input-name').blur()
        form.querySelector('#input-name').value = item.title

        if(internalLink.includes(item.link)) {
            form.querySelector('.toggle-internal').removeAttribute('hidden')
            form.querySelector('.toggle-custom').setAttribute('hidden', '')
            form.querySelector('#select-internal').value = item.link
        } 
        
        if(!internalLink.includes(item.link)) {
            form.querySelector('.toggle-internal').setAttribute('hidden', '')
            form.querySelector('.toggle-custom').removeAttribute('hidden')
            form.querySelector('#radio-custom').checked = true
            form.querySelector('#input-custom').value = item.link
            form.querySelector('#select-internal').value = '0'
        }

        if(item.dropdown !== undefined) {
            form.querySelector('.toggle-text').removeAttribute('hidden')
            item.dropdown.child_text !== undefined 
                ? form.querySelector('#textarea-child').value = item.dropdown.child_text
                : form.querySelector('#textarea-child').value = ''
        } else {
            form.querySelector('.toggle-text').setAttribute('hidden', '')
        }

        if(e.target.parentElement.classList.contains('child-nav')) {
            form.querySelector('.toggle-icon').removeAttribute('hidden')
            item.icon !== undefined
                ? form.querySelector('#input-icon').value = item.icon
                : form.querySelector('#input-icon').value = ''
        } else {
            form.querySelector('.toggle-icon').setAttribute('hidden', '')
        }
    }

    // handle add child navigation button
    const handleChildCanvas = (item) => {
        const form = formWrap.current

        defaultForm(form)
        optionForm(form)

        form.querySelector('h4').innerText = `Add child menu in "${item.title}" menu`
        form.querySelector('.toggle-icon').removeAttribute('hidden')

        setActiveParent(item.title)
    }

    // handle delete navigation button
    const handleDeleteCanvas = (e, item, data) => {
        const finalData = data.filter(each => each != item)

        // delete condition for child nav
        if(e.target.closest('.as-child') !== null) {
            const checkDropdown = e.target.closest('.as-child').previousElementSibling.previousElementSibling
            const title = checkDropdown !== null ? e.target.closest('.as-child').previousElementSibling.previousElementSibling.firstChild.textContent : e.target.closest('.as-child').previousElementSibling.firstChild.textContent
            const parentNav = data.find(each => each.title === title).dropdown.child
            const filteredNav = parentNav.filter(each => each != item)

            delete data.find(each => each.title === title).dropdown.child
            data.find(each => each.title === title).dropdown.child = filteredNav
        }

        UIkit.modal.confirm(`Are you sure delete the "${item.title}" menu?`).then(() => {
            setData(finalData)
        }, () => null)
    }

    // default form
    const defaultForm = (el) => {
        el.querySelector('.nav-placeholder').setAttribute('hidden', '')
        el.querySelector('#nav-form').removeAttribute('hidden')
        el.querySelector('#input-name').value = ''
        el.querySelector('#input-name').focus()
        el.querySelector('#radio-internal').checked = true
        el.querySelector('#select-internal').value = '0'
        el.querySelector('.toggle-internal').removeAttribute('hidden')
        el.querySelector('.toggle-custom').setAttribute('hidden', '')
        el.querySelector('.toggle-icon').setAttribute('hidden', '')
        el.querySelector('.toggle-text').setAttribute('hidden', '')
    }

    // option form
    const optionForm = (el) => {
        el.querySelector('#radio-internal').addEventListener('click', () => {
            el.querySelector('#radio-internal').checked = true
            el.querySelector('.toggle-internal').removeAttribute('hidden')
            el.querySelector('.toggle-custom').setAttribute('hidden', '')
        })

        el.querySelector('#radio-custom').addEventListener('click', () => {
            el.querySelector('#radio-custom').checked = true
            el.querySelector('.toggle-internal').setAttribute('hidden', '')
            el.querySelector('.toggle-custom').removeAttribute('hidden')
        })
    }

    // handle apply button callback
    const handleApplyCallback = (result, fileName, mode) => {
        setData(result)
        setNotif({
            status: true,
            filename: fileName,
            mode: mode
        })
    }

    // handle save navigation button
    const handleSaveNavigation = () => {
        const result = { nav: data }
        bs.socket.emit('saveNavigation', result)
    }

    // set notif to false from notification component
    const handleNotifCallback = (result) => {
        setNotif({
            status: result,
            filename: ''
        })
    }

    useEffect(() => socketNavigation(), [])

    return (
        <div className="uk-section blockit-nav">
            <div className="uk-container">
                <div className="uk-grid uk-flex uk-flex-middle in-offset-bottom-40">
                    <div className="uk-width-1-2">
                        <h4 className="head-title">Navigation</h4>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-right blockit-notif">
                        <Notification status={notif} callback={handleNotifCallback} message={notif.mode == 'add' ? 'menu succesfully added' : 'menu succesfully edit'} />
                        <button id="add-nav" className="uk-button uk-button-primary uk-border-rounded" onClick={handleAddMenu}>
                            <i className="fas fa-plus-circle fa-sm uk-margin-small-right"></i>Add menu item
                        </button>
                    </div>
                </div>
                <div className="uk-grid">
                    <div className="uk-width-1-2">
                        <NavigationCanvas data={data} internalData={selectData} editNav={handleEditCanvas} deleteNav={handleDeleteCanvas} addChildNav={handleChildCanvas} />
                    </div>
                    <div className="uk-width-1-2">
                        <NavigationForm data={data} internalData={selectData} formRef={formWrap} callback={handleApplyCallback} parentChild={activeParent} />
                        <NavigationInstructions />
                        <ButtonLoader
                            id="save-nav"
                            class="uk-button uk-button-primary uk-border-rounded uk-width-1-1"
                            default="Save navigation"
                            success="Saved successfully"
                            callback={handleSaveNavigation}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}