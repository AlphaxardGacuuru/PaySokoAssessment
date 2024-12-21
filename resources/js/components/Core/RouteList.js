import React from "react"
import { Route } from "react-router-dom"

import Index from "@/pages/index"

import Nav from "@/components/Layouts/Nav"

import Products from "@/pages/products/index"

import Invoices from "@/pages/invoices/index"
import InvoiceCreate from "@/pages/invoices/create"
import InvoiceView from "@/pages/invoices/[id]"
import InvoiceEdit from "@/pages/invoices/edit/[id]"

import Payments from "@/pages/payments/index"
import PaymentCreate from "@/pages/payments/create"
import PaymentEdit from "@/pages/payments/edit/[id]"

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
			path: "/invoices",
			component: <Invoices {...GLOBAL_STATE} />,
		},
		{
			path: "/invoices/create",
			component: <InvoiceCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/invoices/:id/view",
			component: <InvoiceView {...GLOBAL_STATE} />,
		},
		{
			path: "/invoices/:id/edit",
			component: <InvoiceEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/payments",
			component: <Payments {...GLOBAL_STATE} />,
		},
		{
			path: "/payments/:id/create",
			component: <PaymentCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/payments/:id/edit",
			component: <PaymentEdit {...GLOBAL_STATE} />,
		},
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
