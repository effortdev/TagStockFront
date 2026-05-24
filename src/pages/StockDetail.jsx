import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Bot, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockDetail() {
  // 메인 화면에서 클릭한 주식의 코드번호를 URL에서 가져옵니다 (예: /stock/005930)
  const { code } = useParams();

  // 1. 차트를 그리기 위한 가짜(Mock) 주가 데이터 (최근 7일)
  const chartData = [
    { date: '05/17', price: 78000 },
    { date: '05/18', price: 78500 },
    { date: '05/19', price: 79200 },
    { date: '05/20', price: 78800 },
    { date: '05/21', price: 80500 },
    { date: '05/22', price: 81000 },
    { date: '05/24', price: 82000 },
  ];

  // 2. 백엔드에서 받아올 가짜(Mock) AI 리포트 데이터
  const stockInfo = {
    name: '삼성전자',
    code: code || '005930',
    currentPrice: '82,000',
    rate: '+1.24%',
    tags: ['#골든크로스임박', '#외인매집중'],
    aiReport: {
      summary: "바닥권에서 거래량이 급증하며 상승 반전을 준비하는 패턴",
      details: "최근 5거래일 연속 외국인 순매수가 유입되며 하락 추세를 벗어나려는 시도가 돋보입니다. 단기 이동평균선이 정배열로 전환되기 직전의 전형적인 골든크로스 임박 형태입니다.",
      risk: "120일 이동평균선(84,000원) 부근의 악성 매물대 돌파 여부가 핵심 체크포인트입니다. 돌파 실패 시 단기 조정 가능성이 있습니다."
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. 뒤로가기 및 상단 헤더 */}
      <div className="flex items-center gap-4 mb-4">
        <Link to="/home" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-gray-600" size={24} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{stockInfo.name}</h1>
            <span className="text-lg text-gray-500">{stockInfo.code}</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-2xl font-bold text-gray-900">{stockInfo.currentPrice}원</span>
            <span className="text-lg font-medium text-red-500 flex items-center">
              <TrendingUp size={20} className="mr-1" />
              {stockInfo.rate}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. 좌측: 주가 차트 영역 (2칸 차지) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            최근 주가 흐름
          </h2>
          
          {/* Recharts를 활용한 반응형 선 그래프 */}
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#white' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. 우측: AI 분석 리포트 영역 (1칸 차지) */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="text-blue-600" size={24} />
              AI 분석 리포트
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-blue-600 font-bold mb-1">핵심 한 줄 평</p>
                <p className="text-gray-900 font-medium">"{stockInfo.aiReport.summary}"</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500 font-bold mb-1 flex items-center gap-1">
                  <Info size={16} /> 패턴 상세 분석
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {stockInfo.aiReport.details}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm text-red-600 font-bold mb-1 flex items-center gap-1">
                  <AlertTriangle size={16} /> 리스크 / 체크포인트
                </p>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {stockInfo.aiReport.risk}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-3">연관 해시태그</h3>
            <div className="flex flex-wrap gap-2">
              {stockInfo.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}