import React, { useEffect, useRef } from "react"

const Bar = (props) => {
	const ctx = useRef()

	/*
	 * Colors
	 */
	// "rgba(255, 99, 132, 1)", RED
	// "rgba(255, 159, 64, 1)", ORANGE
	// "rgba(255, 205, 86, 1)", YELLOW
	// "rgba(75, 192, 192, 1)", TEAL
	// "rgba(54, 162, 235, 1)", BLUE
	// "rgba(153, 102, 255, 1)", PURPLE
	// "rgba(201, 203, 207, 1)", GREY
	// "rgba(24, 135, 84, 1)", GREEN

	var delayed
	
	const config = {
		type: "bar",
		data: {
			labels: props.labels,
			datasets: props.datasets,
		},
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			animation: {
				onComplete: () => {
					delayed = true
				},
				delay: (context) => {
					let delay = 0
					if (
						context.type === "data" &&
						context.mode === "default" && !delayed
					) {
						delay = context.dataIndex * 300 + context.datasetIndex * 100
					}
					return delay
				},
			},
		},
	}

	useEffect(() => {
		new Chart(ctx.current, config)
	}, [])

	return (
		<div
			className="p-2"
			style={{ width: "100%", height: "auto" }}>
			<canvas ref={ctx}></canvas>
		</div>
	)
}

export default Bar
