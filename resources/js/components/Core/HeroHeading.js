import React from "react"

const HeroHeading = ({ heading, data }) => {
	return (
		<div>
			<h4>{heading}</h4>
			<span className="fs-4">{data}</span>
		</div>
	)
}

export default HeroHeading
