import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"
import CartSVG from "@/svgs/CartSVG"
import CheckSVG from "@/svgs/CheckSVG"
import GoodSVG from "@/svgs/GoodSVG"
import InventorySVG from "@/svgs/InventorySVG"
import SalesSVG from "@/svgs/SalesSVG"
import React, { useEffect, useState } from "react"

const index = (props) => {
	const [products, setProducts] = useState([])

	const [loading, setLoading] = useState([])

	useEffect(() => {
		// Set page
		props.setPage({ name: "Products", path: ["products"] })
		props.get("products", setProducts, "products")
	}, [])

	const addToCart = (productId) => {
		setLoading([...loading, productId])

		Axios.post(`/api/cart`, { productId: productId })
			.then((res) => {
				// Remove loader
				setLoading(loading.filter((id) => id !== productId))
				props.setMessages([res.data.message])
				props.get("products", setProducts, "products")
				props.get("cart", props.setCart, "cart")
			})
			.catch((err) => {
				setLoading(loading.filter((id) => id !== productId))
				props.getErrors(err, true)
			})
	}

	const deleteFromCart = (productId) => {
		setLoading([...loading, productId])

		Axios.delete(`/api/cart/${productId}`)
			.then((res) => {
				// Remove loader
				setLoading(loading.filter((id) => id !== productId))
				props.setMessages([res.data.message])
				props.get("products", setProducts, "products")
				props.get("cart", props.setCart, "cart")
			})
			.catch((err) => {
				setLoading(loading.filter((id) => id !== productId))
				props.getErrors(err, true)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-12">
				<div className="d-flex flex-wrap">
					{/* Product List Start */}
					{products.length > 0 ? (<React.Fragment>
						{products.map((product, key) => (
							<div
								key={key}
								className="card m-1 p-1"
								style={{ width: "16em", height: "17em" }}>
								<Img
									src={product.thumbnail}
									className="rounded"
									style={{ width: "16em", height: "10em", objectFit: "cover" }}
								/>
								<h6
									className="text-nowrap text-clip text mt-1"
									style={{ maxWidth: "8em" }}>
									{product.name}
								</h6>
								<div className="d-flex justify-content-between my-1">
									<h6 className="text-success">KES {product.price}</h6>
									{/* Sales Start */}
									<h6>
										<span className="me-1">
											<InventorySVG />
										</span>
										{product.inventory}
									</h6>
									{/* Sales End */}
								</div>

								<hr className="m-2" />

								{/* Cart Start */}
								<Btn
									icon={
										product.inCart ? (
											<>
												<CartSVG />
												<span className="fs-5">
													<CheckSVG />
												</span>
											</>
										) : (
											<CartSVG />
										)
									}
									className={product.inCart ? "btn-2" : "btn-3"}
									onClick={() =>
										product.inCart
											? deleteFromCart(product.id)
											: addToCart(product.id)
									}
									loading={loading.includes(product.id)}
								/>
								{/* Cart End */}
							</div>
						))}
					</React.Fragment>) : (
						<h2>No products to display</h2>
					)}
					{/* Product List End */}
				</div>
			</div>
		</div>
	)
}

export default index
