import React, { Component } from 'react';
import './App.css';

const input_function_list = [
	function add1(x) { return x },
	function add2(x, y) { return x + y },
	function add3(x, y, z) { return x + y + z },
]

//These expression areas can be nested inside each other recursively
class ExpressionArea extends Component {
	state = {
		ifunc: undefined
	}

	onDragOver = (event) => {
		event.preventDefault()
	}

	onDrop = (event) => {
		//Get the index of the function that was dropped onto us
		this.setState({ ifunc : event.dataTransfer.getData('ifunc') })

		//If there are any ExpressionArea components underneath this one, we don't want them to also change
		event.stopPropagation()
	}

	render() {
		var expression_area_contents = <></>
		if (this.state.ifunc) {
			const func = input_function_list[this.state.ifunc]
			const arg_count = func.length
			expression_area_contents = (
				<>
					<div
						className='Expression-Area'
					>
						{func.name}
					</div>
			
					{/*Generate arg_count recursive ExpressionArea's each with the given ZIndex*/}
					{Array(arg_count).fill(this.props.ZIndex).map((ZIndex, iexpression_area) => (
						<ExpressionArea
							key={String(ZIndex) + ',' + String(iexpression_area)}
							ZIndex={ZIndex + 1}
						/>
					))}
				</>
			)
		}
		return (
			<div
				className='Expression-Area'
				style={{
					'zIndex' : String(this.props.ZIndex)
				}}
				onDragOver={this.onDragOver}
				onDrop={this.onDrop}
			>
				{expression_area_contents}
			</div>
		)
	}
}

class FunctionList extends Component {
	state = {
		funcs: input_function_list,
	}

	onDragStart = (event, ifunc) => {
		//Communicate the index of the function to an expressionarea if dropped into
		event.dataTransfer.setData('ifunc', ifunc)
	}

	render() {
		return (
			<div>
				{input_function_list.map((func, ifunc) => (
					<div
						key={String(ifunc)}
						className='Function-List-Item'
						onDragStart={(event) => this.onDragStart(event, ifunc)}
						draggable
					>
						{func.name}
					</div>
				))}
			</div>
		)
	}
}

class App extends Component {
	render() {
		return (
			<div className='Top-Level'>
				<div style={{ width : '1200px', height : '480px' }}>
					<ExpressionArea ZIndex={0} />
				</div>
				<div style={{ height : '10px'}}></div>
				<FunctionList />
			</div>
		)
	}
}

export default App;
