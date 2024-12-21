import React, { useState } from "react"
import Img from "@/components/Core/Img"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const index = (props) => {
	return (
		<div
			className="row"
			style={{ minHeight: "100vh" }}>
			<div className="col-sm-12 text-center">
				<h1 className="my-5">Pay Soko Assessment</h1>

				<div className="">
					<Img
						src="https://home.paysoko.com/wp-content/uploads/2024/08/section3_1675639825-768x525.png"
						style={{ width: "30em", height: "auto" }}
					/>
				</div>
			</div>
		</div>
	)
}

export default index
