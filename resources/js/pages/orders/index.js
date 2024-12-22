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
import GoodSVG from "@/svgs/GoodSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import Btn from "@/components/Core/Btn"

const index = (props) => {
	const [orders, setOrders] = useState([])

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Orders", path: ["orders"] })
	}, [])

	useEffect(() => {
		// Fetch Orders
		props.getPaginated(`orders`, setOrders)
	}, [])

	/*
	 * Delete Order
	 */
	const onDeleteOrder = (orderId) => {
		setLoading(true)

		Axios.delete(`/api/orders/${orderId}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setOrders({
					meta: orders.meta,
					links: orders.links,
					data: orders.data.filter((order) => order.id != orderId),
				})
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
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
							heading="Total Orders"
							data={orders.meta?.total}
						/>
						<HeroIcon>
							<GoodSVG />
						</HeroIcon>
						{/* Due End */}
					</div>
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Table */}
			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th>Order No</th>
							<th>Amount</th>
							<th>Status</th>
							<th>Created On</th>
							<th className="text-center">Action</th>
						</tr>
						{orders.data?.map((order, key) => (
							<tr key={key}>
								<td>{order.code}</td>
								<td className="text-success">
									<small>KES</small> {order.amount}
								</td>
								<td className="text-capitalize">
									<span
										className={`rounded 
											${
												order.status == "not_paid"
													? "bg-danger-subtle"
													: order.status == "partially_paid"
													? "bg-warning-subtle"
													: order.status == "paid"
													? "bg-success-subtle"
													: "bg-dark-subtle"
											}
										 py-1 px-3`}>
										{order.status
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</span>
								</td>
								<td>{order.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/orders/${order.id}/view`}
												icon={<ViewSVG />}
												className="me-1"
											/>
										</div>

										<div className="mx-1">
											<DeleteModal
												index={`order${key}`}
												model={order}
												modelName="Order"
												onDelete={onDeleteOrder}
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
					list={orders}
					getPaginated={props.getPaginated}
					setState={setOrders}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
