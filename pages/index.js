import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler} from 'chart.js';
import CandleChart from '../components/CandleChart';

ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler
)

export default function Home() {

	const delay = 1500;
	var currentPrice = null;

	const [cryptoData, setCryptoData] = useState(1);
	const [priceDelta, setPriceDelta] = useState('black');
	const [realTimeDataQueueState, setRealTimeDataQueueState] = useState([]);
	const [data, setData]= useState(null);

	var realTimeDataQueue = [];
	var lastPriceFLoat = cryptoData;

	useEffect(() => {
		let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
		ws.onmessage = (event) => {
			currentPrice = JSON.parse(event.data);

		}

		return () => {
			ws.close();
		}
	}, []);

	setInterval(() => {
		if(currentPrice === null) {
			return;
		}

		var currentPriceFloat = parseFloat(currentPrice.p);
		// lastPriceFLoat = cryptoData;

		setCryptoData(cryptoData => currentPriceFloat);
		realTimeDataQueue.push(currentPriceFloat);

		if ( realTimeDataQueue.length > 6) {
			realTimeDataQueue.shift();
		}
		setRealTimeDataQueueState(realTimeDataQueue);

		if (currentPriceFloat > lastPriceFLoat) {
			setPriceDelta('green');
		} else if (currentPriceFloat < lastPriceFLoat) {
			setPriceDelta('red');
		} else {
			setPriceDelta('black');
		}
		lastPriceFLoat = currentPriceFloat;


	}, delay);


  	return (
    		<div className={styles.container}>
      			<Head>
				<title>Create Next App</title>
				<meta name="description" content="LIVE BTC - USD crypto data" />
				<link rel="icon" href="/favicon.ico" />
      			</Head>

      			<main className={styles.main}>
				
				<div>
					<h2>
						<div style={{margin: '25px'}}>
						{cryptoData}
						{ priceDelta === 'green' ? <FaCaretUp size={45} color='green'/> : <></> }
						{ priceDelta === 'red' ? <FaCaretDown size={45} color='red' /> : <></> }
						</div>
					</h2>
					<div className="App" style={{width:'350px', height:'300px', margin: '15px'}}>
						<Line 
							data={{
								labels: ["5s ago", "4s ago", "3s ago", "2s ago", "1s ago", "Current Price"],
								datasets: [
									{
										label: 'BTC - USD LIVE',
										backgroundColor: 'rgba(75,192,192,1)',
										borderColor: 'rgba(0,0,0,1)',
										borderWidth: 2,
										data: realTimeDataQueueState
									}
								]
							}}
							options={{
								       legend: {
									 display: false
								       },
								       scales: {
									 yAxes: [{
									   display: true,
									   ticks: {
									      max: 30000,
									      min: 10000,
									      stepSize: 3
									    }
									  }]
									 },

							}}
						/>
					</div>
				</div>
				<div>
					<h1>BTC - USD  Intraday</h1>
					<CandleChart />
				</div>	
      			</main>
    		</div>
  	)
}
