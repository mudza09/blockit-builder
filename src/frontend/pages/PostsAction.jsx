
import {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate, createSearchParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useNavigatingAway} from '../hooks/useNavigatingAway';
import ShortUniqueId from 'short-unique-id';
import bs from '../utils/bs';
import UIkit from 'uikit';
import EditorJS from '../assets/js/editorjs/editorjs-disable-key-events';
import Header from '../assets/js/editorjs/header/bundle';
import ImageTool from '../assets/js/editorjs/image/bundle';
import List from '../assets/js/editorjs/list/bundle';
import Quote from '../assets/js/editorjs/quote/bundle';
import Table from '../assets/js/editorjs/table/bundle';
import YoutubeEmbed from '../assets/js/editorjs/youtube-embed/bundle';
import ButtonLoader from '../components/ButtonLoader';
import removeParam from '../utils/removeParam';
import postLink from '../utils/postLink';
import hbsTemplate from '../utils/hbsTemplate';
import PostsActionCategorySelect from '../components/PostsActionCategorySelect';
import PostsActionAuthorSelect from '../components/PostsActionAuthorSelect';
import PostsActionTagInput from '../components/PostsActionTagInput';
import PostsActionFeaturedImage from '../components/PostsActionFeaturedImage';
import PostsActionHidePost from '../components/PostsActionHidePost';
import PostsActionHideBio from '../components/PostsActionHideBio';
import PostsActionHideComments from '../components/PostsActionHideComments';

export default function PostsAction() {
	const navigate = useNavigate();
	let {mode} = useParams();
	const [data, setData] = useState({});
	const [previewUrl, setPreviewUrl] = useState(false);
	const params = new URLSearchParams(location.search);

	// Leave page prompt
	const [isDirty, setIsDirty] = useState(false);
	const [showPrompt, confirmleave, cancelLeave] = useNavigatingAway(isDirty);

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	// Button loader status
	const [buttonStatus, setButtonStatus] = useState(false);

	// Post form variables
	const titleInput = useRef(null);
	const sidebarForm = useRef(null);
	const savePostButton = useRef(null);
	const [failAuthor, setFailAuthor] = useState(false);
	const [layoutTag, setLayoutTag] = useState({});

	// Post form state
	const [titlePost, setTitlePost] = useState('');

	// Get data from socket
	const socketPostsAction = () => {
		bs.socket.emit('getPostsActionData', postLink(params.get('title') === null ? 'empty' : params.get('title')));
		bs.socket.once('postsActionData', data => {
			setData(data);
		});
	};

	// Handle editor post
	const handleEditorPost = postData => {
		if (mode === 'add') {
			handleEditorJs('', postData);
		} else if (mode === 'edit') {
			setTitlePost(postData.title);
			handleEditorJs(postData, postData);
		}
	};

	// Editor js init
	const handleEditorJs = (data, rawPostData) => {
		const authorsData = rawPostData.authors.select;
		const blogData = rawPostData.asBlog;
		const editor = new EditorJS({
			holder: document.querySelector('#editor-post'),
			minHeight: 60,
			placeholder: 'Then write your an awesome story!',
			data: handleImageLink(data),
			tools: {
				header: {
					class: Header,
					config: {
						placeholder: 'Header',
						levels: [1, 2, 3, 4, 5, 6],
					},
				},
				image: {
					class: ImageTool,
					config: {
						uploader: {
							async uploadByFile(buffer, nameFile) {
								let typeFile = '';
								switch (buffer.type) {
									case 'image/jpeg':
										typeFile = 'jpg';
										break;
									case 'image/png':
										typeFile = 'png';
										break;
									case 'image/gif':
										typeFile = 'gif';
										break;
									case 'image/svg+xml':
										typeFile = 'svg';
										break;
									case 'image/webp':
										typeFile = 'webp';
										break;
									// No default
								}

								nameFile = `image-post-${uid()}.${typeFile}`;
								bs.socket.emit('assetsUpload', buffer, nameFile);
								const imageUrl = await new Promise(resolve => {
									bs.socket.once('uploadDone', path => resolve(path));
								});

								return {
									success: 1,
									file: {url: `http://${window.location.hostname}:${data.port.frontend}/${imageUrl}`},
								};
							},
						},
					},
				},
				list: {
					class: List,
				},
				quote: {
					class: Quote,
					config: {
						quotePlaceholder: 'Enter a quote',
						captionPlaceholder: 'Quote\'s author',
					},
				},
				table: {
					class: Table,
				},
				youtubeEmbed: YoutubeEmbed,
			},
			logLevel: 'ERROR',
			// OnChange: () => setIsDirty(true),
		});

		editor.isReady
			.then(() => {
				const saveBtn = savePostButton.current;
				const oldTitle = [];

				saveBtn.onclick = () => {
					const form = sidebarForm.current;
					const titleName = titleInput.current;
					const authorName = form.querySelector('#post-author');
					const categoryPost = form.querySelector('#post-category');
					const tagsPost = form.querySelector('#post-tags');
					const featuredImg = form.querySelector('.post-image').querySelector('img');
					const hideBio = form.querySelector('#hide-bio');
					const hideComment = form.querySelector('#hide-comment');
					const hidePost = form.querySelector('#hide-post');

					editor.save().then(dataPost => {
						if (handleValidateForm(titleName, authorName, dataPost)) {
							const nameFile = postLink(titleName.textContent);
							const currentAuthor = authorsData.filter(each => each.id === authorName.querySelector('option:checked').getAttribute('data-id'));
							const postData = {
								title: titleName.textContent,
								link: `${postLink(titleName.textContent)}.html`,
								author: {
									id: currentAuthor[0].id,
									name: currentAuthor[0].name,
									avatar: avatarSrc(authorsData, authorName),
									bio: currentAuthor[0].bio,
									socialMedia: currentAuthor[0].socialMedia,
								},
								category: categoryPost.value === '0' ? 'Uncategorized' : categoryPost.value,
								tags: tagsPost.value.length === 0 ? ['untagged'] : tagsPost.value.replace(/\s/g, '').split(','),
								image: featuredSrc(featuredImg),
								biography: Boolean(!hideBio.checked),
								comments: Boolean(!hideComment.checked),
								hidden: Boolean(hidePost.checked),
							};

							oldTitle.push(nameFile);

							// Asign data from editor to post object
							Object.assign(postData, dataPost);

							// Delete unused property
							delete postData.version;
							delete postData.time;

							// Set button loader status
							setButtonStatus(true);

							// Date or time variables
							const date = new Date();
							const dateObj = {
								year: new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date),
								month: new Intl.DateTimeFormat('en', {month: 'long'}).format(date),
								day: new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date),
								time: new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', hourCycle: 'h12'}).format(date),
							};

							// If add mode, navigate to edit mode after save it
							if (mode === 'add') {
								postData.dateCreated = `${dateObj.month} ${dateObj.day}, ${dateObj.year}`;
								postData.dateModified = postData.dateCreated;
								postData.timeCreated = `${dateObj.time}`;
								postData.timeModified = postData.timeCreated;

								setTimeout(() => {
									mode = 'edit';
									navigate({
										pathname: '/posts/edit',
										search: `?${createSearchParams({
											title: postData.title,
											date: postData.dateCreated,
											time: postData.timeCreated,
										})}`,
									});
									sessionStorage.setItem('dateCreated', postData.dateCreated);
									sessionStorage.setItem('timeCreated', postData.timeCreated);
								}, 2000);
							} else if (mode === 'edit') {
								const oldName = params.get('title') === null ? oldTitle[0] : postLink(params.get('title'));
								postData.dateCreated = data.dateCreated === undefined ? sessionStorage.getItem('dateCreated') : data.dateCreated;
								postData.dateModified = `${dateObj.month} ${dateObj.day}, ${dateObj.year}`;
								postData.timeCreated = data.timeCreated === undefined ? sessionStorage.getItem('timeCreated') : data.timeCreated;
								postData.timeModified = `${dateObj.time}`;

								setTimeout(() => {
									navigate({
										pathname: '/posts/edit',
										search: `?${createSearchParams({
											title: postData.title,
											date: postData.dateCreated,
											time: postData.timeCreated,
										})}`,
									});
								}, 2000);

								oldTitle.shift();

								// Rename title condition
								if (oldName !== nameFile) {
									bs.socket.emit('deletePostData', oldName, layoutTag);
								}
							}

							// Sanitize image post url
							postData.blocks.filter(each => each.type === 'image').forEach(each => {
								const imageUrl = each.data.file.url;
								if (imageUrl.includes('localhost')) {
									each.data.file.url = imageUrl.slice(22);
								}
							});

							// Clear dirty status
							setIsDirty(false);

							// Send post content data
							bs.socket.emit('savePostContent', nameFile, postData, layoutTag);

							// Show preview url
							setTimeout(() => {
								if (blogData !== false) {
									setPreviewUrl(true);
								}

								if (postData.hidden) {
									setPreviewUrl(false);
								}
							}, 2500);
						}
					});
				};
			});
	};

	// Create temp link for image post editorjs
	const handleImageLink = data => {
		if (data !== '') {
			data.blocks.filter(each => each.type === 'image').forEach(each => {
				each.data.file.url = `http://${window.location.hostname}:${data.port.frontend}/${each.data.file.url}`;
			});
		}

		return data;
	};

	// Validate input form
	const handleValidateForm = (title, author, post) => {
		let status = true;
		if (title.textContent.length === 0) {
			title.classList.add('uk-animation-shake');
			setTimeout(() => title.classList.remove('uk-animation-shake'), 500);
			status = false;
		} else if (author.value === '0') {
			setFailAuthor(true);
			status = false;
		} else if (post.blocks.length === 0) {
			document.querySelector('.ce-paragraph').classList.add('uk-animation-shake');
			setTimeout(() => document.querySelector('.ce-paragraph').classList.remove('uk-animation-shake'), 500);
			status = false;
		}

		return status;
	};

	// Find avatar image src in post
	const avatarSrc = (authorsData, authorsName) => {
		let avatar = '';
		authorsData.forEach(e => {
			if (e.name === authorsName.value) {
				avatar = e.avatar;
			}
		});
		return avatar;
	};

	// Find featured image src in post
	const featuredSrc = element => {
		let value = '';
		if (element.getAttribute('src') === '../assets/img/blockit-image-post.svg') {
			value = false;
		} else {
			value = element.getAttribute('src').includes('../') ? String(element.getAttribute('src').substr(3)) : String(element.getAttribute('src').replace(`http://${window.location.hostname}:${data.port.frontend}/`, ''));
			value = removeParam('browsersync', value);
		}

		return value;
	};

	useEffect(() => {
		socketPostsAction();
		setLayoutTag(hbsTemplate);
	}, []);
	useEffect(() => {
		if (Object.keys(data).length !== 0) {
			handleEditorPost(data);
			if (data.asBlog !== false && params.get('title') !== null) {
				setPreviewUrl(true);
			}

			if (data.hidden) {
				setPreviewUrl(false);
			}
		}
	}, [data]);
	useEffect(() => {
		if (showPrompt) {
			UIkit.modal.confirm('All changes will be lost. Do you really want to leave without saving?').then(() => {
				setIsDirty(false);
				confirmleave();
			}, () => cancelLeave());
		}
	}, [showPrompt]);

	return (
		<div className='tm-main uk-section blockit-pages blockit-posts-action'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h5 className='head-title'>
							<Link to='/posts' className='uk-link-heading'>
								<i className='ri-arrow-left-line ri-sm uk-margin-small-right'></i>Posts
							</Link>
						</h5>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'>
						{previewUrl && <a href={`http://${window.location.hostname}:${data.port.frontend}/${data.asBlog}/${postLink(params.get('title'))}.html`} target='_blank' rel='noreferrer'><code className='uk-flex uk-flex-middle'><i className='ri ri-link ri-sm uk-margin-small-right'></i>{`http://${window.location.hostname}:${data.port.frontend}/${data.asBlog}/${postLink(params.get('title'))}.html`}</code></a>}
					</div>
				</div>
				<div className='uk-grid uk-margin-top'>
					<div className='uk-width-2-3'>
						<div className='post-wrap'>
							<form id='page-form' className='uk-grid-small' data-uk-grid>
								<div className='uk-width-1-1 uk-margin-remove-bottom'>
									<h2 className='post-title' placeholder='Add post title...' contentEditable='true' ref={titleInput} onInput={() => setIsDirty(true)}>{titlePost}</h2>
								</div>
								<div className='uk-width-1-1 uk-margin-remove-top'>
									<div id='editor-post'></div>
								</div>
							</form>
						</div>
					</div>
					<div className='uk-width-expand'>
						<div className='section-post-settings'>
							<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
								<ButtonLoader
									idName='save-post'
									cssClass='uk-button uk-button-primary uk-border-rounded uk-width-1-1 uk-margin-bottom'
									defaultMessage='Save post'
									successMessage='Saved successfully'
									refElement={savePostButton}
									loadingStatus={buttonStatus}
								/>
								<form id='page-form' className='uk-grid-small uk-margin-small-top' ref={sidebarForm} data-uk-grid>
									<PostsActionFeaturedImage data={data.currentImage} port={data.port} dirtyCallback={setIsDirty} />
									<PostsActionHideBio data={data.biography} dirtyCallback={setIsDirty} />
									<PostsActionHideComments data={data.comments} dirtyCallback={setIsDirty} />
									<PostsActionAuthorSelect data={data.authors} status={failAuthor} callback={setFailAuthor} dirtyCallback={setIsDirty} />
									<PostsActionCategorySelect data={data.categories} dirtyCallback={setIsDirty} />
									<PostsActionTagInput data={data.currentTags} mode={mode} dirtyCallback={setIsDirty} />
									<PostsActionHidePost data={data.hidden} dirtyCallback={setIsDirty} />
								</form>
								{mode === 'edit' && <p className='uk-text-small uk-text-muted uk-margin-top'><strong>Published :</strong> {params.get('date')} at {params.get('time')}</p>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
