import logo from './logo.svg';
import './App.css';
import Signup from './components/Signup';
import Signin from './components/Signin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './components/User';

function App() {
  return (
    <div>
<BrowserRouter>
<Routes>
  <Route path='/' element={<Signin/>}/>
  <Route path='/Signup' element={<Signup/>}/>
  <Route path='/User' element={<User/>}/>
</Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
