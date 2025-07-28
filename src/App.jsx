import React from 'react';
import { Route, useLocation, Switch } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import About from './Pages/About/About.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Home from './Pages/Home/Home.jsx'
import Projects from './Pages/Projects/Projects.jsx'
import Header from './Components/Header/Header.jsx'
import Footer from './Components/Footer/Footer.jsx'
import ScrollArrow from './Components/ScrollArrow/ScrollArrow.jsx';
import StarrySky from './Pages/Home/StarrySky.jsx';
import './App.css';

const pageVariants = {
  initial: (isHomePage) => ({
    opacity: 0,
    y: isHomePage ? 0 : "-100vh",
  }),
  in: {
    opacity: 1,
    y: 0,
  },
  out: (isHomePage) => ({
    opacity: 0,
    y: isHomePage ? "100vh" : "-100vh",
  }),
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 1.2,
};

function App() {
  const location = useLocation();
  const hasHeader = ['/projects', '/about', '/contact'].includes(location.pathname);
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  
  return(
    <>
      <StarrySky />
      <ScrollArrow />
      <main className={hasHeader ? 'has-header' : ''}>
        {hasHeader && <Header />}
        <AnimatePresence mode="wait" custom={isHomePage}>
          <motion.div
            key={location.pathname}
            custom={isHomePage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="content-container"
          >
            <Switch location={location}>
              <Route exact path={['/home', '/']} component={Home} />
              <Route exact path='/projects' component={Projects} />
              <Route exact path='/about' component={About} />
              <Route exact path='/contact' component={Contact} />
            </Switch>
          </motion.div>
        </AnimatePresence>
        {hasHeader && <Footer />}
      </main>
    </>
  );
}

export default App;
