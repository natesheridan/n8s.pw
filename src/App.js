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

  console.log(`NATE SHERIDAN 2022
  n8s.pw // n8.wtf // autofoc.us                                                     
                                                      
                       888888888                      
                     88:::::::::88                    
                   88:::::::::::::88                  
                  8::::::88888::::::8                 
nnnn  nnnnnnnn    8:::::8     8:::::8    ssssssssss   
n:::nn::::::::nn  8:::::8     8:::::8  ss::::::::::s  
n::::::::::::::nn  8:::::88888:::::8 ss:::::::::::::s 
nn:::::::::::::::n  8:::::::::::::8  s::::::ssss:::::s
n:::::nnnn:::::n 8:::::88888:::::8  s:::::s  ssssss 
n::::n    n::::n8:::::8     8:::::8   s::::::s      
n::::n    n::::n8:::::8     8:::::8      s::::::s   
n::::n    n::::n8:::::8     8:::::8ssssss   s:::::s 
n::::n    n::::n8::::::88888::::::8s:::::ssss::::::s
n::::n    n::::n 88:::::::::::::88 s::::::::::::::s 
n::::n    n::::n   88:::::::::88    s:::::::::::ss  
nnnnnn    nnnnnn     888888888       sssssssssss    
                                 
 Thanks for visiting my website! Please let me know if you find any bugs!
 Contact me through the contact page!                                
          
                                 
                                 `)

  
  return(
    <>
    <ScrollArrow />
    <main>
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
