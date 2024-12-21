import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import Btn from "@/components/Core/Btn"

const index = (props) => {
	const [payments, setPayments] = useState([])

	const [tenant, setTenant] = useState("")
	const [unit, setUnit] = useState("")
	const [propertyId, setPropertyId] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	const [properties, setProperties] = useState([])

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Payments", path: ["payments"] })
		// Fetch Properties
		props.get(
			`properties/by-user-id/${props.auth.id}?idAndName=true`,
			setProperties
		)
	}, [])

	useEffect(() => {
		// Fetch Payments
		props.getPaginated(
			`payments/by-property-id/${props.auth.propertyIds}?
			tenant=${tenant}&
			unit=${unit}&
			propertyId=${propertyId}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setPayments
		)
	}, [tenant, unit, propertyId, startMonth, endMonth, startYear, endYear])

	/*
	 * Delete Payment
	 */
	const onDeletePayment = (paymentId) => {
		setLoading(true)
		var paymentIds = Array.isArray(paymentId) ? paymentId.join(",") : paymentId

		Axios.delete(`/api/payments/${paymentIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setPayments({
					meta: payments.meta,
					links: payments.links,
					data: payments.data.filter((payment) => {
						if (Array.isArray(paymentId)) {
							return !paymentIds.includes(payment.id)
						} else {
							return payment.id != paymentId
						}
					}),
				})
				// Clear DeleteIds
				setDeleteIds([])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
				// Clear DeleteIds
				setDeleteIds([])
			})
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm mb-2 p-2">
				<div className="d-flex justify-content-between">
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Total */}
						<HeroHeading
							heading="Total"
							data={
								<span>
									<small>KES</small> {payments.sum}
								</span>
							}
						/>
						<HeroIcon>
							<PaymentSVG />
						</HeroIcon>
						{/* Total End */}
					</div>
				</div>
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="card shadow-sm px-4 pt-4 pb-3 mb-2">
				<div className="d-flex flex-wrap">
					{/* Tenant */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							type="text"
							placeholder="Search by Tenant"
							className="form-control"
							onChange={(e) => setTenant(e.target.value)}
						/>
					</div>
					{/* Tenant End */}
					{/* Unit */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							type="text"
							placeholder="Search by Unit"
							className="form-control"
							onChange={(e) => setUnit(e.target.value)}
						/>
					</div>
					{/* Unit End */}
					{/* Properties */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							name="property"
							className="form-control text-capitalize"
							onChange={(e) => setPropertyId(e.target.value)}
							required={true}>
							<option value="">Filter by Property</option>
							{properties.map((property, key) => (
								<option
									key={key}
									value={property.id}>
									{property.name}
								</option>
							))}
						</select>
					</div>
					{/* Properties End */}
				</div>
			</div>

			<div className="card shadow-sm py-2 px-4">
				<div className="d-flex justify-content-end flex-wrap">
					<div className="d-flex flex-grow-1">
						{/* Start Date */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Start At</label>
							{/* Start Month */}
							<select
								className="form-control"
								onChange={(e) => setStartMonth(e.target.value)}>
								<option value="">Select Month</option>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{month}
									</option>
								))}
							</select>
						</div>
						{/* Start Month End */}
						{/* Start Year */}
						<div className="flex-grow-1 me-2 mb-2">
							<label
								htmlFor=""
								className="invisible">
								Start At
							</label>
							<select
								className="form-control"
								onChange={(e) => setStartYear(e.target.value)}>
								<option value="">Select Year</option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						{/* Start Year End */}
					</div>
					{/* Start Date End */}
					{/* End Date */}
					<div className="d-flex flex-grow-1">
						{/* End Month */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">End At</label>
							<select
								className="form-control"
								onChange={(e) => setEndMonth(e.target.value)}>
								<option value="">Select Month</option>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{month}
									</option>
								))}
							</select>
						</div>
						{/* End Month End */}
						{/* End Year */}
						<div className="flex-grow-1 me-2 mb-2">
							<label
								htmlFor=""
								className="invisible">
								End At
							</label>
							<select
								className="form-control"
								onChange={(e) => setStartYear(e.target.value)}>
								<option value="">Select Year</option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						{/* End Year End */}
					</div>
					{/* End Date End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			{/* Table */}
			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Tenant</th>
							<th>Unit</th>
							<th>Invoice No</th>
							<th>Channel</th>
							<th>Transaction Reference</th>
							<th>Amount</th>
							<th>Paid On</th>
							<th className="text-center">Action</th>
						</tr>
						{payments.data?.map((payment, key) => (
							<tr key={key}>
								<td>{props.iterator(key, payments)}</td>
								<td>{payment.tenantName}</td>
								<td>{payment.unitName}</td>
								<td>{payment.invoiceId}</td>
								<td>{payment.channel}</td>
								<td>{payment.transactionReference}</td>
								<td className="text-success">
									<small>KES</small> {payment.amount}
								</td>
								<td>{payment.paidOn}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/invoices/${payment.invoiceId}/show`}
											icon={<ViewSVG />}
											text="view invoice"
											className="me-1"
										/>

										<MyLink
											linkTo={`/payments/${payment.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`payment${key}`}
												model={payment}
												modelName="Payment"
												onDelete={onDeletePayment}
											/>
										</div>
									</div>
								</td>
							</tr>
						))}
					</thead>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={payments}
					getPaginated={props.getPaginated}
					setState={setPayments}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
