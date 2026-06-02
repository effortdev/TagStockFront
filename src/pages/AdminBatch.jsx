import { useState, useEffect, useRef } from 'react';
import { Play, Square, Terminal, Cpu, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 🌟 추가
import axios from 'axios'; // 🌟 추가

export default function AdminBatch() {
  const navigate = useNavigate();
  const isAlerted = useRef(false); // 알림 중복 방지 방패

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState(['[SYSTEM] 대기 중... AI 분석 배치를 시작할 수 있습니다.']);

  // 🌟 1. 문지기 로직: 로그인 안 한 사용자가 관리자 페이지에 들어오는 것 차단
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      if (!isAlerted.current) {
        alert('관리자 권한이 필요합니다. 먼저 로그인해주세요.');
        isAlerted.current = true;
        navigate('/');
      }
    }
  }, [navigate]);

  // 가짜 배치 실행 시뮬레이션 (프론트엔드 애니메이션용)
  useEffect(() => {
    let interval;
    if (isRunning && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 5) + 1; // 1~5% 랜덤 증가
          if (next >= 100) {
            setIsRunning(false);
            setLogs(prevLogs => [...prevLogs, `[SUCCESS] 전체 종목 분석 배치 완료 (100%)`]);
            return 100;
          }
          // 진행률에 따른 가짜 로그 생성
          setLogs(prevLogs => {
            const newLogs = [...prevLogs, `[BATCH] 종목 데이터 분석 중... (진행률: ${next}%)`];
            // 로그가 너무 길어지면 최신 6개만 유지
            return newLogs.slice(-6);
          });
          return next;
        });
      }, 800); // 0.8초마다 갱신
    }
    return () => clearInterval(interval);
  }, [isRunning, progress]);

  const handleStartBatch = async () => {
    setIsRunning(true);
    setProgress(0);
    setLogs(['[SYSTEM] 수동 배치 트리거 작동. Spring Batch Job을 시작합니다...']);

    // 🌟 2. 실제 백엔드 연동을 대비한 axios 코드 (현재는 주석 처리, 나중에 백엔드 완성 후 주석 해제)
    try {
      const token = localStorage.getItem('accessToken');
      // 🌟 URL 끝부분을 /run 에서 /start 로 수정합니다!
      await axios.post('http://localhost:8080/api/v1/batch/start', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(prev => [...prev, '[SYSTEM] 서버에 배치 실행 요청을 성공적으로 전달했습니다.']);
    } catch (error) {
      console.error("배치 실행 요청 실패", error);
      setLogs(prev => [...prev, '[ERROR] 서버와 통신할 수 없습니다.']);
      setIsRunning(false);
      return;
    }
  };

  const handleStopBatch = () => {
    setIsRunning(false);
    setLogs(prevLogs => [...prevLogs, '[WARNING] 관리자에 의해 배치가 강제 중단되었습니다.']);
  };

  // UI 부분은 회원님이 만드신 완벽한 코드를 100% 그대로 유지합니다.
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* 헤더 영역 */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Cpu className="text-blue-600" size={32} />
          대용량 AI 배치 컨트롤 센터
        </h1>
        <p className="text-gray-500 mt-2">
          On-Premise 로컬 AI(Ollama)와 Spring Batch를 제어하고 모니터링합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 좌측: 제어 패널 & 터미널 (2칸 차지) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 메인 컨트롤 카드 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">일일 시세 분석 배치 (Job)</h2>
                <p className="text-sm text-gray-500 mt-1">대상: 코스피/코스닥 전 종목 (약 2,500건)</p>
              </div>
              
              {/* 실행/중지 버튼 */}
              {!isRunning && progress !== 100 ? (
                <button 
                  onClick={handleStartBatch}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md"
                >
                  <Play size={20} fill="currentColor" />
                  배치 수동 시작
                </button>
              ) : (
                <button 
                  onClick={handleStopBatch}
                  disabled={progress === 100}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors shadow-md ${
                    progress === 100 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <Square size={20} fill={progress === 100 ? "none" : "currentColor"} />
                  {progress === 100 ? '완료됨' : '강제 중지'}
                </button>
              )}
            </div>

            {/* 프로그레스 바 영역 */}
            <div className="space-y-2 mt-8">
              <div className="flex justify-between text-sm font-medium">
                <span className={isRunning ? "text-blue-600 font-bold" : "text-gray-600"}>
                  {isRunning ? "배치 실행 중..." : progress === 100 ? "처리 완료" : "대기 중"}
                </span>
                <span className="text-gray-900 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ease-out ${
                    progress === 100 ? 'bg-green-500' : 'bg-blue-600 relative'
                  }`}
                  style={{ width: `${progress}%` }}
                >
                  {/* 실행 중일 때 반짝이는 애니메이션 효과 */}
                  {isRunning && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 시스템 로그 터미널 */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-800">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
              <Terminal size={20} className="text-gray-400" />
              <h3 className="text-gray-300 font-mono text-sm">System Log (Redis 연동)</h3>
            </div>
            <div className="font-mono text-sm space-y-2 min-h-[160px] flex flex-col justify-end">
              {logs.map((log, index) => (
                <div key={index} className={`
                  ${log.includes('[SUCCESS]') ? 'text-green-400' : ''}
                  ${log.includes('[WARNING]') || log.includes('[ERROR]') ? 'text-red-400' : ''}
                  ${log.includes('[BATCH]') ? 'text-blue-300' : ''}
                  ${log.includes('[SYSTEM]') ? 'text-gray-400' : ''}
                `}>
                  <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 우측: 인프라 상태 요약 (1칸 차지) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">인프라 모니터링</h2>
          
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-lg"><Database className="text-blue-600" size={24}/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">DB Connection</p>
              <p className="text-lg font-bold text-gray-900 mt-1">HikariCP (Active: 5)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-lg"><CheckCircle2 className="text-green-600" size={24}/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">로컬 AI (Ollama)</p>
              <p className="text-lg font-bold text-green-600 mt-1">정상 구동 중 (EEVE)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 p-3 rounded-lg"><AlertCircle className="text-orange-500" size={24}/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Skip / Retry 건수</p>
              <p className="text-lg font-bold text-gray-900 mt-1">0 건 (무결성 100%)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}