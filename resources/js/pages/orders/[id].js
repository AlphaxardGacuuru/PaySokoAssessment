import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"

import PlusSVG from "@/svgs/PlusSVG"
import PrintSVG from "@/svgs/PrintSVG"
import Img from "@/components/Core/Img"

const show = (props) => {
	var { id } = useParams()

	const [order, setOrder] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({ name: "View Order", path: ["orders", "view"] })
		props.get(`orders/${id}`, setOrder)
	}, [])

	/*
	 * Print Practical Completion Certificate
	 */
	const printOrder = () => {
		var contentToPrint = document.getElementById("contentToPrint").innerHTML

		document.body.innerHTML = contentToPrint
		// Print
		window.print()
		// Reload
		window.location.reload()
	}

	return (
		<React.Fragment>
			{/*Create Link*/}
			<div className="d-flex justify-content-end mb-4">
				<Btn
					className="me-5"
					icon={<PrintSVG />}
					text="print"
					onClick={printOrder}
				/>
			</div>
			{/*Create Link End*/}

			<div
				id="contentToPrint"
				className="row mb-5">
				<div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
					<div className="card p-5">
						<div className="card-header border-0 d-flex justify-content-between">
							<div>
								<Img
									src="https://home.paysoko.com/wp-content/uploads/2024/08/Untitled-design-8-300x91.png"
									style={{ width: "10em", height: "auto" }}
								/>
							</div>

							<div>
								<h2 className="mb-0">ORDER</h2>
								<div className="p-2 text-center text-capitalize">
									<span
										className={`rounded 
											${
												order.status == "not_paid"
													? "bg-danger-subtle"
													: order.status == "partial"
													? "bg-warning-subtle"
													: order.status == "paid"
													? "bg-success-subtle"
													: "bg-dark-subtle"
											}
										 py-2 px-4`}>
										{order.status
											?.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</span>
								</div>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between mb-4">
								<div className="">
									<h5 className="mb-1">Order To</h5>
									<h6 className="mb-1">{order.userName}</h6>
								</div>
								<div className="text-end">
									<h5 className="text-muted">Order No: {order.id}</h5>
									<div className="text-muted">Date: {order.createdAt}</div>
								</div>
							</div>
							<div className="table-responsive-sm">
								<table className="table table-borderless bg-white">
									<thead className="border-bottom">
										<tr>
											<th>Name</th>
											<th className="text-end">Price</th>
										</tr>
									</thead>
									<tbody>
										{order.products?.map((product, key) => (
											<tr>
												<td className="text-capitalize">{product.name}</td>
												<td className="fw-normal text-end">
													<small className="fw-normal me-1">KES</small>
													{product.price}
												</td>
											</tr>
										))}
										<tr className="border-bottom border-top">
											<td className="fw-normal text-end">Total</td>
											<td className="fw-normal text-end">
												<small className="fw-normal me-1">KES</small>
												{order.amount}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<h4 className="text-center mb-5">Thank you for your Business!</h4>

						<div className="card-footer d-flex justify-content-end border-0">
							<div className="text-end">
								<h3 className="text-dark mb-1">
									<Img
										src="https://home.paysoko.com/wp-content/uploads/2024/08/Untitled-design-8-300x91.png"
										style={{ width: "6em", height: "auto" }}
									/>
								</h3>
								<div>Email: info@paysokosystems.com</div>
								<div>Phone: +1 866-603-7656</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default show
