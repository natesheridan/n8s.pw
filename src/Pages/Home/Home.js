import React from 'react'
import './Home.css'
import StarrySky from './StarrySky.js'
import Fade from 'react-reveal/Fade';
import Header from './../../Components/Header/Header'
import Button from './../../Components/Button/Button'



const Home = () => {
    return (
    <>
        <Fade duration={4000}>

        <section className="home">
            <div className = "sky-container">
                    <StarrySky/>
            </div>
            <div class="info-box">
                <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'></img>
                <h1>Nate Sheridan</h1>
                <h4>software dev, techie, car nerd</h4>
                <div className="info-btns">
                    <Button label={"about"} to='/about' />
                    <Button label={"contact"} to='/contact' />
                    <Button label={"projects"} to='/projects' />
                </div>

            </div>
        </section>
        </Fade>
    </>
    )
}

export default Home
