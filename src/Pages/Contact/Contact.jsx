import React from 'react'
import { motion } from 'framer-motion';
import './Contact.css'
import Button from '../../Components/Button/Button'

const Contact = () => {
    return (
    <>
        <section className="content contact">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <h1>Let's Connect! <span className="emoji">🤝</span></h1>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                <div className="contact-message">
                    <p>
                        Hey there! Thanks for wanting to reach out. Fair warning: my inbox is like a black hole 
                        where emails occasionally achieve quantum superposition – they both exist and don't exist 
                        until I actually open them. <span className="emoji">🌌</span>
                    </p>
                    <p>
                        But don't let that stop you! I genuinely enjoy connecting with interesting people, 
                        and I promise I'll do my best to figure out quantum mechanics to respond. 
                        <span className="emoji">⏰</span>
                    </p>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                <div className="contact-options">
                    <div className="contact-option">
                        <h3>For Business and Career Driven Opportunities <span className="emoji">⚡</span></h3>
                        <p>LinkedIn is probably your best bet – I check it every blue moon and when I'm bored.</p>
                        <Button 
                            label="LinkedIn" 
                            onClick={() => window.open('https://linkedin.com/in/n8s', '_blank')}
                        />
                    </div>

                    <div className="contact-option">
                        <h3>For The Brave <span className="emoji">✉️</span></h3>
                        <p>If you're feeling adventurous, try my email (this is the black hole):</p>
                        <code className="email">nate@n8s.pw</code>
                        <p className="email-note">(No spam please, my spam folder is already full enough to feed a small village)</p>
                    </div>
                    <div className="contact-option">
                        <h3>For Emergencies <span className="emoji">📱</span></h3>
                        <p>
                            Or if you really, really, really need my attention, I give you permission 
                            (just this once!) to google my name followed by "phone number" if you want 
                            to find my phone number. It's probably out there somewhere...
                        </p>
                        <Button 
                            label="Google Me" 
                            onClick={() => window.open('https://www.google.com/search?q=n8s+phone+number', '_blank')}
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    </>
    )
}

export default Contact
