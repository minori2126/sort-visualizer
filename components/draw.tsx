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

	return (
		<div
		style={{
			width:'15px',
			height:'50px',
			backgroundColor:background,
			border:isHighlight?'3px solid red':'1px solid #333',
			marginRight:'1px',
			transition:'all 0.1s ease-out',
		}}>
		</div>
	);
};
