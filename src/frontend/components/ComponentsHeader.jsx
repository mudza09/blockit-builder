import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import bs from '../utils/bs';
import UIkit from 'uikit';
import EditorJS from '../assets/js/editorjs/editorjs-disable-key-events';
import CodeMirror from '../assets/js/editorjs/codemirror/bundle';
import uploadImage from '../utils/uploadImage';
import removeParam from '../utils/removeParam';

ComponentsHeader.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function ComponentsHeader(props) {
	const headerForm = useRef(null);
	const {data, dirtyCallback} = props;

	// Site logo
	const [logoLoading, setLogoLoading] = useState(false);
	const [imageLogo, setImageLogo] = useState('http://localhost:3000/img/in-lazy.gif');

	// Handle header form
	const handleHeaderForm = () => {
		const form = headerForm.current;
		const logo = form.querySelector('img[alt="setting-site-logo"]').getAttribute('src').replace('http://localhost:3000/', '');

		data.siteLogo.src = removeParam('browsersync', logo);
		data.siteLogo.width = form.querySelector('#setting-logo-width').value;
		data.siteLogo.height = form.querySelector('#setting-logo-height').value;

		data.signup.title = form.querySelector('#setting-signup-title').value;
		data.signup.url = form.querySelector('#setting-signup-url').value;
		data.signup.external = form.querySelector('#setting-signup-url').value.substring(0, 4) === 'http';
		data.signup.display = form.querySelector('#setting-signup-title').value.length !== 0;

		data.signin.title = form.querySelector('#setting-signin-title').value;
		data.signin.url = form.querySelector('#setting-signin-url').value;
		data.signin.external = form.querySelector('#setting-signin-url').value.substring(0, 4) === 'http';
		data.signin.display = form.querySelector('#setting-signin-title').value.length !== 0;
	};

	// Handle upload logo
	const handleUploadLogo = e => {
		uploadImage({
			inputEvent: e.target,
			selector: 'setting-site-logo',
			fileName: 'header-logo',
			useButton: true,
			loading: setLogoLoading,
			path: setImageLogo,
		});
		dirtyCallback(true);
		setTimeout(() => {
			handleHeaderForm();
		}, 500);
	};

	// Hanlde editor section code
	const handleEditorHeader = async () => {
		bs.socket.emit('getHeaderData', 'empty');

		const editor = new EditorJS({
			holder: document.querySelector('#editor-header-html'),
			minHeight: 0,
			data: await new Promise(resolve => {
				bs.socket.once('headerData', data => resolve(data));
			}),
			tools: {code: CodeMirror},
			defaultBlock: 'code',
			logLevel: 'ERROR',
		});

		editor.isReady
			.then(() => {
				// Save editor section
				document.addEventListener('click', e => {
					if (e.target.id === 'header-editor-save-btn') {
						const modalWrap = editor.configuration.holder.closest('.uk-modal-container');
						const editorWrap = modalWrap.querySelector('.codex-editor');

						editor.save().then(data => {
							const code = data.blocks[0].data.text;
							bs.socket.emit('saveHeaderEditor', code);
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
		handleEditorHeader();
		UIkit.modal('#setting-header-html-wrap').show();

		document.querySelectorAll('.ct').forEach(each => each.remove());
	};

	useEffect(() => {
		if (data !== undefined) {
			setImageLogo(`http://localhost:3000/${data.siteLogo.src}`);
		}
	}, [data]);

	return (
		<li className='header'>
			<h4 className='uk-heading-line'><span>Header</span></h4>
			<form className='uk-form-horizontal uk-margin-medium' onChange={handleHeaderForm} ref={headerForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-copyright'>Header Content</label>
					<div className='uk-form-controls'>
						<button id='header-editor-btn' className='uk-button uk-button-secondary uk-border-rounded' type='button' onClick={handleModal}>
							<i className='ri-code-s-slash-line ri-1x uk-margin-small-right'></i>Edit code
						</button>
						<div id='setting-header-html-wrap' className='uk-modal-container uk-flex-top' data-uk-modal>
							<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor'>
								<div id='editor-header-html'></div>
								<div className='uk-flex uk-flex-right'>
									<button className='uk-button uk-button-secondary uk-border-rounded uk-modal-close' type='button'>Cancel</button>
									<button id='header-editor-save-btn' className='uk-button uk-button-primary uk-border-rounded uk-margin-small-left' type='button'>Save code</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-signup'>Sign up title &amp; url <i className='ri-information-fill ri-xs' data-uk-tooltip="title: Leave blank if you don't want use; pos: right"></i></label>
					<div className='uk-form-stacked uk-grid-small uk-grid' data-uk-grid>
						<div className='uk-width-1-2'>
							<input className='uk-input uk-border-rounded' id='setting-signup-title' type='text' defaultValue={data === undefined ? '' : data.signup.title} key={data === undefined ? '' : data.signup.title} onChange={() => dirtyCallback(true)} />
						</div>
						<div className='uk-width-1-2'>
							<input className='uk-input uk-border-rounded' id='setting-signup-url' type='text' defaultValue={data === undefined ? '' : data.signup.url} key={data === undefined ? '' : data.signup.url} onChange={() => dirtyCallback(true)} />
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-signin'>Sign in title &amp; url <i className='ri-information-fill ri-xs' data-uk-tooltip="title: Leave blank if you don't want use; pos: right"></i></label>
					<div className='uk-form-stacked uk-grid-small uk-grid' data-uk-grid>
						<div className='uk-width-1-2'>
							<input className='uk-input uk-border-rounded' id='setting-signin-title' type='text' defaultValue={data === undefined ? '' : data.signin.title} key={data === undefined ? '' : data.signin.title} onChange={() => dirtyCallback(true)} />
						</div>
						<div className='uk-width-1-2'>
							<input className='uk-input uk-border-rounded' id='setting-signin-url' type='text' defaultValue={data === undefined ? '' : data.signin.url} key={data === undefined ? '' : data.signin.url} onChange={() => dirtyCallback(true)} />
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-site-logo'>Site logo</label>
					<div className='uk-grid-small setting-site-logo uk-flex uk-flex-middle' data-uk-grid>
						<div className='uk-width-auto'>
							<img src={imageLogo} alt='setting-site-logo' />
						</div>
						<div className='uk-width-expand'>
							<div data-uk-form-custom>
								<input className='site-logo-upload' type='file' onChange={handleUploadLogo} />
								<button className='uk-button uk-button-secondary uk-border-rounded upload-logo-btn' type='button'>
									{logoLoading
										? <><i className='ri-loader-2-fill ri-1x ri-spin uk-margin-small-right'></i>Loading...</>
										: <><i className='ri-upload-2-line ri-1x uk-margin-small-right'></i>Change logo</>
									}
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-logo-dimension'>Logo dimension <i className='ri-information-fill ri-xs' data-uk-tooltip='title: Size in pixels; pos: right'></i></label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded setting-number-dimension' id='setting-logo-width' type='number' defaultValue={data === undefined ? '' : data.siteLogo.width} onChange={() => dirtyCallback(true)} />
						<span className='uk-text-muted uk-margin-small-left uk-margin-small-right'>x</span>
						<input className='uk-input uk-border-rounded setting-number-dimension' id='setting-logo-height' type='number' defaultValue={data === undefined ? '' : data.siteLogo.height} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
			</form>
		</li>
	);
}
