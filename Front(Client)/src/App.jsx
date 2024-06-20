import React, { createContext, useEffect, useState } from 'react'
import './App.css'
import Header from './commonComponents/Header'
import axios from 'axios'
import HomePage from './components/HomePage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'
import CategoryPage from './components/CategoryPage'
import Footer from './commonComponents/Footer'
import NewsPage from './components/NewsPage'

/*
    convert the CategoryPage component to a parent component that call many child,
    means divide the returned jsx in it into child components,
    then add a component for each subCategory in the main category in the page
    by creating a new endpoint which do this functionality, the api to this url:
    http://localhost:8000/api/category/get-latest-news-by-category?categoryName=${categoryName}&nbOfNews=51
    must be in the parent component and pass data by props
*/

const AdsContext = createContext();

function App() {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const resp = await axios.get('http://localhost:8000/api/ad/get-all-ads');
                setAds(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchAds();
    }, [])
    return (
        <>
        <AdsContext.Provider value={{ads, setAds}}>
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/category/:categoryName' element={<CategoryPage />} />
                <Route path='/news/:newsId' element={<NewsPage />} />
            </Routes>
            <Footer />
            <ToastContainer position="top-center"  autoClose={2000}/>
        </AdsContext.Provider>
        </>
    )
}

export {
    App,
    AdsContext
}
