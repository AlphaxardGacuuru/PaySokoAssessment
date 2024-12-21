import React, { useState, useEffect } from "react"
import { Link, useLocation, useHistory } from "react-router-dom"

// import TopNavLinks from "./TopNavLinks"
import Img from "@/components/Core/Img"

import CloseSVG from "@/svgs/CloseSVG"
import LogoutSVG from "@/svgs/LogoutSVG"
import DownloadSVG from "@/svgs/DownloadSVG"
import PrivacySVG from "@/svgs/PrivacySVG"
import SettingsSVG from "@/svgs/SettingsSVG"
import StudioSVG from "@/svgs/StudioSVG"
import MenuSVG from "@/svgs/MenuSVG"
import PersonSVG from "@/svgs/PersonSVG"
import DiscoverSVG from "@/svgs/DiscoverSVG"
import HomeSVG from "@/svgs/HomeSVG"
import LogoSVG from "@/svgs/LogoSVG"

const TopNav = (props) => {
	const location = useLocation()
	const router = useHistory()

	// const { logout } = useAuth({ setLogin: props.setLogin })
	const [menu, setMenu] = useState("")
	const [bottomMenu, setBottomMenu] = useState("")
	const [notificationMenu, setNotificationMenu] = useState("")
	const [avatarVisibility, setAvatarVisibility] = useState("none")
	const [notifications, setNotifications] = useState([])

	useEffect(() => {
		// Fetch Notifications
		props.get("notifications", setNotifications)
	}, [])

	const logout = () => {
		Axios.post(`/logout`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove phone from localStorage
				localStorage.clear()
				// Redirect to Dashboard
				router.push(`/`)
				// Reload
				window.location.reload()
			})
			.catch((err) => {
				props.getErrors(err)
				// Remove phone from localStorage
				localStorage.clear()
				// Redirect to Dashboard
				router.push(`/`)
				// Reload
				window.location.reload()
			})
	}

	const onNotification = () => {
		Axios.put(`/api/notifications/update`).then((res) => {
			// Update notifications
			props.get("notifications", setNotifications)
		})
	}

	const onDeleteNotifications = (id) => {
		// Clear the notifications array
		setNotifications([])

		Axios.delete(`/api/notifications/${id}`).then((res) => {
			// Update Notifications
			props.get("notifications", setNotifications)
		})
	}

	// Hide TopNav from various pages
	const display =
		location.pathname.match("/404") ||
		location.pathname.match("/socialite") ||
		location.pathname.match("/login") ||
		location.pathname.match("/register")
			? "d-none"
			: ""

	// Function for showing active color
	const active = (check) => {
		return (
			location.pathname.match(check) &&
			"rounded-end-pill text-secondary bg-secondary-subtle"
		)
	}

	// Show Admin Nav based on Location
	const showTopNav =
		!location.pathname.match("/student/") &&
		!location.pathname.match("/admin/") &&
		!location.pathname.match("/instructor/")
			? "d-block"
			: "d-none"

	return (
		<>
			<div
				id="MyElement"
				className={`${menu} ${showTopNav}`}>
				{/* <!-- ***** Header Area Start ***** --> */}
				<header
					style={{
						backgroundColor: "#000000",
						// boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 1)",
					}}
					className="header-area">
					<div className="container-fluid p-0">
						<div className="row">
							<div
								className="col-12"
								style={{ padding: "0" }}>
								<div className="menu-area d-flex justify-content-between">
									{/* <!-- Logo Area  --> */}
									<div className="logo-area">
										<Link
											to="/"
											className="text-white">
											<Img
												src="/storage/img/logo.svg"
												style={{ width: "8em", height: "auto" }}
											/>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</header>
				<br />
				<br />
				{/* Remove for profile page for better background image */}
				{location.pathname.match(/profile/) ? (
					<br className="hidden" />
				) : (
					<span>
						<br />
						<br className="hidden" />
					</span>
				)}
			</div>

			{/* Sliding Bottom Nav */}
			<div className={bottomMenu}>
				<div className="bottomMenu">
					<div className="d-flex align-items-center justify-content-between border-bottom border-dark">
						<div></div>
						{/* <!-- Close Icon --> */}
						<div
							className="closeIcon float-end mr-3"
							style={{ fontSize: "0.8em" }}
							onClick={() => setBottomMenu("")}>
							<CloseSVG />
						</div>
					</div>

					{/* Avatar Bottom */}
					<div
						className="m-0 p-0"
						style={{ display: avatarVisibility }}>
						<Link
							to={`/profile/show/${props.auth?.username}`}
							style={{ padding: "0px", margin: "0px" }}
							className="border-bottom text-start"
							onClick={() => setBottomMenu("")}>
							<div className="d-flex">
								<div className="ms-3 me-3">
									<Img
										src={props.auth?.avatar}
										className="rounded-circle"
										width="25px"
										height="25px"
										alt="Avatar"
									/>
								</div>
								<div>
									<h5>
										{props.auth?.name} <small>{props.auth?.username}</small>
									</h5>
								</div>
							</div>
						</Link>
						<Link
							to="/download"
							className="p-3 text-start"
							style={{
								display: props.downloadLink ? "inline" : "none",
								textAlign: "left",
							}}
							onClick={() => setBottomMenu("")}>
							<h6>
								<span className="ms-3 me-4">
									<DownloadSVG />
								</span>
								Get App
							</h6>
						</Link>
						<Link
							to="/video"
							className="p-3 text-start"
							onClick={() => setBottomMenu("")}>
							<h6>
								<span className="ms-3 me-4">
									<StudioSVG />
								</span>
								Studio
							</h6>
						</Link>
						<Link
							to="/settings"
							className="p-3 text-start"
							onClick={() => setBottomMenu("")}>
							<h6>
								<span className="ms-3 me-4">
									<SettingsSVG />
								</span>
								Settings
							</h6>
						</Link>
						<Link
							to="/privacy"
							className="p-3 text-start"
							onClick={() => setBottomMenu("")}
							title="Privacy Policy">
							<h6>
								<span className="ms-3 me-4">
									<PrivacySVG />
								</span>
								Privacy Policy
							</h6>
						</Link>
						<Link
							to="#"
							className="p-3 text-start"
							onClick={(e) => {
								e.preventDefault()
								setBottomMenu("")
								logout()
							}}>
							<h6>
								<span className="ms-3 me-4">
									<LogoutSVG />
								</span>
								Logout
							</h6>
						</Link>
					</div>
					{/* Avatar Bottom End */}
				</div>
			</div>
			{/* Sliding Bottom Nav End */}

			{/* Sliding Notifications Nav */}
			<div className={notificationMenu}>
				<div className="commentMenu">
					<div className="d-flex align-items-center justify-content-between border-bottom border-dark">
						<div
							className="text-white ms-2 fw-lighter"
							onClick={() => {
								setNotificationMenu("")
								onDeleteNotifications(0)
							}}>
							Clear
						</div>
						<div className="dropdown-header text-white pt-2">
							<h5>Notifications</h5>
						</div>
						{/* <!-- Close Icon --> */}
						<div
							className="closeIcon float-end me-2"
							style={{ fontSize: "0.8em" }}
							onClick={() => setNotificationMenu("")}>
							<CloseSVG />
						</div>
					</div>

					{/* Bottom Notifications */}
					<div className="m-0 p-0">
						<div style={{ maxHeight: "500px", overflowY: "scroll" }}>
							{/* Get Notifications */}
							{notifications.map((notification, key) => (
								<Link
									key={key}
									to={notification.url}
									className="p-2"
									style={{
										display: "block",
										textAlign: "left",
									}}
									onClick={() => {
										setNotificationMenu("")
										onDeleteNotifications(notification.id)
									}}>
									<small>{notification.message}</small>
								</Link>
							))}
						</div>
					</div>
					{/* Bottom Notifications End */}
				</div>
			</div>
			{/* Sliding Notifications Nav End */}
		</>
	)
}

export default TopNav
