'use client';

import React,{useState,useEffect,useRef} from 'react';
import {SortTile} from './draw';
import {
	bubbleSort_basic,
	bubbleSort_optimized,
	selectionSort,
	insertionSort,
	quickSort,
	random,
	asc,
	desc,
	step
} from '../utils/sort';

const N=50;
const speed=40;

export const SortVisualizer=()=>{
	const [array,setArray]=useState<number[]>(random(N));
	const [highlights,setHighlights]=useState<number[]>([]);
	const [isSorting,setIsSorting]=useState(false);
	const [status,setStatus]=useState("Ready");

	const generatorRef=useRef<Generator<step>|null>(null);

	const sorts=[
		'bubbleSort_basic',
		'bubbleSort_optimized',
		'selectionSort',
		'insertionSort',
		'quickSort',
	];

	const order=[
		'random',
		'asc',
		'desc'
	];
	
	const [selectedAlgorithm,setSelectedAlgorithm]=useState('bubbleSort_basic');
	const [selectedOrder,setSelectedOrder]=useState('random');

	const handleSelect=(name:string)=>{
		setSelectedAlgorithm(name);
	}
	const handleStart=()=>{
		if(isSorting)return;

		let A:number[];

		switch(selectedOrder){
			case 'asc':
				A=asc(N);
				break;
			case 'desc':
				A=desc(N);
				break;
			default:
				A=random(N);
				break;
		}

		setArray(A);

		let generatorFunc:((arr:number[])=>Generator<step>)|null=null;

		switch(selectedAlgorithm){
			case 'bubbleSort_basic':
				generatorFunc=bubbleSort_basic;
				break;
			case 'bubbleSort_optimized':
				generatorFunc=bubbleSort_optimized;
				break;
			case 'selectionSort':
				generatorFunc=selectionSort;
				break;
			case 'insertionSort':
				generatorFunc=insertionSort;
				break;
			case 'quickSort':
				generatorFunc=quickSort;
				break;
			default:
				return;
		}

		if(generatorFunc){
			generatorRef.current=generatorFunc(A.slice());
		}else{
			return;
		}

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
		<div style={{display:'flex',marginBottom:'15px'}}
		className="w-full aspect-[3/1] p-2 items-end justify-start overflow-hidden bg-state-200 dark:bg-black/20"
		>	
			{array.map((value,index)=>(
				<SortTile
					key={index}
					value={value}
					maxValue={N}
					isHighlight={highlights.includes(index)}
				/>
			))}
		</div>

		<div className="flex gap-2 sm:gap-3 p-3 flex-wrap pr-4">
			{sorts.map((algorithm)=>{
				const isSelected=algorithm===selectedAlgorithm;

				/*const classes="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg pl-4 pr-4";
				const color=isSelected?"bg-primary":"bg-state-200 dark:bg-[#282e39]";
				const text=isSelected?"text-white":"text-black black:text-white";*/

			   const buttonStyle: React.CSSProperties = {
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            border: isSelected ? '2px solid #135bec' : '1px solid #ccc',
            backgroundColor: isSelected ? '#e0f0ff' : '#f9f9f9',
            color: isSelected ? '#135bec' : '#333',
            fontWeight: isSelected ? 'bold' : 'normal',
            transition: 'background-color 0.2s',
            opacity: isSorting ? 0.6 : 1,
            pointerEvents: isSorting ? 'none' : 'auto',
        };

				return (
					<div key={algorithm}
					style={buttonStyle}
					onClick={()=>handleSelect(algorithm)}
					>
						<p className={`text-sm font-medium leading-normal`}>
							{algorithm}
						</p>
					</div>
				);
			})}
		</div>

		<div style={{marginBottom:20}}>
			<select id="order" value={selectedOrder} onChange={(e)=>setSelectedOrder(e.target.value)}>
				{order.map(o=>(
					<option key={o} value={o}>{o}</option>
				))}
			</select>
		</div>

		<button style={{border:'2px solid #ccc'}} onClick={handleStart} disabled={isSorting}>
			{isSorting?'実行中':'開始'}
		</button>
		<p>{status}</p>
		</div>
	);
};	

