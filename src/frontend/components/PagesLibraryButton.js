import React from 'react'

export default function PagesLibraryButton(props) {
    return (
        <React.Fragment>
            <button className="uk-button uk-button-default uk-border-rounded btn-library-filter">Show categories<i className="fas fa-caret-down fa-xs uk-margin-small-left"></i></button>
            <div data-uk-dropdown="offset: -6; mode: click; pos: bottom-justify;">
                <hr className="uk-margin-small-bottom"/>
                <ul className="uk-nav uk-dropdown-nav">
                    {
                        props.data.map(library => {
                            return (
                                <li key={library.name}><a href={'#wrap-'+library.name.toLowerCase()} data-uk-scroll><i className={'fas '+library.icon+' fa-sm uk-margin-small-right'}></i>{library.name}</a></li>
                            )
                        })
                    }
                </ul>
            </div>
        </React.Fragment>
    )
}