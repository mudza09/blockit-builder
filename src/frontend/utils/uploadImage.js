import bs from './bs';
import ShortUniqueId from 'short-unique-id';

export default function uploadImage(options) {
	const element = options.inputEvent.closest(`.${options.selector}`).querySelector('img');
	const buffer = options.inputEvent.files[0];

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	let typeFile = '';

	if (options.favicon === true && buffer.size < 1000000) {
		switch (buffer.type) {
			case 'image/x-icon':
				typeFile = 'ico';
				uploader();
				break;
			// No Default
		}
	} else if (options.touchIcon === true && buffer.size < 1000000) {
		switch (buffer.type) {
			case 'image/png':
				typeFile = 'png';
				uploader();
				break;
			// No Default
		}
	} else if (buffer.size < 1000000) {
		console.log(buffer.type);
		switch (buffer.type) {
			case 'image/jpeg':
				typeFile = 'jpg';
				uploader();
				break;
			case 'image/png':
				typeFile = 'png';
				uploader();
				break;
			case 'image/gif':
				typeFile = 'gif';
				uploader();
				break;
			case 'image/svg+xml':
				typeFile = 'svg';
				uploader();
				break;
			case 'image/webp':
				typeFile = 'webp';
				uploader();
				break;
			// No Default
		}
	} else {
		options.sizeLimit(true);
		setTimeout(() => options.sizeLimit(false), 2000);
	}

	function uploader() {
		const nameFile = `${options.fileName}-${uid()}.${typeFile}`;
		const reader = new FileReader();

		if (options.useButton === true) {
			reader.readAsArrayBuffer(buffer);
			reader.onload = async () => {
				if (options.loading !== undefined) {
					options.loading(true);
				}

				bs.socket.emit('assetsUpload', buffer, nameFile, typeFile);
				await new Promise(resolve => {
					bs.socket.once('uploadDone', path => {
						setTimeout(() => {
							resolve(options.path(`http://localhost:3000/${path}`));
						}, 300);
					});
				});

				if (options.loading !== undefined) {
					options.loading(false);
				}
			};

			reader.onerror = () => console.error(reader.error);
		} else {
			reader.readAsArrayBuffer(buffer);
			reader.onload = async () => {
				if (options.customClass !== undefined) {
					element.parentElement.classList.add(options.customClass);
				}

				if (options.loading !== undefined) {
					document.querySelector('.post-upload-button').setAttribute('hidden', '');
					options.loading(true);
				}

				bs.socket.emit('assetsUpload', buffer, nameFile, typeFile);
				await new Promise(resolve => {
					bs.socket.once('uploadDone', path => {
						setTimeout(() => {
							if (options.customClass !== undefined) {
								element.parentElement.classList.remove(options.customClass);
							}

							if (options.position === undefined) {
								resolve(options.path(`http://localhost:3000/${path}`));
							} else {
								resolve(options.path(`http://localhost:3000/${path}`, options.position));
							}
						}, 300);
					});
				});

				if (options.loading !== undefined) {
					options.loading(false);
				}
			};

			reader.onerror = () => console.error(reader.error);
		}
	}
}
