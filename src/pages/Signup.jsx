import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1. 백엔드 회원가입 API 호출
      await axios.post('http://localhost:8080/api/v1/members/signup', {
        email,
        password,
        name
      });
      
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/'); // 회원가입 성공 시 로그인 화면으로 이동
      
    } catch (error) {
      console.error("회원가입 실패:", error);
      // 백엔드에서 중복 이메일 등의 에러를 던졌을 때의 처리
      alert(error.response?.data || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-50 p-3 rounded-full mb-3">
            <UserPlus size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
          <p className="text-gray-500 text-sm mt-2">TagStock의 새로운 멤버가 되어주세요</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="홍길동" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="example@tagstock.com" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••" required
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors mt-2">
            가입하기
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            이미 계정이 있으신가요? <Link to="/" className="text-green-600 hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}