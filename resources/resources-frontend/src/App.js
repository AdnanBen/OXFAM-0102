import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResourceHome from './page/ResourceHome';
import Article from './page/Article';

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/">
              {/* <Route index element={<Home />} /> */}
              <Route path="resources" element={<ResourceHome />} />
              <Route path="article/1" element={<Article />} />
            </Route>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
