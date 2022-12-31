import Logo from './Logo';
import Navigation from './Navigation';

export default function Sidebar() {
	return (
		<div className='tm-sidebar-left uk-background-muted'>
			<Logo />
			<Navigation />
		</div>
	);
}
