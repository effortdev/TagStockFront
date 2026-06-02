import { useState } from 'react';
import { Activity } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; // 🌟 Link 임포트 추가
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('test@tagstock.com');
  const [password, setPassword] = useState('password123!');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/members/login', {
        email,
        password
      });
      
      const token = response.data.accessToken;
      localStorage.setItem('accessToken', token);
      
      navigate('/home'); 
        
    } catch (error) {
      console.error("로그인 실패:", error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  // 🌟 구글 소셜 로그인 연동 함수
  // 프론트엔드에서 구글 로그인 버튼을 누르면, 백엔드에 설정된 OAuth2 로그인 주소로 브라우저를 이동시킵니다.
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-3 rounded-full mb-3">
            <Activity size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">TagStock 시작하기</h2>
          <p className="text-gray-500 text-sm mt-2">로컬 AI 기반 주식 메타데이터 엔진</p>
        </div>

        {/* 일반 이메일 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="admin@tagstock.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* 🌟 소셜 로그인 구분선 */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="h-px w-full bg-gray-200"></span>
          <span className="text-sm text-gray-400 font-medium px-2">또는</span>
          <span className="h-px w-full bg-gray-200"></span>
        </div>

        {/* 🌟 구글 로그인 버튼 (Tailwind 스타일 적용) */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          구글 계정으로 시작하기
        </button>

        {/* 🌟 회원가입 링크 연결 (a 태그 대신 Link 사용) */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            계정이 없으신가요? <Link to="/signup" className="text-blue-600 hover:underline">회원가입</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}