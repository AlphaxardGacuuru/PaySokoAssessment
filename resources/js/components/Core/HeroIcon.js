import React from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

const HeroIcon = ({ children }) => {
	const location = useLocation()

	return (
		<div
			className={`text-secondary fs-1 py-3 px-4 rounded-circle shadow glass`}>
			{children}
		</div>
	)
}

export default HeroIcon
