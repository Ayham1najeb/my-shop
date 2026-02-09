import React from 'react';
import HeroSlider from '../components/HeroSlider';
import StrongFeaturesCard from '../StrongFeaturesCard';
import PromoBanner from '../components/PromoBanner';
import HomeProductList from '../ProductList';
import Promotions from '../Promotions';

const Home = () => {
    return (
        <div className="home-page">
            <HeroSlider />
            <StrongFeaturesCard />
            <HomeProductList />
            <PromoBanner />
            <Promotions />
        </div>
    );
};

export default Home;
