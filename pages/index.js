import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {

	const [cryptoData, setCryptoData] = useState(0);

	useEffect(() => {
		let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
		ws.onmessage = (event) => {
			let temp = JSON.parse(event.data);
			// console.log(temp.p)
			setCryptoData(temp.p)
		}
	}, []);


  	return (
    		<div className={styles.container}>
      			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
      			</Head>

      			<main className={styles.main}>
				<h1>BTC - USD LIVE</h1>
				<h2>{cryptoData}</h2>
      			</main>
    		</div>
  	)
}
