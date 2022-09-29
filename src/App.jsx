import { useState } from 'react';
import './App.scss';
import Main from './component/Main';
import Detail from './component/Detail';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/detail" element={<Detail></Detail>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
