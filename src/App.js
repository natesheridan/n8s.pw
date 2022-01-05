import './App.css';
import {Route} from 'react-router-dom';
import About from './Pages/About/About.js'
import Contact from './Pages/Contact/Contact.js'
import Home from './Pages/Home/Home.js'
import Projects from './Pages/Projects/Projects.js'
import Header from './Components/Header/Header.js'
import Footer from './Components/Footer/Footer.js'
import ScrollArrow from './Components/ScrollArrow/ScrollArrow.js'


function App() {



  
  return(
    <>
    <ScrollArrow />
    <main onScroll={console.log("Scroll")} >
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
