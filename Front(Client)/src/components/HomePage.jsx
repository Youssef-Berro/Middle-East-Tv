import React from 'react'
import RecentFiveNews from './RecentFiveNews'
import TopAd from './TopAd'
import Weather from './Weather'
import LatestNews from './LatestNews'
import Programs from './Programs'
import RandomCategory from './RandomCategory'
import RecommendedCategories from './RecommendedCategories'

function HomePage() {
    return (
        <div className="home-page-container">
            <RecentFiveNews />
            <TopAd />
            <div className="section3-container">
                <LatestNews />
                <Weather />
            </div>
            <RandomCategory />
            <Programs />
            <RecommendedCategories />
        </div>
    )
}

export default HomePage