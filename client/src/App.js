import Register from './pages/Register.js'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import TextEditor from './pages/TextEditor.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.js'
import Table from './components/Table.js'
import Docs from './pages/Docs.js'
import Network from './pages/Network.js'

function App() {
  return (
    <div className='App bg-gradient-to-b from-[#BBC2FA] to-white'>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/login' element={<Login />} />

          <Route exact path='/' element={<Home />} />
          <Route exact path='*' element={<Home />} />

          <Route exact path='/courses' element={<Docs />} />
          <Route exact path='/notes' element={<Table />} />
          
          <Route exact path='/newNote' element={<TextEditor />} />
          <Route exact path='/network' element={<Network />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
