import {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate, createSearchParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useNavigatingAway} from '../hooks/useNavigatingAway';
import ShortUniqueId from 'short-unique-id';
import bs from '../utils/bs';
import UIkit from 'uikit';
import EditorJS from '../assets/js/editorjs/editorjs-disable-key-events';
import CodeMirror from '../assets/js/editorjs/codemirror/bundle';
import PagesCanvas from '../components/PagesCanvas';
import PagesLibrary from '../components/PagesLibrary';
import PagesLibraryButton from '../components/PagesLibraryButton';
import pageFormat from '../utils/pageFormat';

export default function PagesAction() {
	const navigate = useNavigate();
	const {mode} = useParams();
	const params = new URLSearchParams(location.search);
	const [isLoading, setIsLoading] = useState(false);
	const [btnSuccess, setBtnSuccess] = useState(false);
	const [libraryData, setLibraryData] = useState([]);
	const [sectionData, setSectionData] = useState('');
	const [blogStatus, setBlogStatus] = useState(false);
	const canvasWrap = useRef(null);
	const placeholdWrap = useRef(null);
	const breadcrumbCheck = useRef(null);
	const blogCheck = useRef(null);
	const canvasLibraryBtn = useRef(null);

	// Leave page prompt
	const [isDirty, setIsDirty] = useState(false);
	const [showPrompt, confirmleave, cancelLeave] = useNavigatingAway(isDirty);

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	// Page form variables
	const [pageForm, setPageForm] = useState({name: '', title: '', layout: 'default', breadcrumb: true});
	const [failName, setFailName] = useState(false);
	const [failTitle, setFailTitle] = useState(false);

	// Get data from socket
	const socketPagesAction = () => {
		bs.socket.emit('getPagesActionData', 'empty');
		bs.socket.once('pagesActionData', data => filterSections(data));
	};

	// Handle input form
	const handleInputForm = e => {
		setPageForm({...pageForm, [e.target.name]: transfromPageName(e)});
		setIsDirty(true);
	};

	// Breadcrumb checkbox
	const breadcrumbForm = value => {
		const breadcrumb = breadcrumbCheck.current;
		if (value === 'true' || value === null) {
			breadcrumb.checked = true;
		}
	};

	// Blog status
	const handleBlogStatus = () => {
		blogCheck.current.addEventListener('change', () => {
			if (blogCheck.current.checked) {
				setBlogStatus(true);

				Array.from(canvasWrap.current.children).forEach(el => el.remove());
				placeholdWrap.current.removeAttribute('hidden');
			} else if (mode === 'edit') {
				navigate({
					search: `?${createSearchParams({
						page: params.get('page'),
						title: params.get('title'),
						layout: params.get('layout'),
						breadcrumb: params.get('breadcrumb'),
						asBlog: false,
						sections: '',
					})}`,
				});
				setBlogStatus(false);
			} else {
				setBlogStatus(false);
			}
		});

		if (params.get('page') !== null && params.get('page') === params.get('asBlog')) {
			setBlogStatus(true);

			Array.from(canvasWrap.current.children).forEach(el => el.remove());
			placeholdWrap.current.removeAttribute('hidden');
			blogCheck.current.checked = true;
		}

		if (params.get('page') !== params.get('asBlog') && params.get('asBlog') !== 'false') {
			blogCheck.current.setAttribute('disabled', '');
		}
	};

	// Handle save form
	const handleSaveForm = e => {
		e.preventDefault();

		if (handleValidateForm(pageForm)) {
			let sections;

			if (mode === 'add') {
				sections = Array.from(canvasWrap.current.children).map(item => (
					{
						id: uid(),
						reference: item.classList[1],
						updateData: JSON.parse(sessionStorage.getItem(`${item.classList[1]}`)) === null ? false : JSON.parse(sessionStorage.getItem(`${item.classList[1]}`)).blocks[0].data.text,
					}
				));
			} else if (mode === 'edit') {
				const paramSection = params.get('sections').split(',');
				const canvasSection = Array.from(canvasWrap.current.children).map(item => item.classList[1]);

				if (paramSection.toString() !== canvasSection.toString()) {
					sections = Array.from(canvasWrap.current.children).map(item => (
						{
							id: item.classList[1].split('-').pop().length === 6 ? item.classList[1].split('-').pop() : uid(),
							reference: item.classList[1].split('-').pop().length === 6 ? item.classList[1].split('-').slice(0, -1).join('-') : item.classList[1],
							updateData: JSON.parse(sessionStorage.getItem(`${item}`)) === null ? false : JSON.parse(sessionStorage.getItem(`${item}`)).blocks[0].data.text,
						}
					));
				} else if (paramSection[0] === '') {
					// If revert from blog to regular page
					sections = Array.from(canvasWrap.current.children).map(item => (
						{
							id: uid(),
							reference: item.classList[1],
							updateData: JSON.parse(sessionStorage.getItem(`${item.classList[1]}`)) === null ? false : JSON.parse(sessionStorage.getItem(`${item.classList[1]}`)).blocks[0].data.text,
						}
					));
				} else {
					const processedSection = canvasSection[0].split('-').pop().length === 6 ? canvasSection.map(each => each) : canvasSection.map(each => paramSection.filter(word => word.includes(each))[0]);
					sections = processedSection.map(item => (
						{
							id: item.includes('section-slideshow') ? item : item.split('-').pop(),
							reference: item.includes('section-slideshow') ? item : item.substring(0, item.lastIndexOf('-')),
							updateData: JSON.parse(sessionStorage.getItem(`${item}`)) === null ? false : JSON.parse(sessionStorage.getItem(`${item}`)).blocks[0].data.text,
						}
					));
				}
			}

			const {name, title, layout, breadcrumb} = pageForm;
			const blog = blogCheck.current.checked;
			const deletedSections = params.get('sections') === null ? [false] : params.get('sections').split(',').filter(deleted => !sections.map(item => `${item.reference}-${item.id}`).includes(deleted));

			// Send data page to host and delete old name if name changed
			bs.socket.emit('savePageActionData', {
				nameFile: name,
				blogStatus: blog,
				currentBlog: params.get('asBlog'),
				data: pageFormat({
					pageLayout: layout,
					pageTitle: title,
					breadcrumb,
					blog,
					listSections: sections.map(each => each.reference.includes('section-slideshow') ? `${each.reference}` : `${each.reference}-${each.id}`),
				}),
			});
			if (mode === 'edit') {
				const oldName = params.get('page');
				if (oldName !== name) {
					bs.socket.emit('deletePageData', oldName);
				}
			}

			// Send data editor to host and clear session storage
			bs.socket.emit('saveSectionData', sections, deletedSections);
			sessionStorage.clear();

			navigate({
				pathname: '/pages/edit',
				search: `?${createSearchParams({
					page: name,
					title,
					layout,
					breadcrumb,
					asBlog: params.get('asBlog'),
					sections: [sections.map(each => each.reference.includes('section-slideshow') ? `${each.reference}` : `${each.reference}-${each.id}`)],
				})}`,
			});

			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
				setBtnSuccess(true);
			}, 1500);
			setTimeout(() => {
				setBtnSuccess(false);
			}, 3000);
		}
	};

	// Tranform lowercase and remove whitespace in page name form
	const transfromPageName = event => {
		if (event.target.name === 'name') {
			return event.target.value.toLocaleLowerCase().replace(/\s/g, '-');
		}

		if (event.target.name === 'breadcrumb') {
			return event.target.checked;
		}

		return event.target.value;
	};

	// Validate input form
	const handleValidateForm = values => {
		let status = true;
		if (!values.name) {
			setFailName(true);
			status = false;
		}

		if (!values.title) {
			setFailTitle(true);
			status = false;
		}

		if (canvasWrap.current.childElementCount === 0 && !blogStatus) {
			placeholdWrap.current.style.top = '37.3%';
			placeholdWrap.current.style.left = '38.6%';
			placeholdWrap.current.children[1].textContent = 'section cannot be empty!';
			placeholdWrap.current.classList.add('uk-animation-shake');
			setTimeout(() => {
				placeholdWrap.current.style.top = '50%';
				placeholdWrap.current.style.left = '50%';
				placeholdWrap.current.children[1].textContent = 'drag & drop the section library here.';
				placeholdWrap.current.classList.remove('uk-animation-shake', 'uk-animation-fade');
			}, 700);
			status = false;
		}

		return status;
	};

	// Get sent params
	const getParams = () => {
		if (location.pathname !== '/pages/add') {
			setSectionData(params.get('sections'));
			setPageForm({
				name: params.get('page'),
				title: params.get('title'),
				layout: params.get('layout'),
				breadcrumb: params.get('breadcrumb'),
			});
		}
	};

	// Placeholder wrap condition
	const activatePlacehold = () => {
		if (mode === 'edit' && sectionData.length > 0) {
			placeholdWrap.current.setAttribute('hidden', '');
		}
	};

	// As blog wrap condition
	const activateAsBlog = () => {
		if (blogStatus) {
			canvasWrap.current.removeAttribute('data-uk-sortable');
			canvasLibraryBtn.current.setAttribute('disabled', '');
		} else {
			canvasWrap.current.setAttribute('data-uk-sortable', 'group: sortable-group; cls-custom: drag-canvas');
			canvasLibraryBtn.current.removeAttribute('disabled');
		}
	};

	// Handle editor section code
	const handleEditorSection = async section => {
		bs.socket.emit('readSectionData', section);
		const dataStorage = JSON.parse(sessionStorage.getItem(section));
		const dataSocket = await new Promise(resolve => {
			bs.socket.once('resultSectionData', data => resolve(data));
		});
		const editor = new EditorJS({
			holder: document.querySelector(`#editor-${section}`),
			minHeight: 0,
			data: dataStorage === null ? dataSocket : dataStorage,
			tools: {code: CodeMirror},
			defaultBlock: 'code',
			logLevel: 'ERROR',
		});

		editor.isReady
			.then(() => {
				// Save editor section
				document.addEventListener('click', e => {
					if (e.target.classList.contains('section-save')) {
						const sectionName = e.target.parentElement.previousElementSibling.id.slice(7);
						const modalWrap = editor.configuration.holder.closest('.uk-modal-container');
						const editorWrap = modalWrap.querySelector('.codex-editor');

						editor.save().then(data => {
							data.blocks[0].id = sectionName;
							delete data.time;
							delete data.version;
							sessionStorage.setItem(sectionName, JSON.stringify(data));
							UIkit.modal(modalWrap).hide();
							if (editorWrap !== null) {
								editorWrap.remove();
							}
						});
					}
				});

				// Clear editor event
				document.addEventListener('click', e => {
					if (e.target.classList.contains('uk-modal-close') || e.target.classList.contains('uk-togglabe-leave')) {
						if (editor.configuration.holder.firstChild !== null) {
							editor.configuration.holder.querySelector('.codex-editor').remove();
						}
					}
				});
			});
	};

	// Filter used sections in canvas
	const filterSections = async data => {
		const canvas = await canvasWrap.current.children;
		const usedArr = Array.from(canvas).map(each => `${each.classList[1]}.hbs`);
		const filteredArr = data.map(item => item.sections).map(arr => removeDuplicates(arr, usedArr));
		const result = data.filter((item, index) => {
			item.sections = filteredArr[index];
			return item.sections;
		});

		function removeDuplicates(arr1, arr2) {
			return [...new Set(arr1.concat(arr2).filter(e => !(arr2.includes(e))))];
		}

		setLibraryData(result);
	};

	useEffect(() => {
		socketPagesAction();
		getParams();
		breadcrumbForm(params.get('breadcrumb'));
	}, []);
	useEffect(() => activatePlacehold(), [sectionData]);
	useEffect(() => handleBlogStatus(), [canvasWrap.current]);
	useEffect(() => activateAsBlog(), [blogStatus]);
	useEffect(() => {
		if (showPrompt) {
			UIkit.modal.confirm('All changes will be lost. Do you really want to leave without saving?').then(() => {
				setIsDirty(false);
				confirmleave();
			}, () => cancelLeave());
		}
	}, [showPrompt]);

	return (
		<div className='tm-main uk-section blockit-pages blockit-posts-action'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h5 className='head-title'>
							<Link to='/pages' className='uk-link-heading'>
								<i className='ri-arrow-left-line ri-sm uk-margin-small-right'></i>Pages
							</Link>
						</h5>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'></div>
				</div>

				<div className='uk-grid uk-margin-top'>
					<div className='uk-width-2-3'>
						<div className='post-wrap'>
							<div className='uk-width-1-1 uk-position-relative'>
								<div className='sortable-canvas uk-margin-top' data-uk-sortable='group: sortable-group; cls-custom: drag-canvas' ref={canvasWrap}>
									<PagesCanvas
										canvasAreaRef={canvasWrap}
										placeholderRef={placeholdWrap}
										handleEditor={handleEditorSection}
										dirtyCallback={setIsDirty}
									/>
								</div>
								<div className='uk-position-center' ref={placeholdWrap}>
									<img className='uk-align-center uk-margin-remove-bottom' src={blogStatus ? '../assets/img/blockit-blog-placeholder.svg' : '../assets/img/blockit-page-placeholder.svg'} alt='canvas-placeholder' width={ blogStatus ? '220' : '182'} />
									<h5 className='uk-text-muted uk-text-center uk-margin-remove-top'>{blogStatus ? 'you set this page as a blog.' : 'drag & drop the section library here.'}</h5>
								</div>
							</div>
						</div>
						<div id='offcanvas-section-library' data-uk-offcanvas='overlay: false; flip: true'>
							<div className='uk-offcanvas-bar'>
								<PagesLibraryButton data={libraryData} />
								<PagesLibrary
									data={libraryData}
									handleEditor={handleEditorSection}
									placeholderRef={placeholdWrap}
								/>
							</div>
						</div>
					</div>
					<div className='uk-width-expand'>
						<div className='section-post-settings'>
							<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
								<form id='page-form' className='uk-grid-small uk-margin-small-bottom' onSubmit={handleSaveForm} data-uk-grid>
									<div className='uk-width-1-1'>

										<button id='save-page' className='uk-button uk-button-primary uk-border-rounded uk-width-1-1 uk-margin-small-bottom' type='submit' onClick={() => setIsDirty(false)}>
											{isLoading
												? <><i className='ri-loader-2-fill ri-1x ri-spin uk-margin-small-right'></i>Loading...</>
												: btnSuccess
													? <><i className='ri-checkbox-circle-fill ri-1x uk-margin-small-right'></i>Saved successfully</>
													: <><i className='ri-save-2-fill ri-1x uk-margin-small-right'></i>Save page</>
											}
										</button>
									</div>
									<div className='uk-width-1-1 uk-margin-top'>
										<label className='uk-form-label uk-width-expand uk-inline' htmlFor='page-name'>Page name {failName ? <span className='uk-text-small uk-text-danger uk-position-right'>required!</span> : null}</label>
										<input
											className={failName ? 'uk-input uk-border-rounded uk-form-danger' : 'uk-input uk-border-rounded'}
											type='text'
											name='name'
											value={pageForm.name}
											onChange={handleInputForm}
											onFocus={() => setFailName(false)}
											autoFocus={mode === 'add'}
										/>
									</div>
									<div className='uk-width-1-1'>
										<label className='uk-form-label uk-width-expand uk-inline' htmlFor='page-name'>Page title {failTitle ? <span className='uk-text-small uk-text-danger uk-position-right'>required!</span> : null}</label>
										<input
											className={failTitle ? 'uk-input uk-border-rounded uk-form-danger' : 'uk-input uk-border-rounded'}
											type='text'
											name='title'
											value={pageForm.title}
											onChange={handleInputForm}
											onFocus={() => setFailTitle(false)}
										/>
									</div>
									<div className='uk-width-1-1'>
										<label className='uk-form-label' htmlFor='page-type'>Layout type</label>
										<select className='uk-select uk-border-rounded' name='layout' value={pageForm.layout} onChange={handleInputForm}>
											<option value='default'>default</option>
											<option value='plain'>plain</option>
										</select>
									</div>
									<div className='uk-width-1-1 uk-margin-top'>
										<label className='uk-form-label'>
											<input
												name='breadcrumb'
												className='uk-checkbox'
												type='checkbox'
												onChange={handleInputForm}
												ref={breadcrumbCheck}
											/> Use breadcrumb navigation
										</label>
									</div>
									<div className='uk-width-1-1 uk-margin-small-top uk-inline'>
										<label className={`uk-form-label${params.get('page') !== params.get('asBlog') && params.get('asBlog') !== 'false' ? ' uk-text-muted' : ''}`}>
											<input
												className='uk-checkbox'
												type='checkbox'
												ref={blogCheck}
											/> Set as blog page {params.get('page') !== params.get('asBlog') && params.get('asBlog') !== 'false' && <span className='uk-text-small uk-text-muted uk-position-right'><strong>Currently :</strong> {params.get('asBlog')}</span>}
										</label>
									</div>
								</form>
								<button className='uk-button uk-button-default uk-border-rounded uk-width-1-1 uk-margin-top uk-margin-small-bottom' type='button' data-uk-toggle='target: #offcanvas-section-library' ref={canvasLibraryBtn}>
									<i className='ri-dashboard-line ri-1x uk-margin-small-right'></i>Section library
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}