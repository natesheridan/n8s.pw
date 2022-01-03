import React from 'react'
import './Home.css'
import StarrySky from './StarrySky.js'
import Fade from 'react-reveal/Fade';
import Header from './../../Components/Header/Header'
import Button from './../../Components/Button/Button'



const Home = () => {
    return (
    <>

        <section className="home">
            <div className = "sky-container">
                    <StarrySky/>
            </div>
            <div className="info-box">
                <img src='http://github.com/natesheridan.png'></img>
                <div className="info-btns">
                    <Button label={"about"} to='/about' />
                    <Button label={"projects"} to='/projects' />
                    <Button label={"contact"} to='/contact' />
                </div>
                <h1>Nate Sheridan</h1>
                <h4>software development, tech, cars</h4>
                <div className="info-btns">
                    <Button label={"resume"} color="dark" to='/about#resume' />
                    <Button label={"linkedin"} color="dark" href='https://linkedin.com/n8s' />
                    <Button label={"github"} color="dark" href='https://github.com/natesheridan' />
                </div>

            </div>
        </section>
    </>
    )
}

export default Home
