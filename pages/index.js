import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler} from 'chart.js';

ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler
)

export default function Home() {

	const delay = 1500;
	let currentPrice = null;

	const [cryptoData, setCryptoData] = useState(0);
	const [priceDelta, setPriceDelta] = useState('black');
	const [realTimeDataQueueState, setRealTimeDataQueueState] = useState([]);
	const [data, setData]= useState(null);

	var realTimeDataQueue = [];

	useEffect(() => {
		let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
		ws.onmessage = (event) => {
			currentPrice = JSON.parse(event.data);

		}
	}, []);

	setInterval(() => {
		if(currentPrice === null) {
			return;
		}

		let currentPriceFloat = parseFloat(currentPrice.p);
		let lastPriceFLoat = cryptoData;
		setCryptoData(currentPriceFloat);
		realTimeDataQueue.push(currentPriceFloat);

		if ( realTimeDataQueue.length > 4) {
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
	}, delay);


  	return (
    		<div className={styles.container}>
      			<Head>
				<title>Create Next App</title>
				<meta name="description" content="LIVE BTC - USD crypto data" />
				<link rel="icon" href="/favicon.ico" />
      			</Head>

      			<main className={styles.main}>
				<h1>BTC - USD LIVE</h1>
				<h2>
					{cryptoData}
					{ priceDelta === 'green' ? <FaCaretUp size={45} color='green'/> : <></> }
					{ priceDelta === 'red' ? <FaCaretDown size={45} color='red' /> : <></> }
				</h2>

				<div className="App" style={{width:'800px', height:'800px'}}>
				<Line 
					data={{
						labels: ["T-3", "T-2", "Last Price", "Current Price"],
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
							      stepValue: 3
							    }
							  }]
							 },

						}}
					/>
				    </div>
				
      			</main>
    		</div>
  	)
}
