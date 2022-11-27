import React from 'react'

export default function NavigationInstructions() {
    return (
        <React.Fragment>
            <div className="uk-margin-medium-top">
                <h4>Instructions</h4>
                <ul className="uk-list uk-list-disc uk-text-small">
                    <li>To add a new menu click "Add menu item", fill the properties and click 'Apply changes'.</li>
                    <li>To rearrange the order of the menu, grab the menu item and drag to new position.</li>
                    <li>To create a child menu, click the "Add child" button in parent menu and fill the properties.</li>
                    <li>Any menu item can be deleted by clicking on the "Trash icon" button.</li>
                </ul>
            </div>
            <hr className="uk-margin-medium" />
            <p className="uk-text-small uk-text-muted uk-text-center">After making some changes, click this button to save your navigation</p>
        </React.Fragment>
    )
}