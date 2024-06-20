import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './../css/Header.css'
import axios from 'axios';

function Header() {
    const [searchResult, setSearchResult] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const fetchSearchNews = async (e) => {
        const searchStr = e.target.value;
        setSearchInput(searchStr);

        if (searchStr.length <= 2) {
            setSearchResult([]);
            return;
        }

        try {
            const resp = await axios.get(`http://localhost:8000/api/news/news-search?nbOfNews=40&searchStr=${searchStr}`);
            setSearchResult(resp.data.data);
        }catch(err) {
            console.log(err);
        }
    }


    const clearSearchInput = () => {
        setSearchInput('');
        setSearchResult([]);
    }


    return (
        <div>
            <div className="header-container">
                <div className="section1">
                    <Link to='/'>
                        <img className='business-logo' src="./../../img/utils/logo2.png" alt="" />
                    </Link>
                    <Link to='/'>
                        <img className='business-name' src="./../../img/utils/logo1.png" alt="" />
                    </Link>
                </div>
                <div className="section2">
                    <Link className='category-name' to='/'>Home</Link>
                    <Link className='category-name' to='/category/style'>Style</Link>
                    <Link className='category-name' to='/category/sports'>Sports</Link>
                    <Link className='category-name' to='/category/travel'>Travel</Link>
                    <Link className='category-name' to='/category/health'>Health</Link>
                    <Link className='category-name' to='/category/world'>World</Link>
                    <Link className='category-name' to='/category/entertainment'>Entertainment</Link>
                    <Link className='category-name' to='/category/war'>War</Link>
                    <Link className='category-name' to='/category/features'>Features</Link>
                </div>
                <div className="section3">
                    <input
                        onChange={fetchSearchNews}
                        type="text"
                        value={searchInput}
                        placeholder='news search...' 
                        className='search' />
                    <svg 
                        className='search-icon' 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none"  
                        stroke="currentColor">
                        <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    {searchResult.length !== 0 && 
                        <div className="search-result">
                            {searchResult.map( news => {
                                return (
                                    <Link 
                                        key={news.id}
                                        onClick={clearSearchInput}
                                        to={`/news/${news.id}`} 
                                        className="single-news-search-result">
                                            <img 
                                                src={`./../../img/news/${news.image}`} 
                                                alt="not found" />
                                            <div className="search-result-right-section">
                                                <div className="search-result-news-title">
                                                    {news.title}
                                                </div>
                                                <div className="search-result-news-category-specific-name">
                                                    {news.categorySpecificName}
                                                </div>
                                            </div>
                                    </Link>
                                )
                            })
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header