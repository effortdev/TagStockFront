import { useState } from 'react';
import { Search, TrendingUp, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  // 임시 선택된 태그 상태 관리
  const [selectedTag, setSelectedTag] = useState('#골든크로스임박');

  // 백엔드에서 받아올 가짜(Mock) AI 해시태그 목록
  const aiTags = [
    '#골든크로스임박', '#외인매집중', '#과매도구간', '#박스권돌파', '#실적턴어라운드'
  ];

  // 백엔드에서 받아올 가짜(Mock) 주식 목록 데이터
  const mockStocks = [
    { id: 1, code: '005930', name: '삼성전자', price: '82,000', rate: '+1.24%', tags: ['#골든크로스임박', '#외인매집중'] },
    { id: 2, code: '000660', name: 'SK하이닉스', price: '198,500', rate: '+3.15%', tags: ['#골든크로스임박', '#실적턴어라운드'] },
    { id: 3, code: '035420', name: 'NAVER', price: '185,200', rate: '-0.54%', tags: ['#과매도구간', '#외인매집중'] },
    { id: 4, code: '035720', name: '카카오', price: '45,300', rate: '+0.00%', tags: ['#바닥다지기', '#박스권돌파'] },
    { id: 5, code: '005380', name: '현대차', price: '265,000', rate: '+2.10%', tags: ['#실적턴어라운드', '#골든크로스임박'] },
  ];

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
              onClick={() => setSelectedTag(tag)}
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
          <span className="text-blue-600">{selectedTag}</span> 관련 종목 (미리보기)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockStocks.map(stock => (
            <Link 
              key={stock.id} 
              to={`/stock/${stock.code}`} // 상세 페이지로 이동하는 라우팅
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stock.name}</h4>
                  <span className="text-sm text-gray-400">{stock.code}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{stock.price}원</p>
                  <p className={`text-sm font-medium ${stock.rate.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                    {stock.rate.startsWith('+') ? <TrendingUp size={14} className="inline mr-1" /> : null}
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
      </div>

    </div>
  );
}