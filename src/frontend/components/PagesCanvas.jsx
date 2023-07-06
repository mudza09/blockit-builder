import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import PropTypes from 'prop-types';
import bs from '../utils/bs';
import UIkit from 'uikit';

PagesCanvas.propTypes = {
	canvasAreaRef: PropTypes.object,
	handleEditor: PropTypes.func,
	handleDelete: PropTypes.func,
	placeholderRef: PropTypes.object,
	dirtyCallback: PropTypes.bool,
	modeChange: PropTypes.bool,
	canvasId: PropTypes.array,
	insertBlankSection: PropTypes.array,
};

export default function PagesCanvas(props) {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const params = new URLSearchParams(location.search);
	const sections = params.get('sections');
	const {canvasAreaRef, handleEditor, handleDelete, placeholderRef, dirtyCallback, modeChange, canvasId, insertBlankSection} = props;

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	// Handle drag and drop event
	const handleDragDrop = () => {
		UIkit.util.on(canvasAreaRef.current, 'moved', () => {
			dirtyCallback(true);
		});

		UIkit.util.on(canvasAreaRef.current, 'added', async item => {
			dirtyCallback(true);

			const sectionId = uid();
			const sectionName = item.detail[1].classList[1];
			const sectionEl = item.detail[1];

			if (!sectionName.includes('component')) {
				sectionEl.querySelector('img').setAttribute('alt', `${sectionName}-${sectionId}`);
				sectionEl.querySelector('span').textContent = `${sectionName}-${sectionId}`;
				sectionEl.querySelector(`#modal-${sectionName}`).setAttribute('id', `modal-${sectionName}-${sectionId}`);
				sectionEl.querySelector(`#editor-${sectionName}`).setAttribute('id', `editor-${sectionName}-${sectionId}`);
				sectionEl.querySelector('.uk-button').setAttribute('data-uk-toggle', `target: #modal-${sectionName}-${sectionId}`);

				bs.socket.emit('readSectionData', sectionName);
				const dataSocket = await new Promise(resolve => {
					bs.socket.once('resultSectionData', data => resolve(data));
				});

				sessionStorage.setItem(`${sectionName}-${sectionId}`, JSON.stringify(dataSocket));
			}

			sectionEl.querySelector('.uk-transition-fade').classList.remove('uk-flex-center', 'uk-flex-bottom');
			sectionEl.querySelector('.uk-transition-fade').classList.add('uk-flex-top', 'uk-flex-right');
			sectionEl.querySelector('.uk-text-small').setAttribute('hidden', '');
			sectionEl.querySelector('.uk-button').removeAttribute('hidden');
			sectionEl.querySelector('.uk-button-danger').removeAttribute('hidden');

			const modalEl = sectionEl.querySelector('.uk-modal-container');
			if (modalEl !== null && modalEl.hasAttribute('hidden')) {
				modalEl.removeAttribute('hidden');
			}
		});

		UIkit.util.on(canvasAreaRef.current, 'removed', () => {
			dirtyCallback(true);

			const canvasArr = Array.from(canvasAreaRef.current.children).map(each => each.querySelector('span').textContent);
			const storageArr = Object.keys(sessionStorage);
			const deleteSection = storageArr.filter(each => !canvasArr.includes(each));

			deleteSection.forEach(each => sessionStorage.removeItem(each));

			if (canvasAreaRef.current.childElementCount === 0) {
				sessionStorage.clear();
				placeholderRef.current.removeAttribute('hidden');
			}
		});
	};

	// Handle modal code editor
	const handleModal = async section => {
		const element = document.querySelector(`#modal-${section}`);

		if (section.includes('component')) {
			navigate('/components');
		} else {
			await handleEditor(section);
			UIkit.modal(element).show();

			document.querySelectorAll('.ct').forEach(each => each.remove());
		}
	};

	// Handle item Id in canvas
	const handleItemId = id => {
		if (modeChange) {
			const sectionId = id.map(each => `${each.name}`);
			Array.from(canvasAreaRef.current.children).forEach(each => each.remove());
			setData(sectionId);
		}
	};

	// Handle missing preview image
	const handleMissingImage = e => {
		e.target.src = '../assets/img/blockit-missing-section.webp';
	};

	// Set storage data of sections in edit mode
	const setStorageData = async sections => {
		bs.socket.emit('readSectionsEdit', sections);
		await new Promise(resolve => {
			bs.socket.once('resultSectionsEdit', data => resolve(
				data.forEach(each => sessionStorage.setItem(`${each.name}`, JSON.stringify(each.data))),
			));
		});
	};

	// Insert blank section into canvas
	const handleInsertBlank = async () => {
		if (insertBlankSection) {
			dirtyCallback(true);
			placeholderRef.current.setAttribute('hidden', '');

			const blankId = uid();
			const sectionName = 'section-blank';

			bs.socket.emit('readSectionData', sectionName);
			const dataSocket = await new Promise(resolve => {
				bs.socket.once('resultSectionData', data => resolve(data));
			});

			setData(data => [...data, `${sectionName}-${blankId}`]);
			sessionStorage.setItem(`${sectionName}-${blankId}`, JSON.stringify(dataSocket));
		}
	};

	useEffect(() => {
		if (sections !== null) {
			setData(sections.split(','));
			setStorageData(sections.split(','));
		}

		handleDragDrop();
	}, []);
	useEffect(() => handleItemId(canvasId), [modeChange]);
	useEffect(() => handleInsertBlank(), [insertBlankSection]);

	return data.map(item => {
		const checkPath = item.includes('component-slideshow') ? item : item.substring(0, item.lastIndexOf('-'));
		return (
			<div key={item} className={'sections-name ' + item}>
				<div className='uk-inline-clip uk-transition-toggle'>
					{!item.includes('section-blog') && <img className='uk-border-rounded' src={'../assets/img/sections/' + checkPath + '.webp'} onError={handleMissingImage} alt={item} />}
					<div className='uk-transition-fade uk-position-cover uk-flex uk-flex-top uk-flex-right'>
						<span className='uk-text-small' hidden>{item}</span>
						<button className='uk-button uk-button-small uk-button-secondary uk-border-rounded section-button' type='button' onClick={() => handleModal(item)}>
							<i className='ri-code-s-slash-line ri-sm uk-margin-small-right'></i>Edit code
						</button>
						<button className='uk-button uk-button-small uk-button-danger uk-border-rounded section-button' type='button' onClick={e => handleDelete(e)}>
							<i className='ri-delete-bin-line ri-sm uk-margin-remove-right'></i>
						</button>
						<div id={'modal-' + item} className='uk-modal-container uk-flex-top uk-modal' data-uk-modal>
							<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor'>
								<div id={'editor-' + item}></div>
								<div className='uk-flex uk-flex-right'>
									<button className='uk-button uk-button-secondary uk-border-rounded uk-modal-close' type='button'>Cancel</button>
									<button className='uk-button uk-button-primary uk-border-rounded uk-margin-small-left section-save' type='button'>Save code</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	});
}
