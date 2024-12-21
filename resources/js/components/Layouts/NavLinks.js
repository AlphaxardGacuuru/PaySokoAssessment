import React, { useEffect, useState } from "react"
import {
	Link,
	useLocation,
	useHistory,
} from "react-router-dom/cjs/react-router-dom.min"

import PersonSVG from "@/svgs/PersonSVG"
import HomeSVG from "@/svgs/HomeSVG"
import ProjectSVG from "@/svgs/ProjectSVG"
import ERPSVG from "@/svgs/ERPSVG"
import IssueSVG from "@/svgs/IssueSVG"
import SupplierSVG from "@/svgs/SupplierSVG"
import GoodSVG from "@/svgs/GoodSVG"
import InventorySVG from "@/svgs/InventorySVG"
import ServiceProviderSVG from "@/svgs/ServiceProviderSVG"
import SettingsSVG from "@/svgs/SettingsSVG"
import DocumentsSVG from "@/svgs/DocumentsSVG"
import PaperSVG from "@/svgs/PaperSVG"

const AdminNavLinks = (props) => {
	const location = useLocation()
	const history = useHistory()

	// Function for showing active color
	const active = (check) => {
		return (
			location.pathname.match(check) &&
			"rounded text-secondary bg-secondary-subtle mx-2"
		)
	}

	// Function for showing active color
	const activeStrict = (check) => {
		return (
			location.pathname == check &&
			"rounded text-secondary bg-secondary-subtle mx-2"
		)
	}

	return (
		<React.Fragment>
			{/* Home Link */}
			<li className="nav-item">
				<Link
					to={`/`}
					className={`nav-link my-1 ${activeStrict("/")}`}>
					<div className="nav-link-icon">
						<HomeSVG />
					</div>
					<div className="nav-link-text">Home</div>
				</Link>
			</li>
			{/* Home Link End */}
			{/* Products Link */}
			<li className="nav-item">
				<Link
					to={`/products`}
					className={`nav-link my-1 ${active("/products")}`}>
					<div className="nav-link-icon">
						<GoodSVG />
					</div>
					<div className="nav-link-text">Products</div>
				</Link>
			</li>
			{/* Products Link End */}
		</React.Fragment>
	)
}

export default AdminNavLinks
