import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"
import CartSVG from "@/svgs/CartSVG"
import GoodSVG from "@/svgs/GoodSVG"
import SalesSVG from "@/svgs/SalesSVG"
import React, { useEffect, useState } from "react"

const index = (props) => {
	const [products, setProducts] = useState([])

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		props.get("products", setProducts, "products")
	}, [])

	const addToCart = (id) => {
		setLoading(true)

		Axios.post(`/api/cart`, { productId: productId })
			.then((res) => {
				// Remove loader
				setLoading(false)
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err, true)
			})
	}
	return (
		<div className="row">
			<div className="col-sm-12">
				<div className="d-flex flex-wrap">
					{/* Product List Start */}
					{products.map((product, key) => (
						<div
							key={key}
							className="card m-1 p-1"
							style={{ width: "15em", height: "17em" }}>
							<Img
								src={product.thumbnail}
								className="rounded"
								style={{ width: "15em", height: "10em", objectFit: "cover" }}
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
										<SalesSVG />
									</span>
									{product.sales}
								</h6>
								{/* Sales End */}
							</div>

							<hr className="m-2" />

							{/* Cart Start */}
							<Btn
								icon={<CartSVG />}
								className="btn-success"
								onClick={() => addToCart(product.id)}
								loading={loading}
							/>
							{/* Cart End */}
						</div>
					))}
					{/* Product List End */}
				</div>
			</div>
		</div>
	)
}

export default index
