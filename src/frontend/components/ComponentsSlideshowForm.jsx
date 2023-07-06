import PropTypes from 'prop-types';
import UIkit from 'uikit';
import EditorJS from '../assets/js/editorjs/editorjs-disable-key-events';
import CodeMirror from '../assets/js/editorjs/codemirror/bundle';

ComponentsSlideshowForm.propTypes = {
	callback: PropTypes.func,
	data: PropTypes.object,
	parentData: PropTypes.object,
};

export default function ComponentsSlideshowForm(props) {
	const {callback, data, parentData} = props;

	// Handle editor slide code
	const handleEditorSlide = slideId => {
		let dataSlide;
		if (JSON.parse(sessionStorage.getItem(`slide-${slideId}`)) === null) {
			dataSlide = {
				blocks: [
					{
						id: slideId,
						type: 'code',
						data: {
							language: 'handlebars',
							text: data.text,
						},
					},
				],
			};
		}

		const editor = new EditorJS({
			holder: document.querySelector(`#editor-slide-${slideId}`),
			minHeight: 0,
			data: JSON.parse(sessionStorage.getItem(`slide-${slideId}`)) === null ? dataSlide : JSON.parse(sessionStorage.getItem(`slide-${slideId}`)),
			tools: {code: CodeMirror},
			defaultBlock: 'code',
			logLevel: 'ERROR',
		});

		editor.isReady
			.then(() => {
				// Save editor section
				document.addEventListener('click', e => {
					if (e.target.classList.contains('slide-save')) {
						const slideName = `slide-${slideId}`;
						const modalWrap = editor.configuration.holder.closest('.uk-modal-container');
						const editorWrap = modalWrap.querySelector('.codex-editor');

						editor.save().then(dataEditor => {
							dataEditor.blocks[0].id = slideName.slice(6);
							delete dataEditor.time;
							delete dataEditor.version;

							// Store update data into sessionStorage, and send update data itu parent props data
							sessionStorage.setItem(slideName, JSON.stringify(dataEditor));
							data.text = JSON.parse(sessionStorage.getItem(slideName)).blocks[0].data.text;

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

	// Handle modal code editor
	const handleModal = slideId => {
		const element = document.querySelector(`#modal-${slideId}`);

		handleEditorSlide(slideId);
		UIkit.modal(element).show();

		document.querySelectorAll('.ct').forEach(each => each.remove());
	};

	return (
		<form className='uk-grid uk-grid-medium' data-uk-grid>
			<div className='uk-width-expand'>
				<div className='uk-inline-clip component-slide-new uk-flex uk-flex-left uk-flex-middle uk-background-contain uk-background-center-left' style={{backgroundImage: 'url("assets/img/blockit-slide-code.svg")'}}>
					<span className='uk-label uk-label-warning uk-text-small uk-border-rounded component-slide-count'>id: {data.id}</span>
					<div className='uk-position-cover uk-flex uk-flex-right uk-flex-middle'>
						<button className='uk-button uk-button-secondary uk-border-rounded uk-margin-small-right' type='button' onClick={() => handleModal(data.id)}>
							<i className='ri-code-s-slash-line ri-1x uk-margin-small-right'></i>Edit code
						</button>
						<button className='uk-button uk-button-default uk-border-rounded uk-margin-right' onClick={e => callback(e, data.id, parentData)}>
							<i className='ri-delete-bin-line ri-sm uk-margin-small-right'></i>Delete slide
						</button>
						<div id={'modal-' + data.id} className='uk-modal-container uk-flex-top' data-uk-modal>
							<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-border-rounded blockit-code-editor'>
								<div id={'editor-slide-' + data.id}></div>
								<div className='uk-flex uk-flex-right'>
									<button className='uk-button uk-button-secondary uk-border-rounded uk-modal-close' type='button'>Cancel</button>
									<button className='uk-button uk-button-primary uk-border-rounded uk-margin-small-left slide-save' type='button'>Save code</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
