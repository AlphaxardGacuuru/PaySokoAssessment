import React from "react"
import { Route } from "react-router-dom"

import Index from "@/pages/index"

import Nav from "@/components/Layouts/Nav"

import Products from "@/pages/products/index"

import Cart from "@/pages/cart/index"

import Orders from "@/pages/orders/index"
import OrderCreate from "@/pages/orders/create"
import OrderView from "@/pages/orders/[id]"
import OrderEdit from "@/pages/orders/edit/[id]"

const RouteList = ({ GLOBAL_STATE }) => {
	const routes = [
		{
			path: "/",
			component: <Index {...GLOBAL_STATE} />,
		},
		{
			path: "/products",
			component: <Products {...GLOBAL_STATE} />,
		},
		{
			path: "/cart",
			component: <Cart {...GLOBAL_STATE} />,
		},
		{
			path: "/orders",
			component: <Orders {...GLOBAL_STATE} />,
		},
		{
			path: "/orders/create",
			component: <OrderCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/orders/:id/view",
			component: <OrderView {...GLOBAL_STATE} />,
		},
		{
			path: "/orders/:id/edit",
			component: <OrderEdit {...GLOBAL_STATE} />,
		}
	]

	return (
		<React.Fragment>
			<Nav {...GLOBAL_STATE}>
				{/* Landing Page routes */}
				{routes.map((route, key) => (
					<Route
						key={key}
						path={route.path}
						exact
						render={() => route.component}
					/>
				))}
				{/* Landing Page routes End */}
			</Nav>
		</React.Fragment>
	)
}

export default RouteList
