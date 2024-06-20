import React, { useContext, useEffect, useState } from 'react'
import { AdsContext } from '../App'
import { Link } from 'react-router-dom'
import './../css/TopAd.css'

function TopAd() {
    const {ads} = useContext(AdsContext);
    const [firstThreeAds, setFirstThreeAds] = useState([]);

    useEffect(() => {
        if(ads.length !== 0)  setFirstThreeAds(ads.slice(0, 3));
    }, [ads])


    return (
        <>
            {firstThreeAds.length !== 0 ? (
                <div className="top-ads">
                    <div className="ads-title">advertisment</div>
                    <div className="top-ads-img-container">
                        {firstThreeAds.map( ad => {
                            return (
                            <div key={ad.id} className="single-ad">
                                <Link to={ad.url}>
                                    <img 
                                        className='top-ads-img' 
                                        src={`./../../img/ads/${ad.image}`} 
                                        alt="not found" />
                                </Link>
                                <div className="ad-title">{ad.title}</div>
                            </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default TopAd