import Register from './pages/Register.js'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import TextEditor from './pages/TextEditor.js'
import TextViewer from './pages/TextViewer.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.js'
import Table from './components/Table.js'
import Docs from './pages/Docs.js'
import Network from './pages/Network.js'
import Profile from './pages/Profile.js'
import EditProfile from './pages/EditProfile.js'

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

          {/* Where type refers to mine, shared, or public */}
          <Route exact path='/courses' element={<Docs />} />
          {/* <Route exact path='/notes/:noteType/:courseID?' element={<Table />} /> */}
          <Route path="/notes/:noteType">
            <Route path=":courseID" element={<Table />} />
            <Route path="" element={<Table />} />
          </Route>

          <Route exact path='/newNote' element={<TextEditor />} />
          <Route path='/editNote' element={<TextEditor />}/>
          <Route path='/viewNote' element={<TextViewer />}/>
          <Route exact path='/network' element={<Network />} />
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/editProfile' element={<EditProfile />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
