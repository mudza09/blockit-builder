import {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import bs from '../utils/bs';

export default function Navigation() {
	const location = useLocation().pathname;
	const [data, setData] = useState();

	// Get data from socket
	const socketServer = () => {
		bs.socket.emit('getServerInfo', 'empty');
		bs.socket.once('serverInfo', data => setData(data));
	};

	const [nav, setNav] = useState([
		{
			title: 'Dashboard',
			link: 'dashboard',
			icon: 'ri-home-2-line',
		},
		{
			title: 'Preview',
			link: 'http://localhost:3000',
			icon: 'fa-expand',
		},
		{
			title: '',
			link: '',
			icon: '',
			type: 'divider',
		},
		{
			title: 'Pages',
			link: 'pages',
			icon: 'ri-file-copy-line',
		},
		{
			title: 'Navigation',
			link: 'navigation',
			icon: 'ri-compass-3-line',
		},
		{
			title: 'Posts',
			link: 'posts',
			icon: 'ri-pen-nib-line',
		},
		{
			title: 'Components',
			link: 'components',
			icon: 'ri-plug-line',
		},
		{
			title: 'Settings',
			link: 'settings',
			icon: 'ri-settings-3-line',
		},
	]);

	useEffect(() => socketServer(), []);
	useEffect(() => {
		if (data !== undefined) {
			setNav(nav.map(item => {
				if (item.title === 'Preview') {
					return {
						title: 'Preview',
						link: `http://${window.location.hostname}:${data.port.frontend}`,
						icon: 'fa-expand',
					};
				}

				return item;
			}));
		}
	}, [data]);

	return (
		<ul className='uk-nav uk-nav-default uk-margin'>
			{
				nav.filter(each => each.icon !== undefined).map(item => <li {...(item.link === location.split('/')[1] && {className: 'uk-active'})} {...(item.type === 'divider' && {className: 'uk-nav-divider'})} key={item.title}> {item.link.includes('http') ? <a href={nav[1].link} target='_blank' rel='noreferrer'><i className='ri ri-fullscreen-line ri-1x'></i>{item.title}</a> : <Link to={item.link}>{item.icon === undefined ? '' : <i className={'ri ' + item.icon + ' ri-1x'}></i>}{item.title}</Link>}</li>)
			}
		</ul>
	);
}
