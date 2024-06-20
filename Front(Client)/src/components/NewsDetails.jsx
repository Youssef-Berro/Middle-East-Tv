import React from 'react'
import './../css/NewsDetails.css'
import NewsDetailsAd from './NewsDetailsAd'
import { Link } from 'react-router-dom';


function NewsDetails(props) {
    const newsData = props.newsData;

    return (
        <>
            <div className="news-details-container">
                <div className="news-details-data">
                    <div className="news-data-head">
                        <div className="news-details-title">{newsData.title}</div>
                        <div className="news-created-at-and-category">
                            <div className="news-created-at">
                                {new Intl.DateTimeFormat(
                                'en-US', {
                                    weekday: 'short', 
                                    day: 'numeric',
                                    month: 'long' 
                                }).format(new Date(newsData.createdAt))}
                            </div>
                            <Link
                                to={`/category/${newsData.categoryName}`}
                                className="news-category-name">{newsData.categoryName}</Link>
                        </div>
                    </div>
                    <img src={`./../../img/news/${newsData.image}`} alt="not found" />
                    <Link
                        to={`/category/${newsData.categorySpecificName}`}
                        className="news-category-specific-name">{newsData.categorySpecificName}</Link>
                    <div className="news-content">{newsData.content}</div>
                </div>
                <NewsDetailsAd />
            </div>
        </>
    )
}

export default NewsDetails