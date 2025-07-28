import React from 'react'
import DynamicBox from './../../Components/DynamicBox/DynamicBox'
import { motion } from 'framer-motion';
import AboutData from './AboutData'

const About = () => {
    const isOdd = (n) => {
        if(n%2===0){ return false}
        return true
    }
    const aboutDataMapped = AboutData.map((cardData, i) => {
        const c = cardData
        if(isOdd(i)){
            return(
                <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} key={i}>
                    <DynamicBox
                        color='white'
                        image={c.image}
                        header={c.header}
                        subheader={c.subheader}
                        content={c.content}
                        link={c.link}
                        id={c.id}
                        typeDelay = {c.typeDelay}
                        iframe = {c.iframe}
                        side="right"/>
                </motion.div>
            )
        }

        return(
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} key={i}>
                <DynamicBox
                    color='blue'
                    image={c.image}
                    header={c.header}
                    subheader={c.subheader}
                    content={c.content}
                    link={c.link}
                    id={c.id}
                    typeDelay = {c.typeDelay}
                    iframe = {c.iframe}

                    side="left"/>
            </motion.div>
        )
    })

    return (
    <>
        <section className="content about">
            {aboutDataMapped}
        </section>
    </>
    )
}

export default About
