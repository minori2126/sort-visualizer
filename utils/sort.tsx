export interface step{
	array: number[];
	highlight: number[];
	status: 'comparing' | 'swapped' | 'finished';
}

export const random=(N:number):number[]=>{
	const data = Array.from({length:N},(_,i)=>i+1);

	for(let i=data.length - 1; i>0; i--){
		const j=Math.floor(Math.random()*(i+1));
		[data[i],data[j]]=[data[j],data[i]];
	}
	return data;
}

export function* bubbleSort_basic(arr:number[]):Generator<step>{
	const A = arr.slice();
	let n=A.length;

	for(let i=0;i<n;i++){
		for(let j=0;j<n-i-1;j++){
			yield{array:A.slice(),highlight:[j,j+1],status:'comparing'};
			if(A[j]>A[j+1]){
				[A[j],A[j+1]]=[A[j+1],A[j]];
				yield{array:A.slice(),highlight:[],status:'swapped'};
			}
		}
	}
	yield{array:A.slice(),highlight:[],status:'finished'};
}
