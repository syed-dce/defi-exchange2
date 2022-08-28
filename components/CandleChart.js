import React, { useState, useEffect } from 'react'
import Chart from '@qognicafinance/react-lightweight-charts'

export default function CandleChart() {

	const [candleStickOptions, setCandleStickOptions] = useState({
		alignLabels: true,
		timeScale: {
		  rightOffset: 12,
		  barSpacing: 3,
		  fixLeftEdge: true,
		  lockVisibleTimeRangeOnResize: true,
		  rightBarStaysOnScroll: true,
		  borderVisible: false,
		  borderColor: "#fff000",
		  visible: true,
		  timeVisible: true,
		  secondsVisible: false
        	}
	});

	const [candleData, setCandleData] = useState([]);
	
	let candleCurrentJSONDataWS = null;
	let candleRealTimeDataQueue = [];
	let tempDateTime = null;

	useEffect(() => {
		getbinanceData();
	}, []);

	const getbinanceData = async () => {
		let binanceApiDataFetch = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=100');
		let response = await binanceApiDataFetch.json();
		candleRealTimeDataQueue = [];

		for (let i = 0; i < 100; i++) {
			let candleJsonData = {};
			tempDateTime = new Date(parseInt(response[i][0]));
			candleJsonData['time'] = tempDateTime.toString();
			candleJsonData['open'] = parseFloat(response[i][1]);
			candleJsonData['high'] = parseFloat(response[i][2]);
			candleJsonData['low'] = parseFloat(response[i][3]);
			candleJsonData['close'] = parseFloat(response[i][4]);

			candleRealTimeDataQueue.push(candleJsonData);
		}
		setCandleData(candleRealTimeDataQueue);
	}
 
	return (
		<Chart options={candleStickOptions} 
			candlestickSeries={[{
        			data: candleData
      			}]}
			width={700} height={420} />
	);
}
