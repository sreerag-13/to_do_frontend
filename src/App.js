import logo from './logo.svg';
import './App.css';
import Signup from './components/Signup';
import Signin from './components/Signin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './components/User';
import Navbar from './components/Navbar';
import AddTask from './components/AddTask';
import ViewTask from './components/ViewTask';

function App() {
  return (
    <div>
<BrowserRouter>
<Routes>
  <Route path='/' element={<Signin/>}/>
  <Route path='/Signup' element={<Signup/>}/>
  <Route path='/User' element={<User/>}/>
  <Route path='/NavBar' element={<Navbar/>}/>
  <Route path='/AddTask' element={<AddTask/>}/>
  <Route path='/ViewTask' element={<ViewTask/>}/>
</Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
