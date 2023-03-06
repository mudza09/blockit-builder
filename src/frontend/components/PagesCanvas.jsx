import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import PropTypes from 'prop-types';
import bs from '../utils/bs';
import UIkit from 'uikit';

PagesCanvas.propTypes = {
	canvasAreaRef: PropTypes.object,
	handleEditor: PropTypes.func,
	placeholderRef: PropTypes.object,
	dirtyCallback: PropTypes.bool,
	modeChange: PropTypes.bool,
	canvasId: PropTypes.array,
};

export default function PagesCanvas(props) {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const params = new URLSearchParams(location.search);
	const sections = params.get('sections');
	const {canvasAreaRef, handleEditor, placeholderRef, dirtyCallback, modeChange, canvasId} = props;

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	// Handle drag and drop event
	const handleDragDrop = () => {
		UIkit.util.on(canvasAreaRef.current, 'added', () => {
			dirtyCallback(true);
			Array.from(canvasAreaRef.current.children).forEach(async item => {
				const sectionId = uid();
				const hasSaved = item.querySelector('img').getAttribute('alt').split('-').at(-1).match(/^(?=.*?[A-Z])(?=.*?[a-z]).{6,}$/gm);
				const isComponent = item.querySelector('img').getAttribute('alt').includes('component');

				if (!hasSaved && !isComponent) {
					item.querySelector('img').setAttribute('alt', `${item.classList[1]}-${sectionId}`);
					item.querySelector('span').textContent = `${item.classList[1]}-${sectionId}`;
					item.querySelector(`#modal-${item.classList[1]}`).setAttribute('id', `modal-${item.classList[1]}-${sectionId}`);
					item.querySelector(`#editor-${item.classList[1]}`).setAttribute('id', `editor-${item.classList[1]}-${sectionId}`);
					item.querySelector('.uk-button').setAttribute('data-uk-toggle', `target: #modal-${item.classList[1]}-${sectionId}`);

					bs.socket.emit('readSectionData', item.classList[1]);
					const dataSocket = await new Promise(resolve => {
						bs.socket.once('resultSectionData', data => resolve(data));
					});
					sessionStorage.setItem(`${item.classList[1]}-${sectionId}`, JSON.stringify(dataSocket));
				}

				item.querySelector('.uk-transition-fade').classList.remove('uk-flex-bottom');
				item.querySelector('.uk-transition-fade').classList.add('uk-flex-middle');
				item.querySelector('.uk-text-small').setAttribute('hidden', '');
				item.querySelector('.uk-button').removeAttribute('hidden');

				const modalEl = item.querySelector('.uk-modal-container');
				if (modalEl !== null && modalEl.hasAttribute('hidden')) {
					modalEl.removeAttribute('hidden');
				}
			});
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

		if (section.includes('slideshow')) {
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

	// Set storage data of sections in edit mode
	const setStorageData = async sections => {
		bs.socket.emit('readSectionsEdit', sections);
		await new Promise(resolve => {
			bs.socket.once('resultSectionsEdit', data => resolve(
				data.forEach(each => sessionStorage.setItem(`${each.name}`, JSON.stringify(each.data))),
			));
		});
	};

	useEffect(() => {
		if (sections !== null) {
			setData(sections.split(','));
			setStorageData(sections.split(','));
		}

		handleDragDrop();
	}, []);
	useEffect(() => handleItemId(canvasId), [modeChange]);

	return data.map(item => {
		const checkPath = item.includes('component-slideshow') ? item : item.substring(0, item.lastIndexOf('-'));
		return (
			<div key={item} className={'sections-name ' + item}>
				<div className='uk-inline-clip uk-transition-toggle'>
					{!item.includes('section-blog') && <img className='uk-border-rounded' src={'../assets/img/sections/' + checkPath + '.webp'} alt={item} />}
					<div className='uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle'>
						<span className='uk-text-small' hidden>{item}</span>
						<button className='uk-button uk-button-secondary uk-border-rounded section-button' type='button' onClick={() => handleModal(item)}>
							<i className='ri-code-s-slash-line ri-1x uk-margin-small-right'></i>Edit HTML code
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
