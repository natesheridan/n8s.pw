import React from 'react';
import { Route, useLocation, Switch } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import About from './Pages/About/About.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Home from './Pages/Home/Home.jsx'
import Projects from './Pages/Projects/Projects.jsx'
import WhiteboardPage from './Pages/Whiteboard/WhiteboardPage.jsx'
import Header from './Components/Header/Header.jsx'
import Footer from './Components/Footer/Footer.jsx'
import ScrollArrow from './Components/ScrollArrow/ScrollArrow.jsx';
import StarrySky from './Pages/Home/StarrySky.jsx';
import './App.css';

function App() {
  const location = useLocation();
  const hasHeader = ['/projects', '/about', '/contact'].includes(location.pathname);
  const isWhiteboard = location.pathname === '/whiteboard';
  
  // For whiteboard, render only the page without any surrounding elements
  if (isWhiteboard) {
    return (
      <AnimatePresence mode="wait">
        <Switch location={location} key={location.pathname}>
          <Route exact path='/whiteboard' component={WhiteboardPage} />
        </Switch>
      </AnimatePresence>
    );
  }
  
  return(
    <div className="app-container">
      <StarrySky />
      <ScrollArrow />
      <main className={hasHeader ? 'has-header' : ''}>
        {hasHeader && <Header />}
        <AnimatePresence mode="wait">
          <Switch location={location} key={location.pathname}>
            <Route exact path={['/home', '/']} component={Home} />
            <Route exact path='/projects' component={Projects} />
            <Route exact path='/about' component={About} />
            <Route exact path='/contact' component={Contact} />
          </Switch>
        </AnimatePresence>
        {hasHeader && <Footer />}
      </main>
    </div>
  );
}

export default App;
