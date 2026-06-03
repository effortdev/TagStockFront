import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Loader2, AlertTriangle, TrendingUp, Activity, ArrowLeft, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockDetail() {
  const { stockCode } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [stockInfo, setStockInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  
  // 상태 관리 (버튼 로딩 처리)
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // 🌟 1. 데이터를 불러오는 함수를 따로 뺐습니다. (갱신 후 다시 호출하기 위해)
  const fetchStockData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      // 종목 기본 정보 조회
      const infoRes = await axios.get(`http://localhost:8080/api/v1/stocks/${stockCode}`, { headers });
      setStockInfo(infoRes.data);

      // 과거 30일 차트 데이터 조회 (우리 DB에서 꺼내옴)
      const chartRes = await axios.get(`http://localhost:8080/api/v1/stocks/${stockCode}/chart`, { headers });
      setChartData(chartRes.data);
    } catch (error) {
      console.error("데이터 조회 실패", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [stockCode]);

  // 🌟 2. [최신 데이터 갱신] 버튼 클릭 시 실행되는 함수
  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem('accessToken');
      // 백엔드 sync API 호출 (KIS에서 가져와 DB 저장)
      const response = await axios.post(
        `http://localhost:8080/api/v1/stocks/${stockCode}/sync`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(response.data.message || "최신 30일 데이터가 갱신되었습니다!");
      
      // 갱신 성공 시 차트 데이터를 다시 불러와 화면에 그립니다.
      await fetchStockData(); 
    } catch (error) {
      console.error("데이터 갱신 중 에러 발생", error);
      alert("데이터 갱신에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSyncing(false);
    }
  };

  // 🌟 3. [실시간 AI 분석] 버튼 클릭 시 실행되는 함수
  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `http://localhost:8080/api/v1/stocks/${stockCode}/analyze-realtime`,
        { stockName: stockInfo?.stockName || "알수없음" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAiResult(response.data);
    } catch (error) {
      console.error("AI 분석 중 에러 발생", error);
      // 백엔드에서 보낸 에러 메시지(DB에 데이터 없음 등)를 화면에 띄웁니다.
      const errorMsg = error.response?.data?.error || "AI 분석 중 통신 오류가 발생했습니다.";
      alert(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!stockInfo) return <div className="text-center py-20 text-gray-500">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* 상단 뒤로가기 및 종목 헤더 */}
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={18} /> 목록으로 돌아가기
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">{stockInfo.stockName}</h1>
            <p className="text-lg text-gray-500 font-mono mt-1">{stockInfo.stockCode}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{stockInfo.closePrice?.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* 🌟 주가 트렌드 차트 영역 및 동기화 버튼 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <Activity className="text-blue-500" size={24} />
            <span className="font-semibold text-lg">최근 주가 동향 (30일)</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              누적 거래량: <span className="font-bold text-gray-900">{stockInfo.volume?.toLocaleString()}주</span>
            </div>
            {/* ✨ 여기에 데이터 갱신 버튼이 추가되었습니다! ✨ */}
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className={`flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium border border-gray-200 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={16} className={isSyncing ? "animate-spin text-blue-600" : ""} />
              {isSyncing ? "데이터 가져오는 중..." : "30일 데이터 갱신"}
            </button>
          </div>
        </div>
        
        {/* 차트 렌더링 영역 */}
        {chartData && chartData.length > 0 ? (
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => value.toLocaleString()} dx={-10} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()}원`, '종가']} labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }} animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl mt-4 border border-dashed border-gray-200 space-y-2">
            <p>차트 데이터가 없습니다.</p>
            <p className="text-sm">우측 상단의 [30일 데이터 갱신] 버튼을 눌러주세요.</p>
          </div>
        )}
      </div>

      {/* 실시간 AI 분석 섹션 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-10">
          <Sparkles size={120} className="text-blue-600" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">AI 트렌드 정밀 분석</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Ollama (gemma2:2b) 모델이 최근 30일간의 주가 흐름을 분석하여 투자 인사이트를 도출합니다.
          </p>

          {!isAnalyzing && !aiResult && (
            <button 
              onClick={handleAnalyzeClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <Sparkles size={20} /> 실시간 30일 트렌드 분석 시작
            </button>
          )}

          {isAnalyzing && (
            <div className="bg-white/60 p-6 rounded-2xl border border-blue-200/50 flex flex-col items-center justify-center space-y-4 animate-pulse">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-blue-800 font-bold text-lg">AI가 안전한 DB 데이터를 읽어 분석 중입니다...</p>
              <p className="text-sm text-blue-600/70">약 3~5초 정도 소요될 수 있습니다.</p>
            </div>
          )}

          {aiResult && !isAnalyzing && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={20} /> 핵심 한 줄 평
                </h3>
                <p className="text-gray-800 font-medium text-lg">{aiResult.summary}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">상세 분석 코멘트</h3>
                <p className="text-gray-700 leading-relaxed">{aiResult.details}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-red-500" size={20} /> 체크포인트 & 리스크
                  </h3>
                  <p className="text-red-900/80 leading-relaxed text-sm">{aiResult.risk}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-gray-500 mb-3">AI 도출 해시태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.tags?.map((tag, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right pt-4">
                <button 
                  onClick={handleAnalyzeClick}
                  className="text-sm text-gray-500 hover:text-blue-600 underline underline-offset-4 font-medium"
                >
                  보유 데이터 기반 재분석하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}