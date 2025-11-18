const color=(value:number,maxValue:number):string=>{
	const L=80-(value-1)/(maxValue-1)*80+10;
	//const H=H*60;
	return `hsl(${240},70%,${L}%)`;
};

interface Tile{
	value: number;
	maxValue:number;
	sort:number;
	isHighlight:boolean;
}

export const SortTile=({value,maxValue,sort,isHighlight}:Tile)=>{
	const background=color(value,maxValue,sort);

	const width=100/maxValue;
	return (
		<div
		style={{
			backgroundColor:background,
			border:isHighlight?'2px solid red':'2px solid transparent',
			transition:'all 0.1s ease-out',
			width:`${width}%`,
			height:'100%'
		}}
		className="w-full flex-1 self-end"
		>

		</div>
	);
};
