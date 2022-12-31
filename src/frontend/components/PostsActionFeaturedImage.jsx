import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import bs from '../utils/bs';
import UIkit from 'uikit';
import uploadImage from '../utils/uploadImage';

PostsActionFeaturedImage.propTypes = {
	data: PropTypes.string,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionFeaturedImage(props) {
	const [imagePost, setImagePost] = useState('../assets/img/blockit-image-post.svg');
	const [uploadLoading, setUploadLoading] = useState(false);
	const [uploadLimit, setUploadLimit] = useState(false);
	const {data, dirtyCallback} = props;

	// Handle upload featured image
	const handleUploadFeatured = e => {
		uploadImage({
			inputEvent: e.target,
			selector: 'post-image',
			fileName: 'image-featured',
			useButton: false,
			loading: setUploadLoading,
			path: setImagePost,
			sizeLimit: setUploadLimit,
		});
		dirtyCallback(true);
	};

	// Handle delete featured image
	const handleDeleteFeatured = async (e, path) => {
		e.preventDefault();

		const deletedAsset = path.replace('http://localhost:3000/img/user/', '');

		UIkit.modal.confirm('Featured image will be deleted, are you ok with that?').then(async () => {
			setUploadLoading(true);
			bs.socket.emit('assetsDelete', deletedAsset);
			await new Promise(resolve => {
				bs.socket.once('deleteDone', () => {
					resolve(
						setUploadLoading(false),
						setImagePost('../assets/img/blockit-image-post.svg'),
					);
				});
			});
			document.querySelector('.post-upload-button').removeAttribute('hidden');
		}, () => null);
	};

	useEffect(() => {
		if (data !== undefined) {
			setImagePost(data === false ? '../assets/img/blockit-image-post.svg' : `http://localhost:3000/${data}`);
		}
	}, [data]);

	return (
		<div className='uk-width-1-1'>
			<label className='uk-form-label' htmlFor='form-author-avatar'>
                Featured image <a className='delete-image-btn ri-delete-bin-line ri-1x uk-float-right' onClick={e => handleDeleteFeatured(e, imagePost)} hidden={ imagePost === '../assets/img/blockit-image-post.svg' }></a>
			</label>
			<div className='uk-form-controls uk-margin-small-bottom'>
				<div className='uk-width-1-1' data-uk-form-custom>
					<div className='uk-inline-clip uk-transition-toggle post-image uk-flex uk-flex-center uk-flex-middle' tabIndex='0'>
						{uploadLoading ? <i className='ri-loader-2-fill ri-spin ri-2x uk-text-muted'></i> : <img src={imagePost} alt='post-image' />}
						<div className='uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle' hidden={ imagePost !== '../assets/img/blockit-image-post.svg' }>
							<input className='img-post-upload' type='file' onChange={handleUploadFeatured} />
							<button className='post-upload-button uk-button uk-button-secondary uk-border-rounded' type='button' tabIndex='-1'>
								<i className={`${uploadLimit ? 'ri-error-warning-line' : 'ri-upload-2-line'} ri-1x uk-margin-small-right`}></i>{uploadLimit ? 'Size must be under 1MB' : 'Upload image'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
