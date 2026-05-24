import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // 임시 로그인 처리 함수 (나중에 JWT 백엔드 API와 연동할 부분)
  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 성공 가정하고 홈 화면으로 이동
    navigate('/home'); 
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* 로그인 박스 */}
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-3 rounded-full mb-3">
            <Activity size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">TagStock 시작하기</h2>
          <p className="text-gray-500 text-sm mt-2">로컬 AI 기반 주식 메타데이터 엔진</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="admin@tagstock.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-2"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            계정이 없으신가요? <a href="#" className="text-blue-600 hover:underline">회원가입</a>
          </p>
        </div>
        
      </div>
    </div>
  );
}