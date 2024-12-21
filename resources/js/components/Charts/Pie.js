import React, { useEffect, useRef } from "react"

const Pie = (props) => {
	const ctx = useRef()

	var delayed

	const config = {
		type: "pie",
		options: {
			radius: "100%",
			animation: {
				onComplete: () => {
					delayed = true
				},
				delay: (context) => {
					let delay = 0
					if (
						context.type === "data" &&
						context.mode === "default" &&
						!delayed
					) {
						delay = context.dataIndex * 300 + context.datasetIndex * 100
					}
					return delay
				},
			},
		},
		data: {
			labels: props.labels,
			datasets: props.datasets,
		},
	}

	useEffect(() => {
		new Chart(ctx.current, config)
	}, [])

	return (
		<div
			className="p-2"
			style={{ width: props.size, height: props.size }}>
			<canvas ref={ctx}></canvas>
		</div>
	)
}

Pie.defaultProps = {
	cutout: "60%",
	size: "20em",
}

export default Pie
