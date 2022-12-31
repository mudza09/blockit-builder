import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import UIkit from 'uikit';

PagesCanvas.propTypes = {
	canvasAreaRef: PropTypes.object,
	handleEditor: PropTypes.func,
	placeholderRef: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function PagesCanvas(props) {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const params = new URLSearchParams(location.search);
	const sections = params.get('sections');
	const {canvasAreaRef, handleEditor, placeholderRef, dirtyCallback} = props;

	// Handle drag and drop event
	const handleDragDrop = () => {
		UIkit.util.on(canvasAreaRef.current, 'added', () => {
			dirtyCallback(true);
			Array.from(canvasAreaRef.current.children).forEach(item => {
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
			if (canvasAreaRef.current.childElementCount === 0) {
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

	useEffect(() => {
		if (sections !== null) {
			setData(sections.split(','));
		}

		handleDragDrop();
	}, []);

	return data.map(item => {
		const checkPath = item.includes('section-slideshow') ? item : item.substring(0, item.lastIndexOf('-'));
		return (
			<div key={item} className={'sections-name ' + item}>
				<div className='uk-inline-clip uk-transition-toggle'>
					{!item.includes('section-blog') && <img className='uk-border-rounded' src={'../assets/img/sections/' + checkPath + '.webp'} alt={item}/>}
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
