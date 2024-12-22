import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"
import EditSVG from "@/svgs/EditSVG"

const create = (props) => {
	var history = useHistory()

	const types = ["rent", "water", "service_charge"]

	const [properties, setProperties] = useState([])
	const [tenants, setTenants] = useState([])

	const [type, setType] = useState()
	const [propertyId, setPropertyId] = useState()
	const [userUnitIds, setUserUnitIds] = useState([])
	const [month, setMonth] = useState(props.previousMonth)
	const [year, setYear] = useState(props.currentYear)
	const [loading, setLoading] = useState()

	// Get Invoices
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Invoice",
			path: ["invoices", "create"],
		})

		// Fetch Properties
		props.get(
			`properties/by-user-id/${props.auth.id}?idAndName=true`,
			setProperties
		)
		// Fetch Tenants
		props.get(
			`tenants/by-property-id/${props.auth.propertyIds}?idAndName=true`,
			setTenants
		)
	}, [])

	/*
	 * Handle UserUnit selects
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

		if (showServiceChargeError()) {
			setLoading(false)
			return props.setMessages(["Property has no Service Charge"])
		}

		Axios.post("/api/invoices", {
			userUnitIds: userUnitIds,
			type: type,
			month: month,
			year: year,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Check if readings saved
				if (res.data.message.match("successfully")) {
					// Redirect to Invoices
					setTimeout(() => history.push(`/admin/invoices`), 500)
				}
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	const showServiceChargeError = () => {
		var serviceCharge = properties.find(
			(property) => property.id == propertyId
		)?.serviceCharge

		var noServiceCharge = serviceCharge < 1

		if (type == "service_charge" && noServiceCharge) {
			return true
		} else {
			return false
		}
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					{/* No Service Charge Error */}
					{showServiceChargeError() && (
						<React.Fragment>
							<h4 className="bg-warning-subtle text-center mb-2 p-2">
								{properties.find((property) => property.id == propertyId).name}{" "}
								doesn't have Service Charge!
							</h4>

							<MyLink
								linkTo={`/properties/${propertyId}/edit`}
								icon={<EditSVG />}
								text="add service charge"
								className="btn-sm w-100 mb-2"
							/>
						</React.Fragment>
					)}
					{/* No Service Charge Error End */}

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
								value={type}>
								{type
									.split("_")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ")}
							</option>
						))}
					</select>
					{/* Type End */}

					{/* Properties */}
					<select
						name="property"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setPropertyId(e.target.value)}
						required={true}>
						<option value="">Select Property</option>
						{properties.map((property, key) => (
							<option
								key={key}
								value={property.id}>
								{property.name}
							</option>
						))}
					</select>
					{/* Properties End */}

					<h6 className="text-center mb-2">
						{userUnitIds.length} tenants selected
					</h6>

					{/* Tenants */}
					<div className="d-flex">
						<select
							name="userUnitId"
							className="form-control mb-2 me-2"
							onChange={(e) => {
								if (e.target.value == "all") {
									setUserUnitIds(
										tenants
											.filter((tenant) => tenant.propertyId == propertyId)
											.map((tenant) => tenant.userUnitId)
									)
								} else {
									handleUserUnitIds(Number.parseInt(e.target.value))
								}
							}}
							disabled={userUnitIds.length > 0}
							required={true}>
							<option value="">Select Tenant</option>
							{/* Show option "All" if propertyId is selected */}
							{propertyId && <option value="all">All</option>}

							{tenants
								.filter((tenant) => tenant.propertyId == propertyId)
								.map((tenant, key) => (
									<option
										key={key}
										value={tenant.userUnitId}
										className="text-primary"
										selected={tenant.userUnitId == userUnitIds[0]}>
										{tenant.name} - {tenant.unitName}
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
								{tenants
									.filter((tenant) => tenant.propertyId == propertyId)
									.map((tenant, key2) => (
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

					<div className="d-flex justify-content-start mb-2">
						{/* Month */}
						<select
							className="form-control me-2"
							onChange={(e) => setMonth(e.target.value)}
							required={true}>
							{props.months.map((month, key) => (
								<option
									key={key}
									value={key}
									selected={key == props.previousMonth}>
									{month}
								</option>
							))}
						</select>
						{/* Month End */}

						{/* Year */}
						<select
							className="form-control"
							onChange={(e) => setYear(e.target.value)}>
							{props.years.map((year, key) => (
								<option
									key={key}
									value={year}
									selected={key == props.currentYear}>
									{year}
								</option>
							))}
						</select>
						{/* Year End */}
					</div>

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="create invoices"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
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

export default create
