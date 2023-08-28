import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import bs from '../utils/bs';

export default function Dashboard() {
	const [data, setData] = useState({pages: 0, posts: 0, authors: 0});

	// Get data from socket
	const socketDashboard = () => {
		bs.socket.emit('getDashboardData', 'empty');
		bs.socket.once('dashboardData', data => setData(data));
	};

	useEffect(() => socketDashboard(), []);

	return (
		<div className='tm-main uk-section blockit-dashboard'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h3>Dashboard</h3>
					</div>
					<div className='uk-width-3-4'></div>
				</div>
				<div className='uk-child-width-1-3 uk-grid dashboard-gutter' data-uk-grid data-uk-height-match='target: > div > .uk-card'>
					<div className='uk-width-1-1'>
						<div className='uk-card uk-card-primary uk-card-body uk-border-rounded uk-background-cover uk-background-center-center' style={{backgroundImage: 'url("assets/img/blockit-dashboard.png")'}}>
							<div className='uk-grid' data-uk-grid>
								<div className='uk-width-2-3'>
									<h3 className='uk-margin-remove-bottom'>Hi, this is a Blockit</h3>
									<p className='uk-margin-remove-top uk-margin-bottom'>A static HTML builder from Indonez, which will help you create the website you dream of.</p>
									<div className='uk-flex uk-flex-middle'>
										<span className='uk-text-small uk-margin-remove-bottom'>{data.name} {data.version} running</span>
										<span className='uk-label uk-border-rounded uk-text-small uk-margin-remove-bottom uk-margin-small-left'>{data.theme} theme</span>
									</div>
								</div>
								<div className='uk-width-1-3 uk-text-center'>
									<span className='uk-text-small'>Overview</span>
									<div className='uk-child-width-1-3 uk-grid-divider uk-grid uk-margin-small-top' data-uk-grid>
										<div>
											<h3 className='uk-margin-remove-bottom'>{data.pages}</h3>
											<p className='uk-margin-remove-top'>Pages</p>
										</div>
										<div>
											<h3 className='uk-margin-remove-bottom'>{data.posts}</h3>
											<p className='uk-margin-remove-top'>Posts</p>
										</div>
										<div>
											<h3 className='uk-margin-remove-bottom'>{data.authors}</h3>
											<p className='uk-margin-remove-top'>Authors</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<div className='uk-flex uk-flex-middle'>
								<i className='ri-file-copy-line ri-lg uk-margin-small-right uk-text-primary'></i>
								<h4 className='uk-margin-remove uk-text-primary'>Create HTML pages</h4>
							</div>
							<p className='uk-margin-small-top'>Add an HTML page dynamically and easily. just named, drag and drop every sections do you like.</p>
							<Link to='/pages/add?asBlog=blog' className='uk-flex uk-flex-middle'>Create a new page<i className='ri-arrow-right-line ri-sm uk-margin-small-left'></i></Link>
						</div>
					</div>
					<div>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<div className='uk-flex uk-flex-middle'>
								<i className='ri-compass-3-line ri-lg uk-margin-small-right uk-text-primary'></i>
								<h4 className='uk-margin-remove uk-text-primary'>Customize navigation</h4>
							</div>
							<p className='uk-margin-small-top'>Create your website navigation, choose the name you like and then direct the link to the page.</p>
							<Link to='/navigation' className='uk-flex uk-flex-middle'>Go to navigation<i className='ri-arrow-right-line ri-sm uk-margin-small-left'></i></Link>
						</div>
					</div>
					<div>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<div className='uk-flex uk-flex-middle'>
								<i className='ri-pen-nib-line ri-lg uk-margin-small-right uk-text-primary'></i>
								<h4 className='uk-margin-remove uk-text-primary'>Start write post</h4>
							</div>
							<p className='uk-margin-small-top'>Starting to become a blog writer is as easy as typing whatever you like, let us create the code for you.</p>
							<Link to='/posts/add' className='uk-flex uk-flex-middle'>Create a new post<i className='ri-arrow-right-line ri-sm uk-margin-small-left'></i></Link>
						</div>
					</div>
					<div>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<div className='uk-flex uk-flex-middle'>
								<i className='ri-plug-line ri-lg uk-margin-small-right uk-text-primary'></i>
								<h4 className='uk-margin-remove uk-text-primary'>Adjust site components</h4>
							</div>
							<p className='uk-margin-small-top'>Set and customize the components used to match and complement the needs of the site you want.</p>
							<Link to='/components' className='uk-flex uk-flex-middle'>Go to components<i className='ri-arrow-right-line ri-sm uk-margin-small-left'></i></Link>
						</div>
					</div>
					<div>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<div className='uk-flex uk-flex-middle'>
								<i className='ri-settings-3-line ri-lg uk-margin-small-right uk-text-primary'></i>
								<h4 className='uk-margin-remove uk-text-primary'>Personalize your site</h4>
							</div>
							<p className='uk-margin-small-top'>Find more settings here, you can personalize the website according to your wishes easily &amp; quickly.</p>
							<Link to='/settings' className='uk-flex uk-flex-middle'>Go to settings<i className='ri-arrow-right-line ri-sm uk-margin-small-left'></i></Link>
						</div>
					</div>
					<div>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded uk-flex uk-flex-middle uk-light uk-text-center uk-background-cover uk-background-center-center' style={{backgroundImage: 'url("assets/img/blockit-promo.jpg")'}}>
							<div>
								<h4 className='uk-margin-bottom'>Check out our other products on Themeforest.</h4>
								<a href='https://1.envato.market/Indonez-portfolio' target='_blank' rel='noreferrer'><img src='assets/img/blockit-envato.svg' className='uk-margin-small-right' />Browse now!</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
