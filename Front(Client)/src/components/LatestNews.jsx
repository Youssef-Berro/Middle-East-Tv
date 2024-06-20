import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './../css/LatestNews.css'

function LatestNews() {
    const [news, setNews] = useState([]);


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const resp = await axios.get('http://localhost:8000/api/news/get-latest-news?nbOfNews=20&oldPageSize=5&currentPage=2');
                setNews(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchNews();
    }, [])


    return (
        <>
            {news.length !== 0 && (
                <div className="latest-news-container">
                    <div className="latest-news-title">News</div>
                    <div className="all-latest-news">
                        {news.map( singleNews => {
                            return (
                                <div key={singleNews.id} className="single-news">
                                    <Link to={`/news/${singleNews.id}`} className="latest-news-link">
                                        <img src={`./../../img/news/${singleNews.image}`} alt="not found" />
                                        <div className="single-news-title">{singleNews.title}</div>
                                    </Link>
                                    <Link 
                                        to={`/category/${singleNews.categoryName}`} 
                                        className="news-category">{singleNews.categoryName}</Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

export default LatestNews