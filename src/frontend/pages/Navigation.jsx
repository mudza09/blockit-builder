import {useState, useEffect, useRef} from 'react';
import {useNavigatingAway} from '../hooks/useNavigatingAway';
import bs from '../utils/bs';
import UIkit from 'uikit';
import NavigationCanvas from '../components/NavigationCanvas';
import NavigationForm from '../components/NavigationForm';
import NavigationInstructions from '../components/NavigationInstructions';
import Notification from '../components/Notification';
import ButtonLoader from '../components/ButtonLoader';

export default function Navigation() {
	const [data, setData] = useState([]);
	const [selectData, setSelectData] = useState([]);
	const [activeParent, setActiveParent] = useState('');
	const [canvasPlaceholder, setCanvasPlaceholder] = useState(false);
	const [notif, setNotif] = useState({status: false, filename: ''});
	const formWrap = useRef(null);

	// Leave page prompt
	const [isDirty, setIsDirty] = useState(false);
	const [showPrompt, confirmleave, cancelLeave] = useNavigatingAway(isDirty);

	// Get data from socket
	const socketNavigation = async () => {
		bs.socket.emit('getNavigationData', 'empty');
		bs.socket.once('navigationData', data => {
			setData(data.nav);
			setSelectData(data.select);
		});
	};

	// Handle default menu button
	const handleDefaultMenu = () => {
		const form = formWrap.current;
		form.querySelector('h4').innerText = 'Add new menu item';

		defaultForm(form);
		optionForm(form);
	};

	// Handle edit navigation button
	const handleEditCanvas = (e, item, data) => {
		const form = formWrap.current;
		const internalLink = data.map(item => `${item.split('.')[0]}.html`);
		internalLink.push('blog/page-1.html');

		defaultForm(form);
		optionForm(form);

		form.querySelector('h4').innerText = `Edit "${item.title}" menu item`;
		form.querySelector('#input-name').blur();
		form.querySelector('#input-name').value = item.title;

		if (internalLink.includes(item.link)) {
			form.querySelector('.toggle-internal').removeAttribute('hidden');
			form.querySelector('.toggle-custom').setAttribute('hidden', '');
			form.querySelector('#select-internal').value = item.link;
		}

		if (!internalLink.includes(item.link)) {
			form.querySelector('.toggle-internal').setAttribute('hidden', '');
			form.querySelector('.toggle-custom').removeAttribute('hidden');
			form.querySelector('#radio-custom').checked = true;
			form.querySelector('#input-custom').value = item.link;
			form.querySelector('#select-internal').value = '0';
		}

		if (item.dropdown === undefined) {
			form.querySelector('.toggle-text').setAttribute('hidden', '');
		} else {
			form.querySelector('.toggle-text').removeAttribute('hidden');
			if (item.dropdown.childText === undefined) {
				form.querySelector('#textarea-child').value = '';
			} else {
				form.querySelector('#textarea-child').value = item.dropdown.childText;
			}
		}

		if (e.target.parentElement.classList.contains('child-nav')) {
			form.querySelector('.toggle-icon').removeAttribute('hidden');
			if (item.icon === undefined) {
				form.querySelector('#input-icon').value = '';
			} else {
				form.querySelector('#input-icon').value = item.icon;
			}
		} else {
			form.querySelector('.toggle-icon').setAttribute('hidden', '');
		}
	};

	// Handle add child navigation button
	const handleChildCanvas = item => {
		const form = formWrap.current;

		defaultForm(form);
		optionForm(form);

		form.querySelector('h4').innerText = `Add child menu in "${item.title}" menu`;
		form.querySelector('.toggle-icon').removeAttribute('hidden');

		setActiveParent(item.title);
	};

	// Handle delete navigation button
	const handleDeleteCanvas = (e, item, data) => {
		const finalData = data.filter(each => each !== item);

		// Delete condition for child nav
		if (e.target.closest('.as-child') !== null) {
			const checkDropdown = e.target.closest('.as-child').previousElementSibling.previousElementSibling;
			const title = checkDropdown === null ? e.target.closest('.as-child').previousElementSibling.firstChild.textContent : e.target.closest('.as-child').previousElementSibling.previousElementSibling.firstChild.textContent;
			const parentNav = data.find(each => each.title === title).dropdown.child;
			const filteredNav = parentNav.filter(each => each !== item);

			delete data.find(each => each.title === title).dropdown.child;
			data.find(each => each.title === title).dropdown.child = filteredNav;
		}

		UIkit.modal.confirm(`Are you sure delete the "${item.title}" menu?`).then(() => {
			setData(finalData);
			setIsDirty(true);
			if (finalData.length === 0) {
				setCanvasPlaceholder(true);
			}
		}, () => null);
	};

	// Default form
	const defaultForm = el => {
		el.querySelector('#nav-form').removeAttribute('hidden');
		el.querySelector('#input-name').value = '';
		el.querySelector('#radio-internal').checked = true;
		el.querySelector('#select-internal').value = '0';
		el.querySelector('.toggle-internal').removeAttribute('hidden');
		el.querySelector('.toggle-custom').setAttribute('hidden', '');
		el.querySelector('.toggle-icon').setAttribute('hidden', '');
		el.querySelector('.toggle-text').setAttribute('hidden', '');
	};

	// Option form
	const optionForm = el => {
		el.querySelector('#radio-internal').addEventListener('click', () => {
			el.querySelector('#radio-internal').checked = true;
			el.querySelector('.toggle-internal').removeAttribute('hidden');
			el.querySelector('.toggle-custom').setAttribute('hidden', '');
		});

		el.querySelector('#radio-custom').addEventListener('click', () => {
			el.querySelector('#radio-custom').checked = true;
			el.querySelector('.toggle-internal').setAttribute('hidden', '');
			el.querySelector('.toggle-custom').removeAttribute('hidden');
		});
	};

	// Handle apply button callback
	const handleApplyCallback = (result, fileName, mode) => {
		setData(result);
		setCanvasPlaceholder(false);
		setNotif({
			status: true,
			filename: fileName,
			mode,
		});
	};

	// Handle save navigation button
	const handleSaveNavigation = () => {
		setIsDirty(false);

		// Clean empty dropdown child
		data.forEach(item => {
			if (item.dropdown !== undefined && item.dropdown.child.length === 0) {
				delete item.dropdown;
			}
		});

		bs.socket.emit('saveNavigation', data);
	};

	// Set notif to false from notification component
	const handleNotifCallback = result => {
		setNotif({
			status: result,
			filename: '',
		});
	};

	useEffect(() => {
		socketNavigation();
		handleDefaultMenu();
	}, []);
	useEffect(() => {
		if (showPrompt) {
			UIkit.modal.confirm('All changes will be lost. Do you really want to leave without saving?').then(() => {
				setIsDirty(false);
				confirmleave();
			}, () => cancelLeave());
		}
	}, [showPrompt]);

	return (
		<div className='tm-main uk-section blockit-nav'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h3 className='head-title'>Navigation</h3>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'>
						<Notification status={notif} callback={handleNotifCallback} message={notif.mode === 'add' ? 'menu succesfully added' : 'menu succesfully edit'} />
						<ButtonLoader
							idName='save-nav'
							cssClass='uk-button uk-button-primary uk-border-rounded'
							defaultMessage='Save navigation'
							successMessage='Saved successfully'
							callbackAction={handleSaveNavigation}
						/>
					</div>
				</div>

				<div className='uk-grid'>
					<div className='uk-width-1-2'>
						<NavigationCanvas
							data={data}
							internalData={selectData}
							editNav={handleEditCanvas}
							deleteNav={handleDeleteCanvas}
							addChildNav={handleChildCanvas}
							placeholderStatus={canvasPlaceholder}
							dirtyCallback={setIsDirty}
						/>
					</div>
					<div className='uk-width-1-2'>
						<NavigationForm
							data={data}
							internalData={selectData}
							formRef={formWrap}
							applyCallback={handleApplyCallback}
							cancelCallback={handleDefaultMenu}
							parentChild={activeParent}
							dirtyCallback={setIsDirty}
						/>
						<NavigationInstructions />
					</div>
				</div>
			</div>
		</div>
	);
}
