import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './../css/RecommendedCategories.css'
import { Link } from 'react-router-dom';

function RecommendedCategories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const resp = await axios.get('http://localhost:8000/api/category/get-random-category?nbOfNews=5');
                setCategories(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchCats();
    }, [])
    return (
        <>
            {categories.length !== 0 && 
                <div className="recommended-categories-container">
                    {categories.map( (category, i) => {
                        const catName = category[0].categoryName;

                        return (
                            <>
                                <Link 
                                    className="single-recommended-category-title"
                                    to={`/category/${catName}`}>{catName}
                                </Link>
                                <div
                                    key={`${i}-${catName}-${new Date().getMilliseconds()}`} 
                                    className="single-recommended-category">
                                        {category.map( singleNews => {
                                            return (
                                                <Link
                                                    to={`/news/${singleNews.id}`}
                                                    key={`${singleNews.id}-${new Date().getMilliseconds()}`} 
                                                    className="recommended-category-single-news">
                                                        <img
                                                            src={`./../../img/news/${singleNews.image}`} 
                                                            alt="not found" />
                                                        <div className="single-news-title">
                                                            {singleNews.title}
                                                        </div>
                                                </Link>
                                            )
                                        })}
                                </div>
                            </>
                        )
                    })}
                </div>
            }
        </>
    )
}

export default RecommendedCategories