import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

SettingsBlog.propTypes = {
	callback: PropTypes.func,
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function SettingsBlog(props) {
	const [inputData, setInputData] = useState({});
	const blogForm = useRef(null);
	const authorRadio = useRef(null);
	const tagRadio = useRef(null);
	const shareRadio = useRef(null);
	const searchCheck = useRef(null);
	const categoriesCheck = useRef(null);
	const latestCheck = useRef(null);
	const tagCheck = useRef(null);
	const {callback, data, dirtyCallback} = props;

	// Display radio
	const displayRadio = condition => {
		const form = blogForm.current;
		if (condition.displayAuthor) {
			form.querySelector('#display-author-enable').checked = true;
		} else {
			form.querySelector('#display-author-disable').checked = true;
		}

		if (condition.displayTag) {
			form.querySelector('#display-tag-enable').checked = true;
		} else {
			form.querySelector('#display-tag-disable').checked = true;
		}

		if (condition.displayShareButtons) {
			form.querySelector('#display-share-enable').checked = true;
		} else {
			form.querySelector('#display-share-disable').checked = true;
		}
	};

	// Show widget check
	const showWidgetCheck = condition => {
		const form = blogForm.current;
		if (condition.search) {
			form.querySelector('#setting-widget-search').checked = true;
		}

		if (condition.categories) {
			form.querySelector('#setting-widget-categories').checked = true;
		}

		if (condition.latestPosts) {
			form.querySelector('#setting-widget-latest').checked = true;
		}

		if (condition.tags) {
			form.querySelector('#setting-widget-tags').checked = true;
		}
	};

	// Handle blog form
	const handleBlogForm = () => {
		const authorRadioEnable = authorRadio.current.checked;
		const tagRadioEnable = tagRadio.current.checked;
		const shareRadioEnable = shareRadio.current.checked;
		const searchCheckEnable = searchCheck.current.checked;
		const categoriesCheckEnable = categoriesCheck.current.checked;
		const latestCheckEnable = latestCheck.current.checked;
		const tagCheckEnable = tagCheck.current.checked;

		data.showWidgets.search = Boolean(searchCheckEnable);
		data.showWidgets.categories = Boolean(categoriesCheckEnable);
		data.showWidgets.latestPosts = Boolean(latestCheckEnable);
		data.showWidgets.tags = Boolean(tagCheckEnable);
		data.showWidgets.allHide = Boolean(searchCheckEnable === false && categoriesCheckEnable === false && latestCheckEnable === false);
		data.displayAuthor = Boolean(authorRadioEnable);
		data.displayTag = Boolean(tagRadioEnable);
		data.displayShareButtons = Boolean(shareRadioEnable);
	};

	// Handle postPerPage and disqussShortname input
	const handleInputData = e => {
		const {name, value} = e.target;
		data.disqussShortname = e.target.name === 'disqussShortname' ? e.target.value : inputData.disqussShortname;
		data.postPerPage = e.target.name === 'postPerPage' ? e.target.value : inputData.postPerPage;

		dirtyCallback(true);
		setInputData(prev => ({...prev, [name]: value}));
	};

	// Handle add category
	const handleAddCategory = e => {
		e.preventDefault();

		const form = blogForm.current;
		const newCategory = form.querySelector('#setting-category-input').value;
		callback(newCategory, 'add');
		form.querySelector('#setting-category-input').value = '';
	};

	// Handle delete category
	const handleDeleteCategory = (e, index) => {
		e.preventDefault();
		dirtyCallback(true);

		const deleteCategory = data.categories[index];
		callback(deleteCategory, 'delete');
	};

	useEffect(() => {
		if (data !== undefined) {
			setInputData({postPerPage: data.postPerPage, disqussShortname: data.disqussShortname});
			displayRadio(data);
			showWidgetCheck(data.showWidgets);
		}
	}, [data]);

	return (
		<li className='blog'>
			<h4 className='uk-heading-line'><span>Blog</span></h4>
			<form className='uk-form-horizontal uk-margin-medium' onChange={handleBlogForm} ref={blogForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-posts-per-page'>Categories</label>
					<div className='uk-form-stacked uk-grid-small uk-grid' data-uk-grid>
						<div className='uk-width-expand'>
							<input
								className='uk-input uk-border-rounded'
								id='setting-category-input'
								type='text'
								placeholder='Add new category...'
								onChange={() => dirtyCallback(true)}
							/>
						</div>
						<div className='uk-width-auto'>
							<button id='setting-category-btn' className='uk-button uk-button-secondary uk-border-rounded uk-width-1-1' onClick={handleAddCategory}>
								<i className='ri-add-circle-fill ri-1x uk-margin-small-right'></i>Add
							</button>
						</div>
						<div id='setting-category-list' className='uk-width-1-1'>
							{data !== undefined
								&& data.categories.map((each, index) => (
									<span key={index} className='uk-label uk-border-pill setting-label-category'>
										{each}
										<button className='delete-category uk-button uk-button-text ri-close-line ri-sm' onClick={e => handleDeleteCategory(e, index)}></button>
									</span>
								))
							}
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='postPerPage'>Posts per page</label>
					<div className='uk-form-controls'>
						<input
							className='uk-input uk-border-rounded setting-number-dimension'
							name='postPerPage'
							type='number'
							value={inputData.postPerPage}
							onChange={handleInputData}
						/>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-show-widgets'>Show widgets</label>
					<div className='uk-form-controls uk-form-controls-text'>
						<label className='small-label uk-margin-medium-right'>
							<input
								className='uk-checkbox'
								type='checkbox'
								id='setting-widget-search'
								ref={searchCheck}
								onChange={() => dirtyCallback(true)}
							/> Search
						</label>
						<label className='small-label uk-margin-medium-right'>
							<input
								className='uk-checkbox'
								type='checkbox'
								id='setting-widget-categories'
								ref={categoriesCheck}
								onChange={() => dirtyCallback(true)}
							/> Categories
						</label>
						<label className='small-label uk-margin-medium-right'>
							<input
								className='uk-checkbox'
								type='checkbox'
								id='setting-widget-latest'
								ref={latestCheck}
								onChange={() => dirtyCallback(true)}
							/> Latest posts
						</label>
						<label className='small-label'>
							<input
								className='uk-checkbox'
								type='checkbox'
								id='setting-widget-tags'
								ref={tagCheck}
								onChange={() => dirtyCallback(true)}
							/> Tags
						</label>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-display-author'>Display author</label>
					<div className='uk-form-controls uk-form-controls-text'>
						<label className='small-label uk-margin-right'>
							<input
								id='display-author-enable'
								className='uk-radio'
								type='radio'
								value='enable'
								name='setting-display-author'
								ref={authorRadio}
								onChange={() => dirtyCallback(true)}
							/> Enable
						</label>
						<label className='small-label'>
							<input
								id='display-author-disable'
								className='uk-radio'
								type='radio'
								value='disable'
								name='setting-display-author'
								onChange={() => dirtyCallback(true)}
							/> Disable
						</label>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-display-tags'>Display tags</label>
					<div className='uk-form-controls uk-form-controls-text'>
						<label className='small-label uk-margin-right'>
							<input
								id='display-tag-enable'
								className='uk-radio'
								type='radio'
								value='enable'
								name='setting-display-tags'
								ref={tagRadio}
								onChange={() => dirtyCallback(true)}
							/> Enable
						</label>
						<label className='small-label'>
							<input
								id='display-tag-disable'
								className='uk-radio'
								type='radio'
								value='disable'
								name='setting-display-tags'
								onChange={() => dirtyCallback(true)}
							/> Disable
						</label>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-display-share'>Display share buttons</label>
					<div className='uk-form-controls uk-form-controls-text'>
						<label className='small-label uk-margin-right'>
							<input
								id='display-share-enable'
								className='uk-radio'
								type='radio'
								value='enable'
								name='setting-display-share'
								ref={shareRadio}
								onChange={() => dirtyCallback(true)}
							/> Enable
						</label>
						<label className='small-label'>
							<input
								id='display-share-disable'
								className='uk-radio'
								type='radio'
								value='disable'
								name='setting-display-share'
								onChange={() => dirtyCallback(true)}
							/> Disable
						</label>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='disqussShortname'>Disquss shortname <i className='ri-information-fill ri-xs' data-uk-tooltip='title: Used for comments on blog post; pos: right'></i></label>
					<div className='uk-form-controls'>
						<input
							className='uk-input uk-border-rounded'
							name='disqussShortname'
							type='text'
							value={inputData.disqussShortname}
							onChange={handleInputData}
						/>
					</div>
				</div>
			</form>
		</li>
	);
}
