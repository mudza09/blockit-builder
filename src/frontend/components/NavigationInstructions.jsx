export default function NavigationInstructions() {
	return (
		<div className='uk-margin-medium-top'>
			<h4>Instructions</h4>
			<ul className='uk-list uk-list-disc uk-text-small'>
				<li>To add a new menu, fill the properties above and click &#34;Apply changes&#34;.</li>
				<li>To rearrange the order of the menu, grab the menu item and drag to new position.</li>
				<li>To create a child menu, click the &#34;Add child&#34; button in parent menu and fill the properties.</li>
				<li>Any menu item can be deleted by clicking on the &#34;Trash icon&#34; button.</li>
			</ul>
		</div>
	);
}
