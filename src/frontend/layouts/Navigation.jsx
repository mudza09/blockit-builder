import {Link, useLocation} from 'react-router-dom';

export default function Navigation() {
	const location = useLocation().pathname;
	const nav = [
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
	];

	return (
		<ul className='uk-nav uk-nav-default uk-margin'>
			{
				nav.filter(each => each.icon !== undefined).map(item => <li {...(item.link === location.split('/')[1] && {className: 'uk-active'})} {...(item.type === 'divider' && {className: 'uk-nav-divider'})} key={item.title}> {item.link.includes('http') ? <a href={'http://localhost:3000'} target='_blank' rel='noreferrer'><i className='ri ri-fullscreen-line ri-1x'></i>{item.title}</a> : <Link to={item.link}>{item.icon === undefined ? '' : <i className={'ri ' + item.icon + ' ri-1x'}></i>}{item.title}</Link>}</li>)
			}
		</ul>
	);
}
