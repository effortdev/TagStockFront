import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // 🌟 현재 URL 경로를 파악하는 훅

  // 🌟 현재 주소가 로그인('/') 이거나 회원가입('/signup')인지 확인합니다.
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/home" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
        <Activity size={28} />
        TagStock
      </Link>
      
      {/* 🌟 isAuthPage가 '아닐 때만' 네비게이션 메뉴를 보여줍니다! */}
      {!isAuthPage && (
        <nav className="text-sm font-medium text-gray-500 gap-6 flex items-center">
          <Link to="/admin" className="hover:text-blue-600 transition-colors">배치 관리자</Link>
          <button onClick={handleLogout} className="hover:text-blue-600 transition-colors font-medium">
            로그아웃
          </button>
        </nav>
      )}
    </header>
  );
}