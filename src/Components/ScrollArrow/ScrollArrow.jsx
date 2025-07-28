import React, {useState} from 'react';
import {FaRegArrowAltCircleUp} from 'react-icons/fa';
import './ScrollArrow.css';


const ScrollArrow = () =>{

  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false)
    }
  };

  const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  window.addEventListener('scroll', checkScrollTop)

  return (
        <FaRegArrowAltCircleUp className="scroll-arrow" onClick={scrollTop} style={{height: 50, display: showScroll ? 'flex' : 'none'}}/>
  );
}

export default ScrollArrow;