import './App.css';
import {Route, useLocation} from 'react-router-dom';
import About from './Pages/About/About.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Home from './Pages/Home/Home.jsx'
import Projects from './Pages/Projects/Projects.jsx'
import Header from './Components/Header/Header.jsx'
import Footer from './Components/Footer/Footer.jsx'
import ScrollArrow from './Components/ScrollArrow/ScrollArrow.jsx'

function App() {
  const location = useLocation();
  const hasHeader = ['/projects', '/about', '/contact'].includes(location.pathname);
  
  return(
    <>
    <ScrollArrow />
    <main className={hasHeader ? 'has-header' : ''} onScroll={console.log("Scroll")} >
        <Route exact path = {['/projects', '/about', '/contact']} render = {() => <Header />} />
      <div className="content-container">
        <Route exact path = {['/home', '/']} render = {() => <Home />} />
        <Route exact path = '/projects' render = {() => <Projects />} />
        <Route exact path = '/about' render = {() => <About />} />
        <Route exact path = '/contact' render = {() => <Contact />} />
      </div>
        <Route exact path = {['/projects', '/about', '/contact']} render = {() => <Footer />} />
    </main>
    </>
  );
}

export default App;
