import './Home.css'
import StarrySky from './StarrySky.jsx'
import { motion } from 'framer-motion';
import Button from './../../Components/Button/Button.jsx'
import SocialButton from './../../Components/SocialButton/SocialButton.jsx'

const Home = () => {
    return (
    <>

        <section className="home">
            <div className = "sky-container">
                    <StarrySky/>
            </div>
            <div className="info-box">
                <img alt="github profile" src='https://github.com/natesheridan.png'></img>
                <h1>Nate Sheridan</h1>
                <h4>software development, tech, cars</h4>
                <div className="info-btns">
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                        <Button label={"about"} to='/about' />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <Button label={"projects"} to='/projects' />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                        <Button label={"contact"} to='/contact' />
                    </motion.div>
                </div>
                <div className="info-btns">
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                        <SocialButton label={"Github"} to={"https://github.com/natesheridan"} size={50} faIcon={"FaGithub"}/>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
                        <SocialButton label={"LinkedIn"} to={"https://linkedin.com/in/n8s"} size={50} faIcon={"FaLinkedinIn"}/>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
                        <SocialButton label={"Twitter"} to={"https://twitter.com/n8wtf"} size={50} faIcon={"FaTwitter"}/>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
                        <SocialButton label={"Resume"} to={"https://n8s.pw/assets/ResumeNoPhone.pdf"} size={50} faIcon={"FaScroll"}/>
                    </motion.div>
                </div>
                
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}>
                    <div className="info-btns">
                        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>n8s.pw</motion.div> ← 
                        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>n8.wtf</motion.div> | 
                        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.5 }}><a href="https://autofoc.us">autofoc.us</a></motion.div>
                    </div>
                    <h6>(im kind of actively rebuilding this site shhhh)</h6>   
                </motion.div>

            </div>
        </section>
    </>
    )
}

export default Home
