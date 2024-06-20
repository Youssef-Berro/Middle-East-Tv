import React, { useEffect, useState } from "react"
import axios from 'axios'
import './../css/RecentFiveNews.css'
import {Link} from 'react-router-dom'

function RecentFiveNews() {
    const [news, setNews] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get('http://localhost:8000/api/news/get-latest-news?nbOfNews=5');
                setNews(resp.data.data);
            } catch(err) {
                console.log(err);
            }
        }

        fetchData();
    }, [])




    return (
        <>
        {news.length !== 0 ? (
            <div className="recent-news-container">
                <div className="recent-news-head">
                    <div className="recent-news-title">Latest News</div>
                    <div className="recent-news-date">
                        {new Intl.DateTimeFormat(
                                'en-US', {
                                    weekday: 'long', 
                                    day: 'numeric',
                                    month: 'long' 
                                }).format(new Date(news[0].createdAt))}
                        </div>
                </div>
                <div className="recent-news">
                    <div className="left-section">
                        <Link className="recent-news-link" to={`/news/${news[0].id}`}>
                            <img src={`./../../img/news/${news[0].image}`} alt="not found" />
                            <div className="news-title">{news[0].title}</div>
                        </Link>
                    </div>
                    <div className="right-section">
                        {news.map( (singleNews, i) => {
                            if(i !== 0) {
                                return (
                                    <div className="right-news-recent" key={singleNews.id}>
                                        <Link to={`/news/${singleNews.id}`} className="recent-news-link">
                                            <img src={`./../../img/news/${singleNews.image}`} alt="not found" />
                                            <div className="right-news-title">{singleNews.title}</div>
                                        </Link>
                                    </div>
                                )
                            } 
                        })}
                    </div>
                </div>
                </div>) : (
                <div className="recent-news-container">
                    <div className="recent-news-head">
                    <div className="recent-news-title">recent News</div>
                    </div>
                    <div className="recent-news">
                        <div className="left-section-loading"></div>
                        <div className="right-section-loading">
                            <div className="loading-news"></div>
                            <div className="loading-news"></div>
                            <div className="loading-news"></div>
                            <div className="loading-news"></div>
                        </div>
                    </div>
                </div>)
        }
        </>
    )
}


export default RecentFiveNews;