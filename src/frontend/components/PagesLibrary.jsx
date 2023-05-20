import {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import UIkit from 'uikit';

PagesLibrary.propTypes = {
	data: PropTypes.array,
	handleEditor: PropTypes.func,
	handleDelete: PropTypes.func,
	placeholderRef: PropTypes.object,
};

export default function PagesLibrary(props) {
	const navigate = useNavigate();
	const libraryWrap = useRef(null);
	const {data, handleEditor, handleDelete, placeholderRef} = props;

	// Handle drag and drop event
	const handleDragDrop = () => {
		UIkit.util.on(libraryWrap.current, 'start', () => {
			placeholderRef.current.setAttribute('hidden', '');
		});

		UIkit.util.on(libraryWrap.current, 'added', () => {
			libraryWrap.current.querySelectorAll('.sections-name').forEach(item => {
				const hasChanged = item.querySelector('img').getAttribute('alt').split('-').at(-1).match(/^(?=.*?[A-Z])(?=.*?[a-z]).{6,}$/gm);

				if (hasChanged) {
					item.querySelector('img').setAttribute('alt', item.classList[1]);
					item.querySelector('span').textContent = item.classList[1];
					item.querySelector('.uk-modal-container').setAttribute('id', `modal-${item.classList[1]}`);
					item.querySelector('.uk-modal-dialog').children[0].setAttribute('id', `editor-${item.classList[1]}`);
					item.querySelector('.uk-button').setAttribute('data-uk-toggle', `target: #modal-${item.classList[1]}`);
				}

				item.querySelector('.uk-transition-fade').classList.remove('uk-flex-middle', 'uk-flex-right');
				item.querySelector('.uk-transition-fade').classList.add('uk-flex-bottom', 'uk-flex-center');
				item.querySelector('.uk-text-small').removeAttribute('hidden', '');
				item.querySelector('.uk-button').setAttribute('hidden', '');
				item.querySelector('.uk-button-danger').setAttribute('hidden', '');

				const modalEl = item.querySelector('.uk-modal-container');
				if (modalEl !== null && !modalEl.hasAttribute('hidden')) {
					modalEl.setAttribute('hidden', '');
				}
			});
		});
	};

	// Slideshow html edit condition
	const htmlCodeCondition = (item, index) => {
		if (item.target.previousElementSibling.textContent.includes('slideshow')) {
			navigate('/components');
		} else {
			handleEditor(item.target.previousElementSibling.textContent, index);
		}
	};

	useEffect(() => handleDragDrop(), []);

	return (
		<div className='scrollable-content sortable-library' ref={libraryWrap}>
			{data.map(library => (
				<div key={library.name} id={'wrap-' + library.name.toLowerCase()}>
					<h5 className='uk-heading-line'><span><i className={library.icon + ' ri-1x uk-margin-small-right'}></i>{library.name}</span></h5>
					<div className='sortable-box uk-grid-small uk-child-width-1-2' data-uk-sortable='group: sortable-group; cls-custom: drag-library; threshold: 1; duration: 400' data-uk-grid='masonry: true'>
						{
							library.sections.sort((a, b) => a.length - b.length).map((each, index) => {
								const item = each.split('.')[0];
								return (
									<div key={item} className={'sections-name ' + item}>
										<div className='uk-inline-clip uk-transition-toggle'>
											<img className='uk-border-rounded' src={'../assets/img/sections/' + item + '.webp'} alt={item}/>
											<div className='uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-bottom'>
												<span className='uk-text-small'>{item}</span>
												<button className='uk-button uk-button-small uk-button-secondary uk-border-rounded section-button' type='button' data-uk-toggle={item.includes('slideshow') ? 'disable' : `target: #modal-${item}`} onClick={e => htmlCodeCondition(e, index)} hidden>
													<i className='ri-code-s-slash-line ri-sm uk-margin-small-right'></i>Edit code
												</button>
												<button className='uk-button uk-button-small uk-button-danger uk-border-rounded section-button' type='button' onClick={e => handleDelete(e)} hidden>
													<i className='ri-delete-bin-line ri-sm uk-margin-remove-right'></i>
												</button>
												<div id={'modal-' + item} className='uk-modal-container uk-flex-top uk-modal' data-uk-modal hidden>
													<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor'>
														<div id={'editor-' + item}></div>
														<div className='uk-flex uk-flex-righ'>
															<button className='uk-button uk-button-secondary uk-border-rounded uk-modal-close' type='button'>Cancel</button>
															<button className='uk-button uk-button-primary uk-border-rounded uk-margin-small-left section-save' type='button'>Save code</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})
						}
					</div>
				</div>
			))}
		</div>
	);
}
