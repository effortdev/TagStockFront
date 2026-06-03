import { useState, useEffect, useRef } from 'react';
import { Play, Square, Terminal, Cpu, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminBatch() {
  const navigate = useNavigate();
  const isAlerted = useRef(false);

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState(['[SYSTEM] 대기 중... 모니터링 시스템 가동 완료.']);
  
  // 🌟 백엔드에서 받아올 진짜 메타데이터 상태
  const [batchStats, setBatchStats] = useState({
    status: 'NONE',
    readCount: 0,
    writeCount: 0,
    skipCount: 0
  });

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

  // 🌟 가짜 애니메이션을 지우고, 2초마다 진짜 상태를 조회하는 로직(Polling)
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8080/api/v1/batch/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = res.data;
        setBatchStats({
          status: data.status || 'NONE',
          readCount: data.readCount || 0,
          writeCount: data.writeCount || 0,
          skipCount: data.skipCount || 0
        });

        // 상태에 따른 UI 처리
        if (data.status === 'COMPLETED') {
          setIsRunning(false);
          setProgress(100);
          setLogs(prev => prev.includes('[SUCCESS] 배치 완료') ? prev : [...prev.slice(-5), `[SUCCESS] 배치 완료 (처리: ${data.writeCount}건)`]);
        } else if (data.status === 'STARTED' || data.status === 'STARTING') {
          setIsRunning(true);
          setProgress(prev => prev >= 90 ? 90 : prev + 15); // 진행 중일 땐 게이지 증가 애니메이션 유지
        } else if (data.status === 'FAILED') {
          setIsRunning(false);
          setLogs(prev => prev.includes('[ERROR] 배치 실패') ? prev : [...prev.slice(-5), `[ERROR] 배치 실패 (Skip: ${data.skipCount}건)`]);
        }
      } catch (error) {
        console.error("상태 조회 에러", error);
      }
    };

    fetchStatus(); // 마운트 시 즉시 1회 실행
    const interval = setInterval(fetchStatus, 2000); // 2초마다 백엔드 찌르기
    return () => clearInterval(interval);
  }, []);

  const handleStartBatch = async () => {
    setIsRunning(true);
    setProgress(0);
    setLogs(prev => [...prev.slice(-5), '[SYSTEM] 서버에 배치 실행을 요청했습니다...']);

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/api/v1/batch/start', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("배치 실행 요청 실패", error);
      setLogs(prev => [...prev.slice(-5), '[ERROR] 서버와 통신할 수 없습니다.']);
      setIsRunning(false);
    }
  };

  const handleStopBatch = () => {
    // 실제 Spring Batch 강제 종료는 JobOperator가 필요하므로 프론트 UI만 변경
    setIsRunning(false);
    setLogs(prevLogs => [...prevLogs.slice(-5), '[WARNING] 중지 요청 전송됨 (현재 기능 미구현)']);
  };

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
        {/* 좌측: 제어 패널 & 터미널 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">일일 시세 분석 배치</h2>
                {/* 🌟 진짜 DB 상태 출력 */}
                <p className="text-sm font-semibold mt-1 text-blue-600">
                  현재 DB 상태: {batchStats.status}
                </p>
              </div>
              
              {!isRunning && progress !== 100 ? (
                <button onClick={handleStartBatch} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md">
                  <Play size={20} fill="currentColor" />
                  배치 수동 시작
                </button>
              ) : (
                <button onClick={handleStopBatch} disabled={progress === 100} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors shadow-md ${progress === 100 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                  <Square size={20} fill={progress === 100 ? "none" : "currentColor"} />
                  {progress === 100 ? '완료됨' : '강제 중지'}
                </button>
              )}
            </div>

            <div className="space-y-2 mt-8">
              <div className="flex justify-between text-sm font-medium">
                <span className={isRunning ? "text-blue-600 font-bold" : "text-gray-600"}>
                  {isRunning ? "데이터 분석 중..." : progress === 100 ? "처리 완료" : "대기 중"}
                </span>
                <span className="text-gray-900 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className={`h-4 rounded-full transition-all duration-500 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-blue-600 relative'}`} style={{ width: `${progress}%` }}>
                  {isRunning && <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-800">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
              <Terminal size={20} className="text-gray-400" />
              <h3 className="text-gray-300 font-mono text-sm">System Log (Real-time Polling)</h3>
            </div>
            <div className="font-mono text-sm space-y-2 min-h-[160px] flex flex-col justify-end">
              {logs.map((log, index) => (
                <div key={index} className={`${log.includes('[SUCCESS]') ? 'text-green-400' : ''} ${log.includes('[WARNING]') || log.includes('[ERROR]') ? 'text-red-400' : ''} ${log.includes('[BATCH]') ? 'text-blue-300' : ''} ${log.includes('[SYSTEM]') ? 'text-gray-400' : ''}`}>
                  <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우측: 인프라 상태 요약 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">실시간 처리 지표</h2>
          
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-lg"><Database className="text-blue-600" size={24}/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">DB 조회 (Read)</p>
              {/* 🌟 진짜 Read 데이터 */}
              <p className="text-lg font-bold text-gray-900 mt-1">{batchStats.readCount} 건</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-lg"><CheckCircle2 className="text-green-600" size={24}/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">AI 분석 완료 (Write)</p>
              {/* 🌟 진짜 Write 데이터 */}
              <p className="text-lg font-bold text-green-600 mt-1">{batchStats.writeCount} 건</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 p-3 rounded-lg"><AlertCircle className="text-orange-500" size={24}/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">에러/스킵 건수 (Skip)</p>
              {/* 🌟 진짜 Skip 데이터 */}
              <p className="text-lg font-bold text-gray-900 mt-1">{batchStats.skipCount} 건 무결성</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}