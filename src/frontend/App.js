//import React from 'react'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import './assets/scss/main.scss'
import '../node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '../node_modules/@fortawesome/fontawesome-free/scss/solid.scss'
import '../node_modules/@fortawesome/fontawesome-free/scss/brands.scss'

import Header from './layouts/Header'

import Dashboard from './pages/Dashboard'
import Pages from './pages/Pages'
import PagesAction from './pages/PagesAction'
import Navigation from './pages/Navigation'
import Posts from './pages/Posts'
import PostsAction from './pages/PostsAction'
import Components from './pages/Components'
import Settings from './pages/Settings'

export default function App() {
    return (
        <React.Fragment>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pages" element={<Pages />} />
                    <Route path="/pages/:mode" element={<PagesAction />} />
                    <Route path="/navigation" element={<Navigation />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/:mode" element={<PostsAction />} />
                    <Route path="/components" element={<Components />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path='*' element={'not found'} />
                </Routes>
            </main>
        </React.Fragment>
    )
}