import React, { useEffect, useState } from 'react'
import './../css/Footer.css'
import axios from 'axios';
import { Link } from 'react-router-dom';


function Footer() {
    const [categoryNames, setCategoryNames] = useState([]);
    const url = 'http://localhost:8000/api/category/get-all-category-names-and-specific-name';

    useEffect(() => {
        const fetchCategoryNames = async () => {
            try {
                const resp = await axios.get(url);
                setCategoryNames(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchCategoryNames();
    }, [])


    return (
        <>
            {categoryNames.length !== 0 && 
                <div className="footer-container">
                    <div className="about-container">
                        <div className="about-title">About :</div>
                        <div className="about-data">
                        Middle East TV – your ultimate platform for staying informed and up-to-date. 
                        Our user-friendly interface ensures effortless access to the latest news, 
                        accurate weather information, and an array of curated categories. Explore,
                        engage, and stay in the know with ease.
                        </div>
                    </div>
                    <div className="categories">
                        <div className="footer-category-title">Categories :</div>
                        <div className="footer-category-data">
                            {categoryNames.slice(0, 80).map( (name, i) => {
                                return (
                                    <Link 
                                        key={`${i}-${name}`}
                                        to={`/category/${name}`}
                                        className="single-category">{name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Footer