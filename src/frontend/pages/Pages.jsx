import {useState, useEffect} from 'react';
import {useNavigate, createSearchParams} from 'react-router-dom';
import bs from '../utils/bs';
import {slicePage, calcPage, entryPage} from '../utils/tablePagination';
import UIkit from 'uikit';
import Notification from '../components/Notification';

export default function Pages() {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [dataLength, setDataLength] = useState('');
	const [pagination, setPagination] = useState([]);
	const [paginationEntry, setPaginationEntry] = useState('');
	const [activePage, setActivePage] = useState(1);
	const [currentBlog, setCurrentBlog] = useState([]);
	const [notif, setNotif] = useState({
		status: false,
		filename: '',
	});

	// Get data from socket
	const socketPages = () => {
		bs.socket.emit('getPagesData', 'empty');
		bs.socket.once('pagesCurrentBlog', data => setCurrentBlog(data));
		bs.socket.once('pagesData', data => {
			setData(slicePage(data, 1, 10));
			setDataLength(data.length);
			setPagination(calcPage(data, 10));
			setPaginationEntry(entryPage(data.length)[0]);
		});
	};

	// Handle add page
	const handleAddPage = () => {
		navigate({
			pathname: '/pages/add',
			search: `?${createSearchParams({
				asBlog: currentBlog,
			})}`,
		});
	};

	// Handle edit page
	const handleEditPage = data => {
		if (data.sections[0].includes('section-blog')) {
			navigate({
				pathname: '/pages/edit',
				search: `?${createSearchParams({
					page: data.page,
					title: data.title,
					layout: data.layout,
					breadcrumb: data.breadcrumb,
					asBlog: currentBlog,
					sections: [data.sections[0]],
				})}`,
			});
		} else {
			navigate({
				pathname: '/pages/edit',
				search: `?${createSearchParams({
					page: data.page,
					title: data.title,
					layout: data.layout,
					breadcrumb: data.breadcrumb,
					asBlog: currentBlog,
					sections: [data.sections],
				})}`,
			});
		}
	};

	// Handle delete page
	const handleDeletePage = (params, e) => {
		const fileName = e.target.closest('tr').querySelector('.page-name').innerText;

		UIkit.modal.confirm(`"${fileName}" page will be deleted, are you ok with that?`).then(() => {
			bs.socket.emit('deletePageData', fileName, params.sections);
			bs.socket.emit('getPagesData', 'empty');

			setData(data.filter(item => item.page !== fileName));
			setNotif({
				status: true,
				filename: fileName,
			});

			bs.socket.once('pagesCurrentBlog', data => setCurrentBlog(data));
			bs.socket.once('pagesData', data => {
				setData(slicePage(data, activePage, 10));
				setDataLength(data.length);
				setPagination(calcPage(data, 10));
				setPaginationEntry(entryPage(data.length)[activePage - 1]);
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
		bs.socket.emit('getPagesData', 'empty');
		bs.socket.once('pagesData', data => {
			setData(slicePage(data, num, 10));
			setActivePage(num);
			setPaginationEntry(entryPage(data.length)[num - 1]);
		});
	};

	useEffect(() => socketPages(), []);

	return (
		<div className='tm-main uk-section blockit-pages'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h3 className='head-title'>Pages</h3>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'>
						<Notification status={notif} callback={handleNotifCallback} message='has been successfully deleted' />
						<button id='add-page' className='uk-button uk-button-primary uk-border-rounded' onClick={handleAddPage}><i className='ri-add-circle-fill ri-1x uk-margin-small-right'></i>Add new page</button>
					</div>
				</div>

				<div className='uk-grid'>
					<div className='uk-width-1-1'>
						<table className='uk-table uk-table-divider uk-table-hover uk-table-middle uk-margin-small-bottom'>
							<thead>
								<tr>
									<th className='in-title-width'>Page name</th>
									<th className='in-modified-width'>Modified</th>
									<th className='uk-width-small'>Layout type</th>
									<th className='uk-width-small'></th>
								</tr>
							</thead>
							<tbody>
								{
									data.map((item, index) => {
										const date = new Date(item.date);
										const dateObj = {
											year: new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date),
											month: new Intl.DateTimeFormat('en', {month: 'long'}).format(date),
											day: new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date),
											time: new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', hourCycle: 'h12'}).format(date),
										};
										const params = {
											page: item.page,
											title: item.title,
											layout: item.layout,
											breadcrumb: item.breadcrumb,
											sections: item.sections,
										};
										return (
											<tr key={index}>
												<td>
													<div className='title-cursor uk-flex uk-flex-middle' onClick={handleEditPage.bind(this, params)}>
														<div className='page-icon'>
															<i className='ri-layout-2-fill ri-1x'></i>
														</div>
														<div className='uk-margin-small-left'>
															<span className='page-name'>{item.page}</span>
														</div>
													</div>
												</td>
												<td><span className='uk-text-muted'>{dateObj.month} {dateObj.day}, {dateObj.year} at {dateObj.time}</span></td>
												<td><span className='uk-label uk-label-warning uk-text-small uk-border-rounded'>{item.layout}</span></td>
												<td>
													<div className='action-wrap uk-flex uk-flex-right'>
														<button className='btn-delete uk-button uk-button-text uk-button-small' onClick={handleDeletePage.bind(this, params)}><i className='ri-delete-bin-line ri-sm'></i>Delete</button>
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
										<li {...(item === activePage && {className: 'uk-active'})} key={index}><a onClick={handlePagination.bind(this, item)}>{item}</a></li>
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
