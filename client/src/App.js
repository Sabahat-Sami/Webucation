import Register from './pages/Register.js'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import TextEditor from './pages/TextEditor.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.js'
import Table from './components/Table.js'
import Network from './pages/Network.js'
import ReactLoading from "react-loading";
import { useAuth } from './utils/AuthContext';
import RouteAuth from "./utils/RouteAuth";

function App() {
  const { loading } = useAuth();
  return (
    <div className='App bg-gradient-to-b from-[#BBC2FA] to-white'>
    {
      (loading) ? (
      <div className="loader flex items-center justify-center h-screen">
        <ReactLoading type="spin" color="#0000FF"
                height={100} width={50} />
      </div>
      ) : (
      <>
      <Router>
        <Navbar />
        <Routes>
          {/* Unprotected Routes */}
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='*' element={<Home />}></Route>
          {/* Protected Routes */}
          <Route element={<RouteAuth />}>
            <Route exact path='/newNote' element={<TextEditor />} />
          </Route>
          <Route element={<RouteAuth />}>
            <Route exact path='/notes' element={<Table />} />
          </Route>
          <Route element={<RouteAuth />}>
            <Route exact path='/network' element={<Network />} />
          </Route>

        </Routes>
      </Router>
      </>
      )
    }
    </div>
  )
}

export default App
