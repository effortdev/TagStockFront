import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StockList() {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        // 방금 로그인 화면에서 저장해둔 토큰을 꺼내옵니다.
        const token = localStorage.getItem('accessToken'); 

        axios.get('http://localhost:8080/api/v1/stocks?tag=#골든크로스임박', {
            headers: {
                Authorization: `Bearer ${token}` // 문지기에게 토큰 제출!
            }
        })
        .then(response => {
            setStocks(response.data);
        })
        .catch(error => {
            console.error("데이터 조회 실패", error);
        });
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
            <h2>📈 #골든크로스임박 추천 종목</h2>
            
            {stocks.map(stock => (
                <div key={stock.code} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{stock.name} <span style={{ fontSize: '0.8em', color: '#888' }}>{stock.code}</span></h3>
                    <p style={{ margin: '5px 0', fontSize: '1.2em', fontWeight: 'bold' }}>{stock.price}원</p>
                    <p style={{ margin: '5px 0', color: '#e11d48' }}>{stock.rate}</p>
                    <div style={{ marginTop: '10px' }}>
                        {stock.tags.map(tag => (
                            <span key={tag} style={{ marginRight: '8px', padding: '4px 8px', backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '12px', fontSize: '0.9em' }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}