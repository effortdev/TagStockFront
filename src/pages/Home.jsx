import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  
  // 선택된 태그 상태 (초기값: #골든크로스임박)
  const [selectedTag, setSelectedTag] = useState('#골든크로스임박');
  
  // 백엔드에서 받아올 주식 데이터를 담을 상태
  const [stocks, setStocks] = useState([]);

  // 🌟 알림 중복 방지용 방패 생성 (초기값은 false)
  const isAlerted = useRef(false);

  // 임시 고정 태그 리스트 (나중에는 이 태그 목록도 백엔드에서 동적으로 받아올 수 있습니다)
  const aiTags = [
    '#골든크로스임박', '#외인매집중', '#과매도구간', '#박스권돌파', '#실적턴어라운드'
  ];

  // selectedTag가 변경될 때마다 백엔드 API를 호출합니다.
  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    
    // 문지기 로직: 토큰이 없으면 로그인 화면으로 쫓아냅니다.
    if (!token) {
      if (!isAlerted.current) { // 방패가 내려가 있을 때만 알림을 띄웁니다.
        alert('로그인이 필요한 서비스입니다.');
        isAlerted.current = true; // 알림을 띄웠으니 방패를 올립니다.
        navigate('/');
      }
      return; // 🌟 여기서 함수를 종료시켜 아래의 axios 호출을 막습니다.
    }

    // 주식 데이터 가져오기
    axios.get('http://localhost:8080/api/v1/stocks', {
      params: { tag: selectedTag }, // params를 쓰면 '#' 기호가 안전하게 URL 인코딩되어 전송됩니다.
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setStocks(response.data);
    })
    .catch(error => {
      console.error("데이터 조회 실패", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // 토큰 만료 시에도 중복 알림 방지 적용
        if (!isAlerted.current) {
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          isAlerted.current = true;
          localStorage.removeItem('accessToken');
          navigate('/');
        }
      }
    });
  }, [selectedTag, navigate]); // selectedTag가 바뀔 때마다 이 useEffect가 다시 실행됩니다!

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* 1. 상단 검색 및 타이틀 영역 */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          어떤 조건의 주식을 찾으시나요?
        </h1>
        <p className="text-gray-500 mb-8">로컬 AI가 새벽마다 분석한 2,500개 종목의 패턴을 즉시 확인하세요.</p>
        
        <div className="relative w-full max-w-2xl">
          <input 
            type="text" 
            placeholder="종목명 또는 종목코드를 입력하세요" 
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-blue-100 focus:outline-none focus:border-blue-500 transition-colors shadow-sm text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
            검색
          </button>
        </div>
      </div>

      {/* 2. AI 추천 해시태그 필터 영역 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="text-blue-600" size={20} />
          <h2 className="text-xl font-bold text-gray-900">AI 실시간 트렌드 태그</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {aiTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)} // 버튼 클릭 시 선택된 태그 상태 변경 -> useEffect 자동 실행
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 검색 결과 카드 리스트 영역 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <span className="text-blue-600">{selectedTag}</span> 관련 종목 
          <span className="text-sm text-gray-500 ml-2 font-normal">총 {stocks.length}건</span>
        </h3>
        
        {stocks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500">
            해당 태그와 일치하는 종목이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map(stock => (
              <Link 
                key={stock.code} 
                to={`/stock/${stock.code}`}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stock.name}</h4>
                    <span className="text-sm text-gray-400">{stock.code}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{stock.price}원</p>
                    {/* 등락률 색상 및 아이콘 동적 처리 */}
                    <p className={`text-sm font-medium flex items-center justify-end gap-1 ${stock.rate.startsWith('+') ? 'text-red-500' : stock.rate.startsWith('-') ? 'text-blue-500' : 'text-gray-500'}`}>
                      {stock.rate.startsWith('+') ? <TrendingUp size={14} /> : stock.rate.startsWith('-') ? <TrendingDown size={14} /> : null}
                      {stock.rate}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {stock.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}