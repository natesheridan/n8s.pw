import './App.css';
import {Route} from 'react-router-dom';
import About from './Pages/About/About.js'
import Contact from './Pages/Contact/Contact.js'
import Home from './Pages/Home/Home.js'
import Projects from './Pages/Projects/Projects.js'

function App() {
  return (
    <main >
      <div className="content-container">
        <Route exact path = {['/home', '/']} render = {() => <Home />} />
        <Route exact path = '/projects' render = {() => <Projects />} />
        <Route exact path = '/about' render = {() => <About />} />
        <Route exact path = '/contact' render = {() => <Contact />} />
      </div>
    </main>
  );
}

export default App;
