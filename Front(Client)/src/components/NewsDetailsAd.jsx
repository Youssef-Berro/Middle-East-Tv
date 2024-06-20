import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import {AdsContext} from './../App'


function NewsDetailsAd() {
    const {ads} = useContext(AdsContext);

    return (
        <>
            {ads.length >= 6 &&
                <div className="news-details-ads-container">
                    <div className="news-details-ads-title">Advertisment</div>
                    <div className="news-details-ads">
                        {ads.slice(3, 6).map( ad => {
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
            }
        </>
    )
}

export default NewsDetailsAd