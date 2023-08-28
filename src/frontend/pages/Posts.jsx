import {useState, useEffect} from 'react';
import {useNavigate, createSearchParams} from 'react-router-dom';
import bs from '../utils/bs';
import {slicePage, calcPage, entryPage} from '../utils/tablePagination';
import UIkit from 'uikit';
import trimUtils from '../utils/trimUtils';
import postLink from '../utils/postLink';
import hbsTemplate from '../utils/hbsTemplate';
import Notification from '../components/Notification';

export default function Posts() {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [dataLength, setDataLength] = useState('');
	const [pagination, setPagination] = useState([]);
	const [paginationEntry, setPaginationEntry] = useState('');
	const [activePage, setActivePage] = useState(1);
	const [notif, setNotif] = useState({
		status: false,
		filename: '',
	});
	const [postTag, setPostTag] = useState({});

	// Table sort state
	const [sortCat, setSortCat] = useState(true);

	// Get data from socket
	const socketPosts = () => {
		bs.socket.emit('getPostsData', 'empty');
		bs.socket.once('postsData', data => {
			const sortDate = data.sort((a, b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`));
			setData(slicePage(sortDate, 1, 10));
			setDataLength(data.length);
			setPagination(calcPage(data, 10));
			setPaginationEntry(entryPage(data.length)[0]);
		});
	};

	// Handle add post
	const handleAddPost = () => {
		navigate('/posts/add');
	};

	// Handle edit post
	const handleEditPost = data => {
		navigate({
			pathname: '/posts/edit',
			search: `?${createSearchParams({
				title: data.title,
				date: data.date,
				time: data.time,
			})}`,
		});
	};

	// Handle delete post
	const handleDeletePost = e => {
		const titleName = e.target.closest('tr').querySelector('.page-name').innerText;
		const fileName = postLink(titleName);

		UIkit.modal.confirm(`"${titleName}" will be deleted, are you ok with that?`).then(async () => {
			bs.socket.emit('deletePostData', fileName, postTag);
			await new Promise(resolve => {
				bs.socket.once('deleteDone', () => {
					resolve(
						setData(data.filter(item => item.link !== `${fileName}.html`)),
						setNotif({
							status: true,
							filename: titleName,
						}),
						bs.socket.emit('getPostsData', 'empty'),
						bs.socket.once('postsData', data => {
							const sortDate = data.sort((a, b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`));
							setData(slicePage(sortDate, activePage, 10));
							setDataLength(data.length);
							setPagination(calcPage(data, 10));
							setPaginationEntry(entryPage(data.length)[activePage - 1]);
						}),
					);
				});
			});
		}, () => null);
	};

	// Set notif to false from notification component
	const handleNotifCallback = data => {
		setNotif({
			status: data,
			filename: '',
		});
	};

	// Handle pagination button
	const handlePagination = num => {
		if (sortCat) {
			bs.socket.emit('getPostsData', 'empty');
			bs.socket.once('postsData', data => {
				const sortDate = data.sort((a, b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`));
				setData(slicePage(sortDate, num, 10));
				setActivePage(num);
				setPaginationEntry(entryPage(data.length)[num - 1]);
			});
		} else {
			bs.socket.emit('getPostsData', 'empty');
			bs.socket.once('postsData', data => {
				const sortCategory = data.sort((a, b) => a.category.localeCompare(b.category));
				setData(slicePage(sortCategory, num, 10));
				setActivePage(num);
				setPaginationEntry(entryPage(data.length)[num - 1]);
			});
		}
	};

	// Handle sort posts category
	const handleSortCategory = () => {
		setSortCat(!sortCat);
		if (sortCat) {
			bs.socket.emit('getPostsData', 'empty');
			bs.socket.once('postsData', data => {
				const sortCategory = data.sort((a, b) => a.category.localeCompare(b.category));
				setData(slicePage(sortCategory, 1, 10));
				setDataLength(data.length);
				setPagination(calcPage(data, 10));
				setPaginationEntry(entryPage(data.length)[0]);
				setActivePage(1);
			});
		} else {
			bs.socket.emit('getPostsData', 'empty');
			bs.socket.once('postsData', data => {
				const sortDate = data.sort((a, b) => new Date(`${b.dateModified} ${b.timeModified}`) - new Date(`${a.dateModified} ${a.timeModified}`));
				setData(slicePage(sortDate, 1, 10));
				setDataLength(data.length);
				setPagination(calcPage(data, 10));
				setPaginationEntry(entryPage(data.length)[0]);
				setActivePage(1);
			});
		}
	};

	useEffect(() => {
		socketPosts();
		setPostTag(hbsTemplate);
	}, []);

	return (
		<div className='tm-main uk-section blockit-pages'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h3 className='head-title'>Posts</h3>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'>
						<Notification status={notif} callback={handleNotifCallback} message='has been successfully deleted' />
						<button id='add-page' className='uk-button uk-button-primary uk-border-rounded' onClick={handleAddPost}><i className='ri-add-circle-fill ri-1x uk-margin-small-right'></i>Add new post</button>
					</div>
				</div>

				<div className='uk-grid'>
					<div className='uk-width-1-1'>
						<table className='uk-table uk-table-divider uk-table-hover uk-table-middle uk-margin-small-bottom'>
							<thead>
								<tr>
									<th className='in-title-width'>Post title</th>
									<th className='in-modified-width'>Modified</th>
									<th className='uk-width-small'><span onClick={handleSortCategory}>Category<i className={sortCat ? 'ri-arrow-down-s-fill ri-1x uk-margin-small-left in-sort-icon' : 'ri-arrow-up-s-fill ri-1x uk-margin-small-left'}></i></span></th>
									<th className='uk-width-small'></th>
								</tr>
							</thead>
							<tbody>
								{
									data.map((item, index) => {
										const params = {
											title: item.title,
											date: item.dateCreated,
											time: item.timeCreated,
										};
										return (
											<tr key={index}>
												<td>
													<div className='post-title-column title-cursor' onClick={handleEditPost.bind(this, params)}>
														<span className='page-name'>{trimUtils(item.title)}</span>
														{
															item.hidden === true
																? <span className='uk-text-muted uk-flex uk-flex-middle'>Post hidden by {item.author.name}<i className='ri-eye-off-fill ri-sm uk-text-muted uk-margin-left'></i></span>
																: <span className='uk-text-muted uk-flex uk-flex-middle'>Post published by {item.author.name}</span>
														}
													</div>
												</td>
												<td><span className='uk-text-muted'>{item.dateModified} at {item.timeModified}</span></td>
												<td><span className='uk-label uk-label-warning uk-text-small uk-border-rounded'>{item.category}</span></td>
												<td>
													<div className='action-wrap uk-flex uk-flex-right'>
														<button className='btn-delete uk-button uk-button-text uk-button-small' onClick={handleDeletePost}><i className='ri-delete-bin-line ri-sm'></i>Delete</button>
													</div>
												</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
						<div className='uk-flex uk-flex-middle uk-flex-right uk-margin-bottom'>
							<span className='uk-text-small uk-text-muted uk-margin-right'>Showing {paginationEntry} of {dataLength} entries</span>
							<ul className='uk-pagination uk-margin-remove-vertical' data-uk-margin>
								{
									pagination.map((item, index) => (
										<li key={index} {...(item === activePage && {className: 'uk-active'})}><a onClick={handlePagination.bind(this, item)}>{item}</a></li>
									))
								}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
