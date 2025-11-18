'use client';

import React,{useState,useEffect,useRef} from 'react';
import {SortTile} from './draw';
import {bubbleSort_basic,random,step} from '../utils/sort';

const N=50;
const speed=50;

export const SortVisualizer=()=>{
	const [array,setArray]=useState<number[]>(random(N));
	const [highlights,setHighlights]=useState<number[]>([]);
	const [isSorting,setIsSorting]=useState(false);
	const [status,setStatus]=useState("Ready");

	const generatorRef=useRef<Generator<step>|null>(null);

	const handleStart=()=>{
		if(isSorting)return;

		const A=random(N);
		setArray(A);

		generatorRef.current=bubbleSort_basic(A.slice());

		setIsSorting(true);
		setStatus("Sorting...");
		setHighlights([]);
	};

	useEffect(()=>{
		if(!isSorting || !generatorRef.current)return;

		let timeoutId:NodeJS.Timeout;

		const animate=()=>{
			const next=generatorRef.current!.next();

			if(!next.done){
				const {array,highlight,status}=next.value;
				setArray(array);
				setHighlights(highlight);
				setStatus(status);
				timeoutId=setTimeout(animate,speed);
			}else{
				setIsSorting(false);
				setHighlights([]);
				setStatus("Finished");
			}
		};

		animate();

		return ()=>clearTimeout(timeoutId);

	},[isSorting]);

	return (
		<div>
		<div style={{display:'flex',marginBottom:'15px'}}>	
			{array.map((value,index)=>(
				<SortTile
					key={index}
					value={value}
					maxValue={N}
					isHighlight={highlights.includes(index)}
				/>
			))}
		</div>

		<button onClick={handleStart} disabled={isSorting}>
			{isSorting?'実行中':'開始'}
		</button>
		<p>{status}</p>
		</div>
	);
};	

