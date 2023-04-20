import style from "./Scrollbar.module.css";

type Props = {
	display: boolean, //
	size: number,     // 视口垂直尺寸÷页面垂直尺寸
	position: number, // 视口底部垂直坐标÷页面垂直尺寸
};

function Scrollbar ( props: Props ) {

	return (
		<div class={ style.track }>
			<span class={ style.thumb } style={ createStyle() } />
		</div>
	);

	function createStyle () {

		const display = props.display ? "initial" : "none";
		const size = clamp( props.size, 0, 1 ) * 100 + "%";
		const position = clamp( props.position, 0, 1 ) * 100 + "%";

		return { "display": display, "block-size": size, "top": position };

	}

	function clamp ( num: number, min: number, max: number ) {

		let newNum = num;

		newNum = Math.min( newNum, max );
		newNum = Math.max( newNum, min );

		return newNum;

	}

}

export default Scrollbar;
