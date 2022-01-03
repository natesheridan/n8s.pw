import React from 'react'
import DynamicBox from './../../Components/DynamicBox/DynamicBox'
import Fade from 'react-reveal/Fade'
import AboutData from './AboutData'
import deployLinks from './AboutData'

const About = () => {
    const isOdd = (n) => {
        if(n%2==0){ return false}
        return true
    }
    const aboutDataMapped = AboutData.map((cardData, i) => {
        const c = cardData
        console.log(c)
        if(isOdd(i)){
            return(
                <Fade right>
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
            <Fade left>
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
