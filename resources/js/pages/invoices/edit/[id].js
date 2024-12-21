import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"

const edit = (props) => {
	var { id } = useParams()
	var history = useHistory()

	const [invoice, setInvoice] = useState({})
	const [tenants, setTenants] = useState([])

	const types = ["rent", "water", "service"]

	const [userUnitIds, setUserUnitIds] = useState([])
	const [type, setType] = useState()
	const [loading, setLoading] = useState()

	// Get Invoices
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Invoice",
			path: ["invoices", "edit"],
		})

		// Fetch Invoice
		Axios.get(`api/invoices/${id}`)
			.then((res) => {
				setInvoice(res.data.data)
			})
			.catch(() => props.getErrors([`Failed to fetch Unit ${id}`]))

		// Fetch Tenants
		props.auth.propertyIds.forEach((id) => {
			Axios.get(`api/tenants/by-property-id/${id}`).then((res) => {
				setTenants([...tenants, ...res.data.data])
			})
		})
	}, [])

	/*
	 * Handle Instructor selects
	 */
	const handleUserUnitIds = (id) => {
		if (id) {
			var exists = userUnitIds.includes(id)

			var newUserUnitIds = exists
				? userUnitIds.filter((item) => item != id)
				: [...userUnitIds, id]

			setUserUnitIds(newUserUnitIds)
		}
	}

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/invoices/${id}`, {
			userUnitIds: userUnitIds,
			type: type,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					{/* Type */}
					<select
						type="text"
						name="type"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setType(e.target.value)}
						required={true}>
						<option value="">Select Invoice Type</option>
						{types.map((type, key) => (
							<option
								key={key}
								value={type}
								selected={type == invoice.type}>
								{type}
							</option>
						))}
					</select>
					{/* Type End */}

					<div className="d-flex">
						{/* Tenants */}
						<select
							name="userUnitId"
							className="form-control mb-2 me-2"
							onChange={(e) => {
								if (e.target.value == "all") {
									setUserUnitIds(tenants.map((tenant) => tenant.userUnitId))
								} else {
									handleUserUnitIds(Number.parseInt(e.target.value))
								}
							}}
							disabled={userUnitIds.length > 0}
							required={true}>
							<option value="">Select Tenant</option>
							<option value="all">All</option>
							{tenants.map((tenant, key) => (
								<option
									key={key}
									value={tenant.userUnitId}
									className="text-primary"
									selected={tenant.userUnitId == userUnitIds[0]}>
									{tenant.name}
								</option>
							))}
						</select>
						{/* Close Icon */}
						<span
							className="text-primary"
							style={{ cursor: "pointer" }}
							onClick={() => setUserUnitIds(userUnitIds.slice(0, 0))}>
							<CloseSVG />
						</span>
						{/* Close Icon End */}
					</div>

					{userUnitIds.map((input, key1) => (
						<div
							className="d-flex"
							key={key1}>
							<select
								name="userUnitId"
								className="form-control mb-2 me-2"
								onChange={(e) =>
									handleUserUnitIds(Number.parseInt(e.target.value))
								}
								disabled={userUnitIds.length > key1 + 1}>
								<option value="">Select Tenant</option>
								{tenants.map((tenant, key2) => (
									<option
										key={key2}
										value={
											!userUnitIds.includes(tenant.userUnitId) &&
											tenant.userUnitId
										}
										className={
											userUnitIds.includes(tenant.userUnitId)
												? "text-secondary"
												: "text-primary"
										}
										selected={tenant.userUnitId == userUnitIds[key1 + 1]}>
										{tenant.name}
									</option>
								))}
							</select>
							{/* Close Icon */}
							<span
								className={
									key1 == userUnitIds.length - 1
										? "invisible text-primary"
										: "text-primary"
								}
								style={{ cursor: "pointer" }}
								onClick={() =>
									setUserUnitIds(
										userUnitIds.filter((userUnitId, index) => index != key1 + 1)
									)
								}>
								<CloseSVG />
							</span>
							{/* Close Icon End */}
						</div>
					))}
					{/* Tenants End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update invoice"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/invoices`}
							icon={<BackSVG />}
							text="back to invoices"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
