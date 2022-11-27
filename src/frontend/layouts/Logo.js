import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <Link to="dashboard" className="uk-logo uk-margin-right">
            <img className="uk-margin-small-right in-offset-top-10" src="../assets/img/blockit-logo.svg" alt="blockit" width="24" height="24" />Blockit
        </Link>
    )
}