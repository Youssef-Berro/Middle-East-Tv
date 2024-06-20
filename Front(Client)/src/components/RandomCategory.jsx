import React, { useEffect, useState } from 'react'
import './../css/RandomCategory.css'
import axios from 'axios'
import { Link } from 'react-router-dom';

function RandomCategory() {
    const [randCat, setRandCat] = useState({});
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const resp = await axios.get('http://localhost:8000/api/category/get-random-category?nbOfNews=3');
                const data = await resp.data.data;
                if(data.length !== 0) {
                    setRandCat({categoryName: data[0].categoryName,
                                categorySpecificName: data[0].categorySpecificName,
                                categoryImg: data[0].categoryImg});

                    setNews(data.map( singleNews => {
                        return {id: singleNews.id, 
                                title: singleNews.title, 
                                image: singleNews.image}
                    }))
                }
            }catch(err) {
                console.log(err);
            }
        }

        fetchCat();
    }, [])

    return (
        <>
            {(Object.keys(randCat).length !== 0) && (news.length !== 0) && (
                <> 
                    <Link
                        to={`/category/${randCat.categorySpecificName}`} 
                        className="rand-category-title">{randCat.categorySpecificName} Category</Link>
                    <div className="random-category-container">
                        <div className="rand-category-data">
                            <img src={`./../../img/categories/${randCat.categoryImg}`} alt="not found" />
                            <div className="rand-category-news">
                                {news.map( singleNews => {
                                    return (
                                        <Link 
                                            key={singleNews.id}
                                            to={`/news/${singleNews.id}`}
                                            className="rand-category-single-news">
                                                <img 
                                                    src={`./../../img/news/${singleNews.image}`} 
                                                    alt="not found" />
                                                <div 
                                                    className="rand-category-news-title">{singleNews.title}</div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>)
            }
        </>
    )
}

export default RandomCategory