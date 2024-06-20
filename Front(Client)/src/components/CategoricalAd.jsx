import React, { useContext } from 'react'
import {AdsContext} from './../App'
import { Link } from 'react-router-dom';
function CategoricalAd() {
    const {ads} = useContext(AdsContext);

    return (
        <>
            {ads.length > 6 && 
                <div className="categorical-ad-container">
                    <div className="categorical-ad-title">Advertisment</div>
                    <div className="categorical-ad">
                        <div key={ads[6].id} className="single-ad">
                            <Link to={ads[6].url}>
                                <img 
                                    className='top-ads-img' 
                                    src={`./../../img/ads/${ads[6].image}`} 
                                    alt="not found" />
                            </Link>
                            <div className="ad-title">{ads[6].title}</div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CategoricalAd