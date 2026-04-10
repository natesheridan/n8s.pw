import React, { useEffect } from 'react';
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

const PAGE_META = {
  '/': {
    title: 'Nate Sheridan — Frontend Engineer | n8s.pw',
    description: 'Nate Sheridan (n8s, n8wtf) is a Denver-based frontend software engineer. React, JavaScript, CSS — building Autofoc.us, Valetra, LocaLedger, and more. Available for contract work.',
    canonical: 'https://n8s.pw/',
  },
  '/home': {
    title: 'Nate Sheridan — Frontend Engineer | n8s.pw',
    description: 'Nate Sheridan (n8s, n8wtf) is a Denver-based frontend software engineer. React, JavaScript, CSS — building Autofoc.us, Valetra, LocaLedger, and more. Available for contract work.',
    canonical: 'https://n8s.pw/',
  },
  '/about': {
    title: 'About Nate Sheridan — n8s | Self-Taught Engineer & Builder',
    description: "The story behind n8s: self-taught hacker turned Turing School grad turned enterprise engineer. Cars, homelabs, and products built from the ground up. Get to know Nate Sheridan.",
    canonical: 'https://n8s.pw/about',
  },
  '/projects': {
    title: 'Projects — n8s.pw | Nate Sheridan\'s Work',
    description: 'Autofoc.us, Valetra, LocaLedger, Second Summit, and more. A catalog of frontend tools, apps, and side projects built by Nate Sheridan (n8s, n8wtf) in Denver, CO.',
    canonical: 'https://n8s.pw/projects',
  },
  '/contact': {
    title: 'Contact Nate Sheridan — n8s | Denver Frontend Developer for Hire',
    description: 'Hire Nate Sheridan (n8s) for frontend development, React engineering, or MVP work in Denver, CO or remotely. Fast, honest, and ships clean code.',
    canonical: 'https://n8s.pw/contact',
  },
};

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function App() {
  const location = useLocation();
  const hasHeader = ['/projects', '/about', '/contact'].includes(location.pathname);
  const isWhiteboard = location.pathname === '/whiteboard';

  useEffect(() => {
    const meta = PAGE_META[location.pathname] || PAGE_META['/'];
    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', meta.canonical, 'property');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setCanonical(meta.canonical);
  }, [location.pathname]);

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
