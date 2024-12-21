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
import InvoiceSVG from "@/svgs/InvoiceSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import Btn from "@/components/Core/Btn"

const index = (props) => {
	const [invoices, setInvoices] = useState([])

	const [tenant, setTenant] = useState("")
	const [unit, setUnit] = useState("")
	const [type, setType] = useState("")
	const [status, setStatus] = useState("")
	const [propertyId, setPropertyId] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	const [properties, setProperties] = useState([])
	const statuses = ["pending", "partially_paid", "paid", "overpaid"]
	const types = ["rent", "water", "service_charge"]

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Invoices", path: ["invoices"] })
		// Fetch Properties
		props.get(
			`properties/by-user-id/${props.auth.id}?idAndName=true`,
			setProperties
		)
	}, [])

	useEffect(() => {
		// Fetch Invoices
		props.getPaginated(
			`invoices/by-property-id/${props.auth.propertyIds}?
			tenant=${tenant}&
			unit=${unit}&
			type=${type}&
			status=${status}&
			propertyId=${propertyId}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setInvoices
		)
	}, [
		tenant,
		unit,
		type,
		status,
		propertyId,
		startMonth,
		endMonth,
		startYear,
		endYear,
	])

	/*
	 * Handle DeleteId checkboxes
	 */
	const handleSetDeleteIds = (invoiceId) => {
		var exists = deleteIds.includes(invoiceId)

		var newDeleteIds = exists
			? deleteIds.filter((item) => item != invoiceId)
			: [...deleteIds, invoiceId]

		setDeleteIds(newDeleteIds)
	}

	/*
	 * Delete Invoice
	 */
	const onDeleteInvoice = (invoiceId) => {
		setLoading(true)
		var invoiceIds = Array.isArray(invoiceId) ? invoiceId.join(",") : invoiceId

		Axios.delete(`/api/invoices/${invoiceIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setInvoices({
					meta: invoices.meta,
					links: invoices.links,
					data: invoices.data.filter((invoice) => {
						if (Array.isArray(invoiceId)) {
							return !invoiceIds.includes(invoice.id)
						} else {
							return invoice.id != invoiceId
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
					{/* Total */}
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Due */}
						<HeroHeading
							heading="Due"
							data={
								<span>
									<small>KES</small> {invoices.due}
								</span>
							}
						/>
						<HeroIcon>
							<InvoiceSVG />
						</HeroIcon>
						{/* Due End */}
						{/* Paid */}
						<HeroHeading
							heading="Paid"
							data={
								<span>
									<small>KES</small> {invoices.paid}
								</span>
							}
						/>
						<HeroIcon>
							<PaymentSVG />
						</HeroIcon>
						{/* Paid End */}
						{/* Balance */}
						<HeroHeading
							heading="Balance"
							data={
								<span>
									<small>KES</small> {invoices.balance}
								</span>
							}
						/>
						<HeroIcon>
							<BalanceSVG />
						</HeroIcon>
						{/* Balance End */}
					</div>
				</div>
				{/* Total End */}
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
					{/* Type */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setType(e.target.value)}
							required={true}>
							<option value="">Filter by Type</option>
							{types.map((type, key) => (
								<option
									key={key}
									value={type}>
									{type
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</option>
							))}
						</select>
					</div>
					{/* Type End */}
					{/* Status */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							type="text"
							name="status"
							className="form-control text-capitalize"
							onChange={(e) => setStatus(e.target.value)}
							required={true}>
							<option value="">Filter by Status</option>
							{statuses.map((status, key) => (
								<option
									key={key}
									value={status}>
									{status
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</option>
							))}
						</select>
					</div>
					{/* Status End */}
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
							<th colSpan="11"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									{deleteIds.length > 0 && (
										<Btn
											text={`delete ${deleteIds.length}`}
											className="me-2"
											onClick={() => onDeleteInvoice(deleteIds)}
											loading={loading}
										/>
									)}

									<MyLink
										linkTo={`/invoices/create`}
										icon={<PlusSVG />}
										text="create invoice"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th>
								<input
									type="checkbox"
									checked={
										deleteIds.length == invoices.data?.length &&
										deleteIds.length != 0
									}
									onClick={() =>
										setDeleteIds(
											deleteIds.length == invoices.data.length
												? []
												: invoices.data.map((invoice) => invoice.id)
										)
									}
								/>
							</th>
							<th>Invoice No</th>
							<th>Tenant</th>
							<th>Unit</th>
							<th>Type</th>
							<th>Month</th>
							<th>Year</th>
							<th>Amount</th>
							<th>Paid</th>
							<th>Balance</th>
							<th>Status</th>
							<th className="text-center">Action</th>
						</tr>
						{invoices.data?.map((invoice, key) => (
							<tr key={key}>
								<td>
									<input
										type="checkbox"
										checked={deleteIds.includes(invoice.id)}
										onClick={() => handleSetDeleteIds(invoice.id)}
									/>
								</td>
								{/* <td>{props.iterator(key, invoices)}</td> */}
								<td>{invoice.id}</td>
								<td>{invoice.tenantName}</td>
								<td>{invoice.unitName}</td>
								<td className="text-capitalize">
									{invoice.type
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</td>
								<td className="text-capitalize">
									{props.months[invoice.month]}
								</td>
								<td>{invoice.year}</td>
								<td className="text-success">
									<small>KES</small> {invoice.amount}
								</td>
								<td className="text-success">
									<small>KES</small> {invoice.paid}
								</td>
								<td className="text-success">
									<small>KES</small> {invoice.balance}
								</td>
								<td className="text-capitalize">
									<span
										className={`
											${
												invoice.status == "not_paid"
													? "bg-danger-subtle"
													: invoice.status == "partially_paid"
													? "bg-warning-subtle"
													: invoice.status == "paid"
													? "bg-success-subtle"
													: "bg-dark-subtle"
											}
										 py-1 px-3`}>
										{invoice.status
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</span>
								</td>
								<td>
									<div className="d-flex justify-content-center">
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/invoices/${invoice.id}/show`}
												icon={<ViewSVG />}
												className="me-1"
											/>
										</div>

										<div className="mx-1">
											<DeleteModal
												index={`invoice${key}`}
												model={invoice}
												modelName="Invoice"
												onDelete={onDeleteInvoice}
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
					list={invoices}
					getPaginated={props.getPaginated}
					setState={setInvoices}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
