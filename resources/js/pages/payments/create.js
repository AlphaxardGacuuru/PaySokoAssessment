import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"

const create = (props) => {
	var { id } = useParams()

	var history = useHistory()

	const [amount, setAmount] = useState()
	const [channel, setChannel] = useState()
	const [transactionReference, setTransactionReference] = useState()
	const [paidOn, setPaidOn] = useState()
	const [loading, setLoading] = useState()

	const channels = ["Bank", "Mpesa"]

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Add Payment",
			path: ["payments", "create"],
		})
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/payments", {
			invoiceId: id,
			channel: channel,
			transactionReference: transactionReference,
			amount: amount,
			paidOn: paidOn,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Payments
				setTimeout(() => history.push(`/admin/payments`), 500)
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
					{/* Channel */}
					<select
						type="text"
						name="type"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setChannel(e.target.value)}
						required={true}>
						<option value="">Select Payment Channel</option>
						{channels.map((channel, key) => (
							<option
								key={key}
								value={channel}>
								{channel}
							</option>
						))}
					</select>
					{/* Channel End */}

					{/* Amount */}
					<label htmlFor="">Amount</label>
					<input
						type="number"
						min="1"
						placeholder="20000"
						className="form-control mb-2"
						onChange={(e) => setAmount(e.target.value)}
					/>
					{/* Amount End */}

					{/* Transaction Reference */}
					<label htmlFor="">Transaction Reference</label>
					<input
						type="text"
						placeholder="ITHX23939950CV"
						className="form-control mb-2"
						onChange={(e) => setTransactionReference(e.target.value)}
					/>
					{/* Transaction Reference End */}

					{/* Paid On */}
					<label htmlFor="">Paid On</label>
					<input
						type="date"
						className="form-control mb-2"
						onChange={(e) => setPaidOn(e.target.value)}
					/>
					{/* Paid On End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add payment"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/payments`}
							icon={<BackSVG />}
							text="back to payments"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
