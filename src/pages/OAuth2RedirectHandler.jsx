import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // 1. 주소창(URL)에 있는 '?token=' 뒤의 값을 뽑아냅니다.
        const token = searchParams.get('token');

        if (token) {
            // 2. 토큰이 잘 넘어왔다면 localStorage에 저장합니다.
            localStorage.setItem('accessToken', token);
            // 3. 홈 화면으로 당당하게 입장!
            navigate('/home');
        } else {
            // 토큰이 없으면 로그인 실패 처리
            alert('소셜 로그인에 실패했습니다.');
            navigate('/');
        }
    }, [navigate, searchParams]);

    // 찰나의 순간에 지나가는 페이지이므로 간단한 로딩 문구만 띄워줍니다.
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">구글 계정으로 로그인 중입니다...</p>
            </div>
        </div>
    );
}