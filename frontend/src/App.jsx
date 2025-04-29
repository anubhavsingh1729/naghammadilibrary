import { useState } from 'react'
import "./App.css"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import CompareText from './components/CompareText'
import BookText from './components/Booktext'
import GraphViewer from './components/graph'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='parent-container'>
      <div className="heading">
          <h2>The Nag Hammadi Library</h2>
      </div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path ='/view_text' element={<BookText />} />
            <Route path = '/view_graph' element={<GraphViewer />} />
          </Routes>
        </Router>
    </div>
  )
}

export default App
