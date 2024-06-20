import React from 'react'
import './App.css'
import Header from './components/Header'
import LogIn from './components/LogIn'
import {Route, Routes} from 'react-router-dom'
import HomePage from './components/HomePage'
import NewsDetails from './components/NewsDetails'
import AdDetails from './components/AdDetails'
import ProgramDetails from './components/ProgramDetails'
import InsertNews from './components/InsertNews'
import InsertAd from './components/InsertAd'
import InsertProgram from './components/InsertProgram'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {

    return (
        <>
            <Header/>
            <Routes>
                <Route path='/' element= {<LogIn />} />
                <Route path='/homepage' element= {<HomePage />} />
                <Route path='/news/:id' element={<NewsDetails />} />
                <Route path='/ads/:id' element={<AdDetails />} />
                <Route path='/programs/:id' element={<ProgramDetails />} />
                <Route path='/insert-news' element={<InsertNews />} />
                <Route path='/insert-ad' element={<InsertAd />} />
                <Route path='/insert-program' element={<InsertProgram />} />
            </Routes>
            <ToastContainer position="top-center"  autoClose={2000}/>
        </>
    )
}

export default App
