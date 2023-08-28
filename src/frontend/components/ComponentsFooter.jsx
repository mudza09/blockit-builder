import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import bs from '../utils/bs';
import UIkit from 'uikit';
import EditorJS from '../assets/js/editorjs/editorjs-disable-key-events';
import CodeMirror from '../assets/js/editorjs/codemirror/bundle';
import uploadImage from '../utils/uploadImage';
import removeParam from '../utils/removeParam';

ComponentsFooter.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function ComponentsFooter(props) {
	const footerForm = useRef(null);
	const logoRadio = useRef(null);
	const [uploadLimit, setUploadLimit] = useState(false);
	const {data, dirtyCallback} = props;

	// Footer logo status
	const [footerLogoStatus, setFooterLogoStatus] = useState(true);

	// Upload image logo and loading state
	const [imageLogo, setImageLogo] = useState('http://localhost:3000/img/in-lazy.gif');

	// Footer logo radio
	const footerLogoRadio = condition => {
		const form = footerForm.current;
		if (condition) {
			form.querySelector('#footer-logo-enable').checked = true;
		} else {
			form.querySelector('#footer-logo-disable').checked = true;
		}
	};

	// Handle footer form
	const handleFooterForm = () => {
		const form = footerForm.current;
		const footerRadioEnable = footerLogoStatus ? logoRadio.current.checked : null;
		const footerLogoImg = footerLogoStatus ? form.querySelector('img[alt="setting-footer-logo"]').getAttribute('src').replace('http://localhost:3000/', '') : null;

		data.copyrightText = form.querySelector('#setting-copyright').value;
		data.siteLogo.enabled = Boolean(footerRadioEnable);
		data.siteLogo.logo.src = footerLogoStatus ? removeParam('browsersync', footerLogoImg) : '';
		data.siteLogo.logo.width = footerLogoStatus ? form.querySelectorAll('.setting-number-dimension')[0].value : '';
		data.siteLogo.logo.height = footerLogoStatus ? form.querySelectorAll('.setting-number-dimension')[1].value : '';
	};

	// Handle upload logo
	const handleUploadLogo = e => {
		let pathCallback = '';

		pathCallback = setImageLogo;

		uploadImage({
			inputEvent: e.target,
			selector: 'setting-footer-logo',
			fileName: 'footer-logo',
			useButton: false,
			path: pathCallback,
			sizeLimit: setUploadLimit,
		});
		dirtyCallback(true);
		setTimeout(() => {
			handleFooterForm();
		}, 500);
	};

	// Hanlde editor section code
	const handleEditorFooter = async () => {
		bs.socket.emit('getFooterData', 'empty');

		const editor = new EditorJS({
			holder: document.querySelector('#editor-footer-html'),
			minHeight: 0,
			data: await new Promise(resolve => {
				bs.socket.once('footerData', data => resolve(data));
			}),
			tools: {code: CodeMirror},
			defaultBlock: 'code',
			logLevel: 'ERROR',
		});

		editor.isReady
			.then(() => {
				// Save editor section
				document.addEventListener('click', e => {
					if (e.target.id === 'footer-editor-save-btn') {
						const modalWrap = editor.configuration.holder.closest('.uk-modal-container');
						const editorWrap = modalWrap.querySelector('.codex-editor');

						editor.save().then(data => {
							const code = data.blocks[0].data.text;
							bs.socket.emit('saveFooterEditor', code);
							UIkit.modal(modalWrap).hide();
							editorWrap.remove();
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

	// Handle modal code editor
	const handleModal = () => {
		handleEditorFooter();
		UIkit.modal('#setting-footer-html-wrap').show();

		document.querySelectorAll('.ct').forEach(each => each.remove());
	};

	useEffect(() => {
		if (data !== undefined) {
			setImageLogo(`http://localhost:3000/${data.siteLogo.logo.src}`);
			if (data.useLogo === false) {
				setFooterLogoStatus(false);
			}

			footerLogoRadio(data.siteLogo.enabled);
		}
	}, [data]);

	return (
		<li className='footer'>
			<h4 className='uk-heading-line'><span>Footer</span></h4>
			<form className='uk-form-horizontal uk-margin-medium' onChange={handleFooterForm} ref={footerForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-copyright'>Footer Content</label>
					<div className='uk-form-controls'>
						<button id='footer-editor-btn' className='uk-button uk-button-secondary uk-border-rounded' type='button' onClick={handleModal}>
							<i className='ri-code-s-slash-line ri-1x uk-margin-small-right'></i>Edit code
						</button>
						<div id='setting-footer-html-wrap' className='uk-modal-container uk-flex-top' data-uk-modal>
							<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor'>
								<div id='editor-footer-html'></div>
								<div className='uk-flex uk-flex-right'>
									<button className='uk-button uk-button-secondary uk-border-rounded uk-modal-close' type='button'>Cancel</button>
									<button id='footer-editor-save-btn' className='uk-button uk-button-primary uk-border-rounded uk-margin-small-left' type='button'>Save code</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-copyright'>Copyright text</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-copyright' type='text' defaultValue={data === undefined ? '' : data.copyrightText} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				{footerLogoStatus === true
					&& <div className='uk-margin'>
						<label className='uk-form-label' htmlFor='setting-footer-logo'>Footer logo</label>
						<div className='uk-form-controls uk-form-controls-text'>
							<label className='small-label uk-margin-right'><input className='uk-radio' id='footer-logo-enable' type='radio' value='enable' name='setting-footer-logo' ref={logoRadio} onChange={() => dirtyCallback(true)} /> Enable</label>
							<label className='small-label'><input className='uk-radio' id='footer-logo-disable' type='radio' value='disable' name='setting-footer-logo' onChange={() => dirtyCallback(true)} /> Disable</label>
							<div className='uk-form-stacked uk-grid-small uk-grid uk-margin setting-footer-logo-wrap' data-uk-grid>
								<div className='uk-width-auto'>
									<div className='uk-flex uk-flex-bottom' data-uk-form-custom>
										<div className='uk-inline-clip uk-transition-toggle setting-footer-logo'>
											<img src={imageLogo} alt='setting-footer-logo' />
											<div className='uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle'>
												<input className='footer-logo-upload' type='file' onChange={e => handleUploadLogo(e)} />
												<button className={`uk-button ${uploadLimit ? 'ri-error-warning-fill' : 'ri-camera-fill'} ri-1x uk-label uk-border-pill`} type='button'></button>
											</div>
										</div>
									</div>
								</div>
								<div className='uk-width-auto uk-flex uk-flex-middle'>
									<input className='uk-input uk-border-rounded setting-number-dimension' type='number' defaultValue={data === undefined ? '' : data.siteLogo.logo.width} onChange={() => dirtyCallback(true)} />
									<span className='uk-text-muted uk-margin-small-left uk-margin-small-right'>x</span>
									<input className='uk-input uk-border-rounded setting-number-dimension' type='number' defaultValue={data === undefined ? '' : data.siteLogo.logo.height} onChange={() => dirtyCallback(true)} />
									<label className='uk-form-label uk-margin-small-left uk-margin-remove-top' htmlFor='setting-footer-logo'><i className='ri-information-fill ri-xs' data-uk-tooltip='title: Size in pixels; pos: right' title='' aria-expanded='false' tabIndex='0'></i></label>
								</div>
							</div>
						</div>
					</div>
				}
			</form>
		</li>
	);
}
