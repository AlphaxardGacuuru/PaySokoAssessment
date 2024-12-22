import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import CartSVG from "@/svgs/CartSVG"
import CheckSVG from "@/svgs/CheckSVG"
import InventorySVG from "@/svgs/InventorySVG"

const index = (props) => {
	const history = useHistory()

	const [loading, setLoading] = useState([])
	const [loading2, setLoading2] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Cart", path: ["cart"] })
		props.get("cart", props.setCart, "cart")
	}, [])

	const deleteFromCart = (productId) => {
		setLoading([...loading, productId])

		Axios.delete(`/api/cart/${productId}`)
			.then((res) => {
				// Remove loader
				setLoading(loading.filter((id) => id !== productId))
				props.setMessages([res.data.message])
				props.get("cart", props.setCart, "cart")
			})
			.catch((err) => {
				setLoading(loading.filter((id) => id !== productId))
				props.getErrors(err, true)
			})
	}

	const onOrder = () => {
		setLoading2(true)

		Axios.post(`/api/orders`)
			.then((res) => {
				// Remove loader
				setLoading2(false)
				props.setMessages([res.data.message])
				props.get("cart", props.setCart, "cart")
				setTimeout(() => history.push("/orders"), 1000)
			})
			.catch((err) => {
				setLoading2(false)
				props.getErrors(err, true)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-12">
				<div className="d-flex justify-content-end my-2">
					<Btn
						icon={<CheckSVG />}
						text="checkout"
						className="btn-1"
						onClick={onOrder}
						loading={loading2}
					/>
				</div>
				<div className="d-flex flex-wrap">
					{/* Cart List Start */}
					{props.cart.length > 0 ? (
						<React.Fragment>
							{props.cart.map((cartItem, key) => (
								<div
									key={key}
									className="card m-1 p-1"
									style={{ width: "16em", height: "17em" }}>
									<Img
										src={cartItem.thumbnail}
										className="rounded"
										style={{
											width: "16em",
											height: "10em",
											objectFit: "cover",
										}}
									/>
									<h6
										className="text-nowrap text-clip text mt-1"
										style={{ maxWidth: "8em" }}>
										{cartItem.name}
									</h6>
									<div className="d-flex justify-content-between my-1">
										<h6 className="text-success">KES {cartItem.price}</h6>
										{/* Sales Start */}
										<h6>
											<span className="me-1">
												<InventorySVG />
											</span>
											{cartItem.inventory}
										</h6>
										{/* Sales End */}
									</div>

									<hr className="m-2" />

									{/* Cart Start */}
									<Btn
										icon={
											<>
												<CartSVG />
												<span className="fs-5">
													<CheckSVG />
												</span>
											</>
										}
										className="btn-2"
										onClick={() => deleteFromCart(cartItem.id)}
										loading={loading.includes(cartItem.id)}
									/>
									{/* Cart End */}
								</div>
							))}
						</React.Fragment>
					) : (
						<h2 className="text-center text-muted w-100">No Items in Cart</h2>
					)}
					{/* Cart List End */}
				</div>
			</div>
		</div>
	)
}

export default index
