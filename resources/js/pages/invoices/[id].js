import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"

import PlusSVG from "@/svgs/PlusSVG"
import PrintSVG from "@/svgs/PrintSVG"

const show = (props) => {
	var { id } = useParams()

	const [invoice, setInvoice] = useState({})
	const [tenants, setTenants] = useState([])

	useEffect(() => {
		// Set page
		props.setPage({ name: "View Invoice", path: ["invoices", "view"] })
		props.get(`invoices/${id}`, setInvoice)
	}, [])

	return (
		<React.Fragment>
			{/*Create Link*/}
			<div className="d-flex justify-content-end mb-4">
				<MyLink
					className="me-2"
					linkTo={`/payments/${id}/create`}
					icon={<PlusSVG />}
					text="add payment"
				/>

				<MyLink
					className="me-2"
					linkTo={`/credit-notes/${id}/create`}
					icon={<PlusSVG />}
					text="create credit note"
				/>

				<Btn
					className="me-5"
					icon={<PrintSVG />}
					text="print"
					onClick="printInvoice()"
				/>
			</div>
			{/*Create Link End*/}

			<div
				id="contentToPrint"
				className="row mb-5">
				<div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
					<div className="card p-5">
						<div className="card-header bg-white border-0 d-flex justify-content-between">
							<h2 className="text-dark mb-1">Black Property</h2>

							<div>
								<h2 className="mb-0">INVOICE</h2>
								<div className="p-2 text-center text-capitalize">
									<span
										className={`
											${
												invoice.status == "not_paid"
													? "bg-danger-subtle"
													: invoice.status == "partial"
													? "bg-warning-subtle"
													: invoice.status == "paid"
													? "bg-success-subtle"
													: "bg-dark-subtle"
											}
										 py-2 px-4`}>
										{invoice.status
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
									<h5 className="mb-1">Billed To</h5>
									<div className="text-muted">Tenant: {invoice.tenantName}</div>
									<div className="text-muted">Unit: {invoice.unitName}</div>
									<div className="text-muted">Phone: {invoice.tenantPhone}</div>
									<div className="text-muted">Email: {invoice.tenantEmail}</div>
								</div>
								<div className="text-end">
									<h5 className="text-muted">Invoice No: {invoice.id}</h5>
									<div className="text-muted">Date: {invoice.createdAt}</div>
								</div>
							</div>
							<div className="table-responsive-sm">
								<table className="table table-borderless bg-white">
									<thead className="border-bottom">
										<tr>
											<th>Type</th>
											{invoice.type == "water" && <th>Reading</th>}
											{invoice.type == "water" && <th>Usage</th>}
											<th>Month</th>
											<th className="text-end">Amount</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="text-capitalize">
												{invoice.type
													?.split("_")
													.map(
														(word) =>
															word.charAt(0).toUpperCase() + word.slice(1)
													)
													.join(" ")}
											</td>
											{invoice.type == "water" && (
												<td>{invoice.waterReading}</td>
											)}
											{invoice.type == "water" && <td>{invoice.waterUsage}</td>}
											<td>{props.months[invoice.month]}</td>
											<td className="fw-normal text-end">
												<small className="fw-normal me-1">KES</small>
												{invoice.amount}
											</td>
										</tr>
										<tr className="border-bottom border-top">
											<td colSpan={invoice.type == "water" ? 3 : 0}></td>
											<td className="fw-normal text-end">Total</td>
											<td className="fw-normal text-end">
												<small className="fw-normal me-1">KES</small>
												{invoice.amount}
											</td>
										</tr>
										<tr className="border-bottom border-top">
											<td colSpan={invoice.type == "water" ? 3 : 0}></td>
											<td className="fw-normal text-end">Amount Paid</td>
											<td className="fw-normal text-end">
												<small className="fw-normal me-1">KES</small>
												{invoice.paid}
											</td>
										</tr>
										<tr className="border-bottom border-top">
											<td colSpan={invoice.type == "water" ? 3 : 0}></td>
											<td className="fw-normal text-end">Balance</td>
											<td className="fw-normal text-end">
												<small className="fw-normal me-1">KES</small>
												{invoice.balance}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<h4 className="text-center mb-2">Thank you for your tenancy!</h4>

						<div className="card-footer d-flex justify-content-end bg-white border-0">
							<div className="text-end">
								<h3 className="text-dark mb-1">Black Property</h3>
								<div>Email: al@black.co.ke</div>
								<div>Phone: +254 700 364446</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default show
