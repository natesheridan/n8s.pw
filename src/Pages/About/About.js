import React from 'react'
import DynamicBox from './../../Components/DynamicBox/DynamicBox'
import Fade from 'react-reveal/Fade'
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
                <Fade right key={i}>
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
                </Fade>
            )
        }

        return(
            <Fade left key={i}>
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
            </Fade>
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
