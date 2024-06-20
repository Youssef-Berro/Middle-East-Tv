import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import NewsDetails from './NewsDetails'
import CategoryPage from './CategoryPage'

function NewsPage() {
    const params = useParams();
    const [newsData, setNewsData] = useState({});


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/api/news/get-news-by-id/${params.newsId}`);
                setNewsData(resp.data.data);
                console.log(resp.data.data.categoryName)
            }catch(err) {
                console.log(err);
            }
        }

        fetchNews();
    }, [params])



    return (
        <>
        {Object.keys(newsData).length !== 0 && 
            <>
                <NewsDetails newsData={newsData} />
                <CategoryPage categoryName={newsData.categoryName} />
            </>}
        </>
    )
}

export default NewsPage