import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Bot, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function StockDetail() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]); // 🌟 진짜 차트 데이터를 담을 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        // 🌟 2. Promise.all을 사용하여 상세 정보 API와 차트 API를 동시에 빠르게 호출합니다.
        const [detailResponse, chartResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/stocks/${code}`, { headers }),
          axios.get(`http://localhost:8080/api/v1/stocks/${code}/chart`, { headers })
        ]);

        setStock(detailResponse.data);
        setChartData(chartResponse.data); // 🌟 받아온 차트 데이터를 상태에 저장

      } catch (error) {
        console.error("상세 데이터 조회 실패", error);
        alert('데이터를 불러올 수 없거나 존재하지 않는 종목입니다.');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    
    if (code) fetchStockDetail();
  }, [code, navigate]);

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">데이터를 불러오는 중입니다...</div>;
  if (!stock) return null;

  // 2. 해시태그 파싱
  let parsedTags = [];
  try {
    parsedTags = typeof stock.aiTags === 'string' ? JSON.parse(stock.aiTags) : (stock.tags || []);
  } catch (e) {
    parsedTags = [];
  }

  // 🌟 3. AI 분석 리포트 JSON 파싱 로직 추가
  let aiReport = { summary: "", details: "", risk: "" };
  try {
    // 백엔드에서 JSON 규격으로 만들어준 문자열을 파싱합니다.
    aiReport = JSON.parse(stock.aiPattern);
  } catch (e) {
    // 구버전 데이터이거나 파싱 실패 시 방어 로직
    aiReport.summary = stock.aiPattern;
    aiReport.details = "상세 분석 데이터를 불러오는 중 오류가 발생했습니다.";
    aiReport.risk = "리스크 데이터를 확인할 수 없습니다.";
  }

  const mockRate = "+1.24%";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. 뒤로가기 및 상단 헤더 */}
      <div className="flex items-center gap-4 mb-4">
        <Link to="/home" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-gray-600" size={24} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{stock.stockName}</h1>
            <span className="text-lg text-gray-500 font-mono">{stock.stockCode}</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-2xl font-bold text-gray-900">{stock.closePrice?.toLocaleString()}원</span>
            <span className="text-lg font-medium text-red-500 flex items-center">
              <TrendingUp size={20} className="mr-1" />
              {mockRate}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. 좌측: 주가 차트 영역 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            최근 주가 흐름 (예시 데이터)
          </h2>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value.toLocaleString()}원`, '종가']}
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

        {/* 3. 우측: AI 분석 리포트 영역 */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="text-blue-600" size={24} />
              AI 분석 리포트
            </h2>
            
            <div className="space-y-4">
              {/* 🌟 파싱된 진짜 데이터 연결 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100/50">
                <p className="text-sm text-blue-600 font-bold mb-2">핵심 한 줄 평 (Ollama)</p>
                <p className="text-gray-900 font-medium leading-relaxed">"{aiReport.summary}"</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500 font-bold mb-1 flex items-center gap-1">
                  <Info size={16} /> 패턴 상세 분석
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {aiReport.details}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm text-red-600 font-bold mb-1 flex items-center gap-1">
                  <AlertTriangle size={16} /> 리스크 / 체크포인트
                </p>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {aiReport.risk}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-3">연관 해시태그</h3>
            <div className="flex flex-wrap gap-2">
              {parsedTags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 shadow-sm">
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