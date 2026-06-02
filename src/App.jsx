import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 방금 만든 공통 컴포넌트 불러오기
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지 컴포넌트 불러오기
import Login from './pages/Login';
import Home from './pages/Home';
import StockDetail from './pages/StockDetail';
import AdminBatch from './pages/AdminBatch';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      {/* 전체 화면을 꽉 채우고, 세로로 컴포넌트를 배치하는 flex 레이아웃 */}
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        
        {/* 1. 상단 고정 헤더 */}
        <Header />

        {/* 2. 메인 콘텐츠 영역 (flex-grow로 남은 세로 공간을 모두 차지함) */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/stock/:code" element={<StockDetail />} />
            <Route path="/admin" element={<AdminBatch />} />
          </Routes>
        </main>

        {/* 3. 하단 고정 푸터 */}
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;