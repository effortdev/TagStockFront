import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* 로고 영역 */}
      <Link to="/home" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
        <Activity size={28} />
        TagStock
      </Link>
      
      {/* 네비게이션 영역 */}
      <nav className="text-sm font-medium text-gray-500 gap-6 flex">
        <Link to="/admin" className="hover:text-blue-600 transition-colors">배치 관리자</Link>
        <Link to="/" className="hover:text-blue-600 transition-colors">로그아웃</Link>
      </nav>
    </header>
  );
}