import {useState, useEffect} from 'react';
import {useNavigatingAway} from '../hooks/useNavigatingAway';
import bs from '../utils/bs';
import UIkit from 'uikit';
import ButtonLoader from '../components/ButtonLoader';
import SettingsSiteinfo from '../components/SettingsSiteinfo';
import SettingsColors from '../components/SettingsColors';
import SettingsAuthors from '../components/SettingsAuthors';
import SettingsBlog from '../components/SettingsBlog';
import SettingsOptimization from '../components/SettingsOptimization';
import hbsTemplate from '../utils/hbsTemplate';
import '../assets/js/coloris';

export default function Settings() {
	const [data, setData] = useState({});
	const [postTag, setPostTag] = useState({});

	// Leave page prompt
	const [isDirty, setIsDirty] = useState(false);
	const [showPrompt, confirmleave, cancelLeave] = useNavigatingAway(isDirty);

	// Get data from socket
	const socketSettings = () => {
		bs.socket.emit('getSettingsData', 'empty');
		bs.socket.once('settingsData', data => setData(data));
	};

	// Handle save settings button
	const handleSaveSettings = () => {
		setIsDirty(false);
		bs.socket.emit('saveSettingsData', data, postTag);
	};

	// Handle author callback
	const handleAuthorCallback = (result, mode) => {
		if (mode === 'add') {
			const finalAuthor = data.authors;
			finalAuthor.push(result);
			setData({...data, authors: finalAuthor});
		}

		if (mode === 'delete') {
			setData({...data, authors: result});
		}
	};

	// Handle blog callback
	const handleBlogCallback = (result, mode) => {
		if (mode === 'add') {
			const newData = data.blog;
			const addCategory = newData.categories;

			addCategory.push(result);
			newData.categories = addCategory;

			setData({...data, blog: newData});
		}

		if (mode === 'delete') {
			const newData = data.blog;
			const deleteCategories = data.blog.categories.filter(each => each !== result);

			newData.categories = deleteCategories;

			setData({...data, blog: newData});
		}
	};

	useEffect(() => {
		socketSettings();
		setPostTag(hbsTemplate);
	}, []);
	useEffect(() => {
		if (showPrompt) {
			UIkit.modal.confirm('All changes will be lost. Do you really want to leave without saving?').then(() => {
				setIsDirty(false);
				confirmleave();
			}, () => cancelLeave());
		}
	}, [showPrompt]);

	return (
		<div className='tm-main uk-section blockit-settings'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h3 className='head-title'>Settings</h3>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'>
						<ButtonLoader
							idName='save-settings'
							cssClass='uk-button uk-button-primary uk-border-rounded'
							defaultMessage='Save settings'
							successMessage='Saved successfully'
							callbackAction={handleSaveSettings}
						/>
					</div>
				</div>

				<div className='uk-grid'>
					<div className='uk-width-1-5'>
						<ul className='uk-tab-left' data-uk-tab='connect: #component-tab-left; animation: uk-animation-fade'>
							<li><a href='#site-info'>Site info</a></li>
							<li><a href='#colors'>Colors</a></li>
							<li><a href='#authors'>Authors</a></li>
							<li><a href='#blog'>Blog</a></li>
							<li><a href='#blog'>Optimization</a></li>
						</ul>
					</div>
					<div className='uk-width-expand'>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<ul id='component-tab-left' className='uk-switcher'>
								<SettingsSiteinfo data={data.siteInfo} port={data.port} authorsSelect ={data.authors} dirtyCallback={setIsDirty} />
								<SettingsColors data={data.colors} dirtyCallback={setIsDirty} />
								<SettingsAuthors data={data.authors} port={data.port} callback={handleAuthorCallback} dirtyCallback={setIsDirty} />
								<SettingsBlog data={data.blog} callback={handleBlogCallback} dirtyCallback={setIsDirty} />
								<SettingsOptimization data={data.optimization} dirtyCallback={setIsDirty} />
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
