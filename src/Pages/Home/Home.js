import React from 'react'
import './Home.css'
import StarrySky from './StarrySky.js'
import Fade from 'react-reveal/Fade';
import Button from './../../Components/Button/Button'
import SocialButton from './../../Components/SocialButton/SocialButton'




const Home = () => {
    return (
    <>

        <section className="home">
            <div className = "sky-container">
                    <StarrySky/>
            </div>
            <div className="info-box">
                <img alt="github profile" src='http://github.com/natesheridan.png'></img>
                <h1>Nate Sheridan</h1>
                <h4>software development, tech, cars</h4>
                <div className="info-btns">
                    <Fade bottom delay={100}>
                    <Button label={"about"} to='/about' />
                    </Fade>
                    <Fade bottom delay={200}>
                    <Button label={"projects"} to='/projects' />
                    </Fade>
                    <Fade bottom delay={300}>
                    <Button label={"contact"} to='/contact' />
                    </Fade>
                </div>
                <div className="info-btns">
                    <Fade top delay={600}>
                    <SocialButton label={"Github"} to={"https://github.com/natesheridan"} size={50} faIcon={"FaGithub"}/>
                    </Fade>
                    
                    <Fade top delay={700}>
                    <SocialButton label={"LinkedIn"} to={"https://linkedin.com/in/n8s"} size={50} faIcon={"FaLinkedinIn"}/>
                    </Fade>
                    
                    <Fade top delay={800}>
                    <SocialButton label={"Twitter"} to={"https://twitter.com/n8wtf"} size={50} faIcon={"FaTwitter"}/>
                    </Fade>

                    <Fade top delay={900}>
                    <SocialButton label={"Resume"} to={"https://n8s.pw/assets/ResumeNoPhone.pdf"} size={50} faIcon={"FaScroll"}/>
                    </Fade>
                </div>

            </div>
        </section>
    </>
    )
}

export default Home
