import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './../css/CategoryPage.css'
import RecommendedCategories from './RecommendedCategories';
import CategoricalAd from './CategoricalAd';
import CategoryNews from './CategoryNews';

function CategoryPage(props) {
    const params = useParams();
    const categoryName = params.categoryName || props.categoryName;

    const url = `http://localhost:8000/api/category/get-latest-news-by-category?categoryName=${categoryName}&nbOfNews=51`;
    const [categoricalNews, setCategoricalNews] = useState([]);


    useEffect(() => {
        const fetchCategoryNews = async () => {
            try {
                const resp = await axios.get(url);
                setCategoricalNews(resp.data.data);
            }catch(err) {
                setCategoricalNews([]);
            }
        }

        fetchCategoryNews();
        window.scrollTo(0, 0);
    }, [params])




    return (
        <>
            {categoricalNews.length !== 0 ? (
                <CategoryNews news={categoricalNews} categoryName={categoryName} /> 
            ) : (
                <div className="not-found-news">News with category {categoryName} Not Found(404)</div>)}

            <CategoricalAd />
            <RecommendedCategories />
        </>
    )
}

export default CategoryPage