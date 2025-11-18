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

export const asc=(N:number):number[]=>{
	const data=Array.from({length:N},(_,i)=>i+1);
	return data;
}

export const desc=(N:number):number[]=>{
	return Array.from({length:N},(_,i)=>i+1).reverse();
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

export function* bubbleSort_optimized(arr:number[]):Generator<step>{
	const A=arr.slice();
	let n=A.length;

	for(let i=0;i<n;i++){
	let f=true;
		for(let j=0;j<n-1-i;j++){
			yield{array:A.slice(),highlight:[j,j+1],status:'comparing'};
			if(A[j]>A[j+1]){
				[A[j],A[j+1]]=[A[j+1],A[j]];
				yield{array:A.slice(),highlight:[],status:'swapped'};
				f=false;
			}
		}

		if(f){
			yield{array:A.slice(),highlight:[],status:'finished'};
			return;
		}
	}
	yield{array:A.slice(),highlight:[],status:'finished'};
}

export function* selectionSort(arr:number[]):Generator<step>{
	const A=arr.slice();
	let n=A.length;

	for(let i=0;i<n;i++){
		let min_index=i;
		for(let j=i+1;j<n;j++){
			yield{array:A.slice(),highlight:[j,min_index],status:'comparing'};
			if(A[j]<A[min_index]){
				min_index=j;
			}
		}
		if(min_index!=i){
			[A[i],A[min_index]]=[A[min_index],A[i]];
			yield{array:A.slice(),highlight:[i,min_index],status:'swapped'};
		}
	}
	yield{array:A.slice(),highlight:[],status:'finished'};
}

export function* insertionSort(arr:number[]):Generator<step>{
	const A=arr.slice();
	let n=A.length;

	for(let i=1;i<n;i++){
		let temp=A[i];
		let j;
		for(j=i-1;j>=0;j--){
			yield{array:A.slice(),highlight:[j+1,j],status:'comparing'};
			if(A[j]>temp){
				A[j+1]=A[j];
				yield{array:A.slice(),highlight:[j+1],status:'swapped'};
				if(j==0){
					A[j]=temp;
					break;
				}
			}else{
				A[j+1]=temp;
				break;
			}
		}
	}
	yield{array:A.slice(),highlight:[],status:'finished'};
}

export function* partition(arr:number[],left:number,right:number):Generator<step,number>{
	const A=arr;

	let k=Math.floor((left+right)/2);
	let pivotValue=A[k];

	[A[k],A[right]]=[A[right],A[k]];
	yield{array:A.slice(),highlight:[k,right],status:'swapped'};

	let i=left;
	let j=right-1;

	while(i<=j){
		while(A[i]<A[right]){
			yield{array:A.slice(),highlight:[i,right],status:'comparing'};
			i++;
		}

		while(A[j]>=A[right]&&j>=i){
			yield{array:A.slice(),highlight:[j,right],status:'comparing'};
			j--;
		}

		if(i<j){
			[A[i],A[j]]=[A[j],A[i]];
			yield{array:A.slice(),highlight:[i,j],status:'swapped'};
			i++;
			j--;
		}
	}

	[A[i],A[right]]=[A[right],A[i]];
	yield{array:A.slice(),highlight:[i],status:'finished'};

	return i;
}

export function* quickSort(arr:number[]):Generator<step>{
	const A=arr.slice();
	const n=A.length;

	const stack:[number,number][]=[[0,n-1]];

	while(stack.length>0){
		const [left,right]=stack.pop()!;

		if(left>=right)continue;

		const partitionGenerator=partition(A,left,right);
		let pivot:number|undefined;

		while(true){
			const next = partitionGenerator.next();
			if(!next.done){
				yield next.value;
			}else{
				pivot=next.value;
				break;
			}
		}

		if(left<pivot!-1){
			stack.push([left,pivot!-1]);
		}
		if(pivot!+1<right){
			stack.push([pivot!+1,right]);
		}
	}
	yield{array:A.slice(),highlight:[],status:'finished'};
}
