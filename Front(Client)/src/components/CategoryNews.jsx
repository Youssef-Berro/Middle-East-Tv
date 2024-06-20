import React from 'react'
import { Link } from 'react-router-dom';
function CategoryNews(props) {
    const news = props.news;
    const categoryName = props.categoryName;

    return (
        <div className='categorical-news-container'>
            <div className="categorical-news-data">
                <div className="category-title">{categoryName} News</div>
                <div className="most-recent-categorical-news">
                    {news.map( singleNews => {
                        return (
                            <div key={singleNews.id} className="single-news">
                                <Link to={`/news/${singleNews.id}`} className="latest-news-link">
                                    <img src={`./../../img/news/${singleNews.image}`} alt="not found" />
                                    <div className="single-news-title">{singleNews.title}</div>
                                </Link>
                                <Link 
                                    to={`/category/${singleNews.categorySpecificName}`} 
                                    className="news-category">{singleNews.categorySpecificName}
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CategoryNews