import Register from './pages/Register.js'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import TextEditor from './pages/TextEditor.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.js'
import Table from './components/Table.js'
import Network from './pages/Network.js'
// import RouteAuth from "./utils/RouteAuth";

function App() {
  return (
    <div className='App bg-gradient-to-b from-[#BBC2FA] to-white'>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/login' element={<Login />} />

          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='*' element={<Home />}></Route>

          <Route exact path='/notes' element={<Table />} />
          
          <Route exact path='/newNote' element={<TextEditor />} />
          <Route exact path='/network' element={<Network />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
