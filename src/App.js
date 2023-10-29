import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Search from './pages/Search';
import Menu from './components/Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Plant from './pages/Plant';
import RegistrationForm from './pages/Signup';
import LoginForm from './pages/Login';
import Favorites from './pages/Favorites';
import { Footer } from './components/Footer';
import { AuthContextProvider } from "./context/Auth";

const App = () => {

  return (
    <AuthContextProvider>
      <Router>
        <Menu/>
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/plant/:id" element={<Plant />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<RegistrationForm />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        <Footer/>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
