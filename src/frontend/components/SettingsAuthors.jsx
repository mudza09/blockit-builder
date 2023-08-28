import {useState, useEffect, useRef} from 'react';
import ShortUniqueId from 'short-unique-id';
import PropTypes from 'prop-types';
import uploadImage from '../utils/uploadImage';
import removeParam from '../utils/removeParam';

SettingsAuthors.propTypes = {
	callback: PropTypes.func,
	data: PropTypes.array,
	dirtyCallback: PropTypes.bool,
};

export default function SettingsAuthors(props) {
	const authorsForm = useRef(null);
	const [uploadLimit, setUploadLimit] = useState(false);
	const {callback, data, dirtyCallback} = props;

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	// Upload image author state
	const [imageAuthor, setImageAuthor] = useState(['http://localhost:3000/img/blockit/in-avatar.svg']);

	// Handle footer form
	const handleAuthorsForm = () => {
		const form = authorsForm.current;

		data.forEach((each, index) => {
			const avatar = form.querySelectorAll('img[alt="profile-picture"]')[index].getAttribute('src').replace('http://localhost:3000/', '');

			each.avatar = removeParam('browsersync', avatar);
			each.name = form.querySelectorAll('.setting-author-name')[index].value;
			each.email = form.querySelectorAll('.setting-author-email')[index].value;
			each.bio = form.querySelectorAll('.setting-author-bio')[index].value;
			each.socialMedia = [
				{facebook: form.querySelectorAll('.setting-author-social-facebook')[index].value === '' ? false : form.querySelectorAll('.setting-author-social-facebook')[index].value},
				{twitter: form.querySelectorAll('.setting-author-social-twitter')[index].value === '' ? false : form.querySelectorAll('.setting-author-social-twitter')[index].value},
				{instagram: form.querySelectorAll('.setting-author-social-instagram')[index].value === '' ? false : form.querySelectorAll('.setting-author-social-instagram')[index].value},
				{linkedin: form.querySelectorAll('.setting-author-social-linkedin')[index].value === '' ? false : form.querySelectorAll('.setting-author-social-linkedin')[index].value},
				{website: form.querySelectorAll('.setting-author-social-website')[index].value === '' ? false : form.querySelectorAll('.setting-author-social-website')[index].value},
			];
		});
	};

	// Handle upload author image
	const handleUploadAuthor = (e, index) => {
		uploadImage({
			position: index,
			inputEvent: e.target,
			selector: 'setting-profile',
			fileName: 'author',
			useButton: false,
			path: updateAvatar,
			sizeLimit: setUploadLimit,
		});
		dirtyCallback(true);
		setTimeout(() => {
			handleAuthorsForm();
		}, 500);
	};

	// Handle update avatar after upload
	const updateAvatar = (path, index) => {
		const updateAvatar = [...imageAuthor];
		updateAvatar[index] = path;
		setImageAuthor(updateAvatar);
	};

	// Handle add author
	const handleAddAuthor = e => {
		e.preventDefault();
		dirtyCallback(true);

		const newAuthor = {
			id: uid(),
			name: '',
			email: '',
			bio: '',
			avatar: 'img/blockit/in-avatar.svg',
			socialMedia: [
				{facebook: false},
				{twitter: false},
				{instagram: false},
				{linkedin: false},
				{website: false},
			],
		};
		callback(newAuthor, 'add');
		getAuthorImage(data);
	};

	// Handle delete author
	const handleDeleteAuthor = (e, name, index) => {
		e.preventDefault();
		dirtyCallback(true);

		const resultData = data.filter(each => each !== data[index]);
		callback(resultData, 'delete');
	};

	// Set image author state
	const getAuthorImage = data => {
		setImageAuthor(data.map(each => `http://localhost:3000/${each.avatar}`));
	};

	useEffect(() => {
		if (data !== undefined) {
			getAuthorImage(data);
		}
	}, [data]);

	return (
		<li className='authors'>
			<h4 className='uk-heading-line'><span>Authors</span></h4>
			<form className='authors-form-wrap uk-margin-medium' onChange={handleAuthorsForm} ref={authorsForm}>
				{data !== undefined
					&& data.map((each, index) => (
						<div key={index} className='uk-form-stacked uk-grid-small uk-margin uk-grid' data-uk-grid>
							<div className='author-pic-width uk-form-custom uk-text-center' data-uk-form-custom>
								<div className='uk-inline-clip uk-transition-toggle setting-profile'>
									<img src={imageAuthor[index]} alt='profile-picture' />
									<div className='uk-transition-fade uk-position-cover uk-flex uk-flex-center uk-flex-middle'>
										<input className='img-author-upload' type='file' onChange={e => handleUploadAuthor(e, index)}/>
										<button className={`uk-button ${uploadLimit ? 'ri-error-warning-fill' : 'ri-camera-fill'} ri-1x uk-label uk-border-pill`} type='button'></button>
									</div>
								</div>
								<span className='uk-label uk-label-warning uk-text-small uk-border-rounded uk-margin-small-top'>id: {each.id}</span>
							</div>
							<div className='uk-width-2-3'>
								<div className='uk-grid-small' data-uk-grid>
									<div className='uk-width-1-2'>
										<div className='uk-form-controls'>
											<input className='uk-input uk-border-rounded setting-author-name' placeholder='Enter your name' type='text' defaultValue={each.name} onChange={() => dirtyCallback(true)} />
										</div>
									</div>
									<div className='uk-width-1-2'>
										<div className='uk-form-controls'>
											<input className='uk-input uk-border-rounded setting-author-email' placeholder='Enter your email' type='text' defaultValue={each.email} onChange={() => dirtyCallback(true)} />
										</div>
									</div>
									<div className='uk-width-1-1'>
										<textarea className='uk-textarea uk-border-rounded setting-author-bio' rows='3' placeholder='Enter your personal biography' onChange={() => dirtyCallback(true)}>{each.bio}</textarea>
									</div>
									<ul className='uk-width-1-1 uk-list author-social-media' data-uk-accordion>
										<li>
											<a className='uk-accordion-title uk-text-decoration-none uk-text-muted' href='#'>Social media<i className='ri-arrow-down-s-line ri-sm'></i></a>
											<div className='uk-accordion-content uk-form-horizontal uk-margin-small-top'>
												<div className='uk-margin'>
													<label className='uk-form-label'><i className='ri-facebook-circle-line ri-lg uk-margin-small-right'></i>Facebook</label>
													<div className='uk-form-controls'>
														<input className='uk-input uk-border-rounded setting-author-social-facebook' type='text' defaultValue={each.socialMedia[0].facebook === false ? '' : each.socialMedia[0].facebook} onChange={() => dirtyCallback(true)} />
													</div>
												</div>
												<div className='uk-margin'>
													<label className='uk-form-label'><i className='ri-twitter-line ri-lg uk-margin-small-right'></i>Twitter</label>
													<div className='uk-form-controls'>
														<input className='uk-input uk-border-rounded setting-author-social-twitter' type='text' defaultValue={each.socialMedia[1].twitter === false ? '' : each.socialMedia[1].twitter} onChange={() => dirtyCallback(true)} />
													</div>
												</div>
												<div className='uk-margin'>
													<label className='uk-form-label'><i className='ri-instagram-line ri-lg uk-margin-small-right'></i>Instagram</label>
													<div className='uk-form-controls'>
														<input className='uk-input uk-border-rounded setting-author-social-instagram' type='text' defaultValue={each.socialMedia[2].instagram === false ? '' : each.socialMedia[2].instagram} onChange={() => dirtyCallback(true)} />
													</div>
												</div>
												<div className='uk-margin'>
													<label className='uk-form-label'><i className='ri-linkedin-box-line ri-lg uk-margin-small-right'></i>Linkedin</label>
													<div className='uk-form-controls'>
														<input className='uk-input uk-border-rounded setting-author-social-linkedin' type='text' defaultValue={each.socialMedia[3].linkedin === false ? '' : each.socialMedia[3].linkedin} onChange={() => dirtyCallback(true)} />
													</div>
												</div>
												<div className='uk-margin'>
													<label className='uk-form-label'><i className='ri-global-line ri-lg uk-margin-small-right'></i>Website</label>
													<div className='uk-form-controls'>
														<input className='uk-input uk-border-rounded setting-author-social-website' type='text' defaultValue={each.socialMedia[4].website === false ? '' : each.socialMedia[4].website} onChange={() => dirtyCallback(true)} />
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
							<div className='uk-width-expand uk-flex uk-flex-top'>
								<button className='uk-button uk-button-default uk-border-rounded delete-author-btn uk-width-1-1' onClick={e => handleDeleteAuthor(e, each.name, index)}>
									<i className='ri-delete-bin-line ri-sm uk-margin-small-right'></i>Delete author
								</button>
							</div>
						</div>
					))
				}
			</form>
			<hr />
			<div className='uk-width-1-1 uk-flex uk-flex-right uk-margin-small-bottom'>
				<button id='add-author' className='uk-button uk-button-secondary uk-border-rounded' onClick={handleAddAuthor}>
					<i className='ri-add-circle-fill ri-sm uk-margin-small-right'></i>Add new author
				</button>
			</div>
		</li>
	);
}
