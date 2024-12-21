import React, { useEffect } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { Tooltip } from "bootstrap" // Import Bootstrap's Tooltip

const Btn = ({
	btnStyle,
	className,
	icon,
	text,
	onClick,
	loading,
	dataBsToggle,
	dataBsTarget,
	tooltipText, // Add tooltipText prop
}) => {
	const location = useLocation()

	// Initialize the tooltip after the component renders
	useEffect(() => {
		const tooltipTriggerList = [].slice.call(
			document.querySelectorAll('[data-bs-toggle="tooltip"]')
		)
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new Tooltip(tooltipTriggerEl)
		})
	}, [])

	return (
		<button
			style={btnStyle}
			className={`mysonar-btn btn-2 ${className}`}
			onClick={onClick}
			disabled={loading}
			data-bs-toggle={dataBsToggle}
			data-bs-target={dataBsTarget}
			title={tooltipText}
		>
			<span style={{ color: "inherit" }}>{icon}</span>
			{text && (
				<span
					className="mx-1"
					style={{ color: "inherit" }}>
					{text}
				</span>
			)}
			{loading && (
				<div
					id="sonar-load"
					style={{ bottom: "0" }}></div>
			)}
		</button>
	)
}

Btn.defaultProps = {
	loading: false,
	disabled: false,
}

export default Btn
