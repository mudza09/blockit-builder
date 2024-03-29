import {useState} from 'react';
import PropTypes from 'prop-types';

NavigationForm.propTypes = {
	applyCallback: PropTypes.func,
	cancelCallback: PropTypes.func,
	data: PropTypes.arr,
	formRef: PropTypes.object,
	internalData: PropTypes.array,
	parentChild: PropTypes.string,
	dirtyCallback: PropTypes.bool,
};

export default function NavigationForm(props) {
	const [newMenu, setNewMenu] = useState({title: '', slug: '', link: ''});
	const [failName, setFailName] = useState(false);
	const [failInternal, setFailInternal] = useState(false);
	const {applyCallback, cancelCallback, data, formRef, internalData, parentChild, dirtyCallback} = props;
	const formWrap = formRef;

	//  Handle apply navigation button
	const handleApplyForm = e => {
		e.preventDefault();
		const form = formWrap.current;
		const formMode = form.querySelector('h4').textContent;

		// Edit menu condition
		if (formMode.includes('Edit') && form.querySelector('#input-name').value.length !== 0) {
			const oldName = formMode.match(/"(.*?)"/g)[0].slice(1, -1);
			const editData = data.find(each => each.title === oldName);

			if (editData === undefined) {
				const editChildData = data.filter(each => each.dropdown).map(each => Object.values(each.dropdown)[0]).reduce((a, b) => a.concat(b), []).find(each => each.title === oldName);

				editChildData.title = form.querySelector('#input-name').value;
				editChildData.slug = editChildData.title.toLocaleLowerCase().replace(/\s/g, '-');
				editChildData.link = form.querySelector('#radio-internal').checked ? form.querySelector('#select-internal').value : form.querySelector('#input-custom').value;
				if (form.querySelector('#input-icon').value.length > 0) {
					editChildData.icon = form.querySelector('#input-icon').value;
				}

				applyCallback(data, oldName, 'edit');
				handleCancelMenu(e);
			} else {
				editData.title = form.querySelector('#input-name').value;
				editData.slug = editData.title.toLocaleLowerCase().replace(/\s/g, '-');
				editData.link = form.querySelector('#radio-internal').checked ? form.querySelector('#select-internal').value : form.querySelector('#input-custom').value;
				if (form.querySelector('#textarea-child').value.length > 0) {
					editData.dropdown.childText = form.querySelector('#textarea-child').value;
				} else if (editData.dropdown !== undefined && form.querySelector('#textarea-child').value.length === 0) {
					delete editData.dropdown.childText;
				}

				applyCallback(data, oldName, 'edit');
				handleCancelMenu(e);
			}
		}

		// Add new menu condition
		if (formMode.includes('new menu') && handleValidateForm(newMenu)) {
			applyCallback([...data, newMenu], newMenu.title, 'add');
			handleCancelMenu(e);
		}

		// Add child menu condition
		if (formMode.includes('child menu') && handleValidateForm(newMenu)) {
			const parentActive = data.find(item => item.title === parentChild);

			if (parentActive.dropdown !== undefined) {
				const addChildData = parentActive.dropdown.child;
				addChildData.push({
					title: form.querySelector('#input-name').value,
					slug: form.querySelector('#input-name').value.toLocaleLowerCase().replace(/\s/g, '-'),
					link: form.querySelector('#radio-internal').checked ? form.querySelector('#select-internal').value : form.querySelector('#input-custom').value,
					parent: parentChild,
					...(form.querySelector('#input-icon').value.length > 0 && {icon: form.querySelector('#input-icon').value}),
				});
			} else if (parentActive.dropdown === undefined) {
				parentActive.dropdown = {
					child: [
						{
							title: form.querySelector('#input-name').value,
							slug: form.querySelector('#input-name').value.toLocaleLowerCase().replace(/\s/g, '-'),
							link: form.querySelector('#radio-internal').checked ? form.querySelector('#select-internal').value : form.querySelector('#input-custom').value,
							parent: parentChild,
							...(form.querySelector('#input-icon').value.length > 0 && {icon: form.querySelector('#input-icon').value}),
						},
					],
				};
			}

			applyCallback(data, newMenu.title, 'add');
			handleCancelMenu(e);
		}
	};

	// Handle cancel navigation button
	const handleCancelMenu = e => {
		e.preventDefault();
		const form = formWrap.current;

		dirtyCallback(false);
		cancelCallback();
		setNewMenu({title: '', slug: '', link: ''});

		if (form.querySelector('#select-internal').classList.contains('uk-form-danger')) {
			setFailInternal(false);
		}

		if (form.querySelector('#input-custom').classList.contains('uk-form-danger')) {
			setFailInternal(false);
		}
	};

	// Handle input label name
	const handleInputName = e => {
		setNewMenu({
			...newMenu,
			title: e.target.value,
			slug: e.target.value.toLocaleLowerCase().replace(/\s/g, '-'),
		});
		dirtyCallback(true);
	};

	// Handle internal link radio
	const handleInternalLink = e => {
		setNewMenu({...newMenu, link: e.target.value});
		dirtyCallback(true);
	};

	// Handle custom link radio
	const handleCustomLink = e => {
		setNewMenu({...newMenu, link: e.target.value});
		dirtyCallback(true);
	};

	// Validate input form
	const handleValidateForm = values => {
		let status = true;
		if (values.title.length === 0) {
			setFailName(true);
			status = false;
		}

		if (values.link === 0) {
			setFailInternal(true);
			status = false;
		}

		return status;
	};

	return (
		<div id='nav-wrap' className='uk-margin-bottom' ref={formRef}>
			<div id='nav-form'>
				<h4>Add new menu item</h4>
				<form id='navigation-form' className='uk-grid-small' onSubmit={handleApplyForm}>
					<div className='uk-width-1-1'>
						<label className='uk-form-label uk-width-expand uk-inline' htmlFor='input-name'>Label name {failName ? <span className='uk-text-small uk-text-danger uk-position-right'>required!</span> : null}</label>
						<input
							className={failName ? 'uk-input uk-border-rounded uk-form-danger' : 'uk-input uk-border-rounded'}
							id='input-name'
							type='text'
							onFocus={() => setFailName(false)}
							onChange={handleInputName}
						/>
					</div>
					<div className='uk-width-1-1 uk-margin-top toggle-icon' hidden>
						<label className='uk-form-label' htmlFor='input-icon'>Icon name <i className='ri-information-fill ri-xs' data-uk-tooltip='title: use fontawesome icon name here; pos: right'></i></label>
						<input className='uk-input uk-border-rounded' id='input-icon' type='text' />
					</div>
					<div className='uk-width-1-1 uk-margin'>
						<label className='uk-margin-right'><input className='uk-radio' id='radio-internal' type='radio' name='link-radio' /> Internal link</label>
						<label><input className='uk-radio' id='radio-custom' type='radio' name='link-radio' /> Custom link</label>
					</div>
					<div className='uk-width-1-1 uk-margin-bottom toggle-link'>
						<div className='toggle-internal'>
							<select
								className={ failInternal ? 'uk-select uk-border-rounded uk-form-danger' : 'uk-select uk-border-rounded' }
								id='select-internal'
								onFocus={() => setFailInternal(false)}
								onChange={handleInternalLink}
							>
								<option value='0'>Please select...</option>
								{internalData.map(item => <option key={item.split('.')[0] + '-option'} value={item.split('.')[0] + '.html'}>{item.split('.')[0] + '.html'}</option>)}
							</select>
						</div>
						<div className='toggle-custom' hidden>
							<input
								className={failInternal ? 'uk-input uk-border-rounded uk-form-danger' : 'uk-input uk-border-rounded' }
								id='input-custom'
								type='text'
								defaultValue='https://'
								onFocus={() => setFailInternal(false)}
								onChange={handleCustomLink}
							/>
						</div>
					</div>
					<div className='uk-width-1-1 uk-margin toggle-text' hidden>
						<label className='uk-form-label' htmlFor='textarea-child'>Create text at child menu <i className='fas fa-info-circle fa-xs' data-uk-tooltip="title: Leave blank if you don't want use; pos: right"></i></label>
						<textarea className='uk-textarea uk-border-rounded' id='textarea-child' rows='4'></textarea>
					</div>
					<div className='uk-width-1-1'>
						<div className='uk-grid-small uk-child-width-1-2' data-uk-grid>
							<div>
								<button id='cancel-nav' className='uk-button uk-button-secondary uk-border-rounded uk-width-1-1' onClick={handleCancelMenu}>Cancel</button>
							</div>
							<div>
								<button id='apply-nav' className='uk-button uk-button-primary uk-border-rounded uk-width-1-1' type='submit'>Apply changes</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
