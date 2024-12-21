import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import Img from "@/components/Core/Img"

import ChevronUpSVG from "@/svgs/ChevronUpSVG"

const Footer = (props) => {
	const location = useLocation()

	const [isVisible, setIsVisible] = useState(false)
	
	// Show button when page is scrolled down to a certain point
	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true)
		} else {
			setIsVisible(false)
		}
	}

	// Set scroll event listener
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility)
		return () => {
			window.removeEventListener("scroll", toggleVisibility)
		}
	}, [])

	const onScroll = () => {
		// Smooth scroll to top
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})
	}

	const hide =
		location.pathname.match("/register") ||
		location.pathname.match("/login")
			? "d-none"
			: ""

	return (
		<React.Fragment>

			{isVisible && (
				<div
					id="scrollUpBtn"
					onClick={onScroll}>
					<ChevronUpSVG />
				</div>
			)}
		</React.Fragment>
	)
}

export default Footer
