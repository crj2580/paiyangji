import {Routes,Route} from 'react-router-dom'
import Home from '@pages/Home/Home';
import Passwords from '@pages/Passwords/Passwords';
import Game from './pages/Game/Game';
import End from './pages/End/End';
function App() {
  return (
   <div>   
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/passwords' element={<Passwords/>}></Route>
      <Route path='/game' element={<Game/>}></Route>
      <Route path='/end' element={<End/>}></Route>
    </Routes>
   </div>
   )
}

export default App;
