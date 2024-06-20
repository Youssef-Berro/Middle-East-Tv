import React, { useState, useEffect } from 'react';
import './../css/HomePage.css';
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

function HomePage() {
    const path = useNavigate()
    const [searchResult, setSearchResult] = useState([]);
    const [updateBtns, setUpdateBtns] = useState([
        { className: 'selected-to-update', value: 'News' },
        { className: ' ', value: 'Ads' },
        { className: ' ', value: 'Programs' },
    ]);

    const selectedLowerVal = () => {
        const selectedObj = updateBtns.find(obj => obj.className === 'selected-to-update');
        return selectedObj ? selectedObj.value.toLowerCase() : '';
    }

    const selectedUpperVal = () => {
        const selectedObj = updateBtns.find(obj => obj.className === 'selected-to-update');
        return selectedObj ? selectedObj.value : '';
    }

    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])

    const fetchSearch = async (e) => {
        const searchStr = e.target.value;
        if(searchStr.length <= 2) {
            setSearchResult([]);
            return;
        }

        try {
            const resp = await axios.get(`http://localhost:8000/api/admin/${selectedLowerVal()}-search?nbOf${selectedUpperVal()}=40&searchStr=${searchStr}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setSearchResult(resp.data.data);
        }catch(err) {
            console.log(err);
        }
    }

    const updateBtnsFct = (index) => {
        let updatedBtns = [];

        for (let i = 0; i < 3; i++) {
            if (i === index) updatedBtns.push({
                                            className: 'selected-to-update',
                                            value: updateBtns[i].value });
            else
                updatedBtns.push({ className: ' ', value: updateBtns[i].value });
        }

        setUpdateBtns([...updatedBtns]);
        setSearchResult([])
    };


    const logOut = () => {
        sessionStorage.clear();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Logout',
            showConfirmButton: false,
            timer: 1000
        })
        path('/')
    }

    return (
        <div className="homepage-container">
            <div className="insert-container">
                <div className="insert-title">Insert</div>
                <div className="insert-btns-container">
                    <button 
                        onClick={() => path('/insert-news')}
                        className="insert-btn-news">Insert News</button>
                    <button 
                        onClick={() => path('/insert-ad')}
                        className="insert-btn-ad">Insert Ad</button>
                    <button 
                        onClick={() => path('/insert-program')}
                        className="insert-btn-program">Insert Program</button>
                </div>
            </div>
            <div className="right-container">
                <div className="search-title">Search For : </div>
                <div className="search-btns-container">
                    {updateBtns.map((btn, i) => {
                        return (<button 
                                    onClick={() => updateBtnsFct(i)} 
                                    key={i} 
                                    className={btn.className}>{btn.value}</button>)
                    })}
                </div>
                <div className="search-container">
                    <input onChange={fetchSearch} type="text" placeholder="choose between the above buttons for what you need to search" />
                    {searchResult.length !== 0 && 
                        <div className="search-result">
                            {searchResult.map( (obj, i) => {
                                return (
                                    <Link 
                                        key={`${obj.id}-${i}`} 
                                        to={`/${selectedLowerVal()}/${obj.id}`} 
                                        className="single-obj-search-result">
                                            <img 
                                                src={`./../../img/${selectedLowerVal()}/${obj.image}`} 
                                                alt="not found" />
                                            <div className="search-result-right-section">
                                                <div className="search-result-obj-title">
                                                    {obj.title || obj.name}
                                                </div>
                                                {obj.categorySpecificName && 
                                                    <div className="search-result-obj-category-specific-name">
                                                        {obj.categorySpecificName}
                                                    </div>
                                                }
                                            </div>
                                    </Link>
                                )
                            })
                            }
                        </div>
                    }
                </div>
            </div>
            <button 
                onClick={logOut} 
                className='log-out-btn log-in-btn discard-btn'>log out</button>
        </div>
    );
}

export default HomePage;
