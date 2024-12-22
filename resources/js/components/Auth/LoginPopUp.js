import React, { useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import CryptoJS from "crypto-js"

import Btn from "@/components/Core/Btn"

import CloseSVG from "@/svgs/CloseSVG"
import BackSVG from "@/svgs/BackSVG"
import ForwardSVG from "@/svgs/ForwardSVG"

const LoginPopUp = (props) => {
	const history = useHistory()
	const location = useLocation()

	const [isRegistering, setIsRegistering] = useState()

	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [confirmPassword, setConfirmPassword] = useState()

	const [loading, setLoading] = useState(false)

	// Encrypt Token
	const encryptedToken = (token) => {
		const secretKey = "PaySokoAuthorizationToken"
		// Encrypt
		return CryptoJS.AES.encrypt(token, secretKey).toString()
	}

	/*
	 * Fetch
	 */
	const fetchAuth = (token) => {
		Axios.get("api/auth", { Authorization: `Bearer ${token}` })
			.then((res) => props.setAuth(res.data.data))
			.catch((err) => props.getErrors(err))
	}

	const onRegister = (e) => {
		setLoading(true)
		e.preventDefault()

		Axios.get("/sanctum/csrf-cookie").then(() => {
			Axios.post(`/register`, {
				name: name,
				email: email,
				password: password,
				password_confirmation: confirmPassword,
				device_name: "computer",
			})
				.then((res) => {
					props.setMessages([res.data.message])
					// Remove loader
					setLoading(false)
					// Encrypt and Save Sanctum Token to Local Storage
					props.setLocalStorage("sanctumToken", encryptedToken(res.data.data))
					// Update Logged in user
					Axios.get("/api/auth", {
						headers: { Authorization: `Bearer ${res.data.data}` },
					})
						.then((res) => {
							// Set LocalStorage
							props.setLocalStorage("auth", res.data.data)
							// Reload page
							// window.location.href = `/#/instructor`
							window.location.reload()
						})
						.catch((err) => props.getErrors(err, false))
				})
				.catch((err) => {
					// Remove loader
					setLoading(false)
					props.getErrors(err)
				})
		})
	}

	const onLogin = (e) => {
		setLoading(true)
		e.preventDefault()

		Axios.get("/sanctum/csrf-cookie").then(() => {
			Axios.post(`/login`, {
				email: email,
				password: password,
				device_name: "deviceName",
				remember: "checked",
			})
				.then((res) => {
					props.setMessages([res.data.message])
					// Update Logged in user
					fetchAuth(res.data.data)
					// Remove loader
					setLoading(false)
					// Encrypt and Save Sanctum Token to Local Storage
					props.setLocalStorage("sanctumToken", encryptedToken(res.data.data))
					// Update Logged in user
					props.get(`auth`, props.setAuth, "auth", false)
					// Reload page
					setTimeout(() => window.location.reload(), 1000)
				})
				.catch((err) => {
					// Remove loader
					setLoading(false)
					props.getErrors(err)
				})
		})
	}

	const blur = props.auth.name == "Guest"

	return (
		<div className={blur ? "menu-open" : ""}>
			<div
				className="background-blur"
				style={{ visibility: blur ? "visible" : "hidden" }}></div>
			<div className="bottomMenu glass">
				<div className="d-flex align-items-center justify-content-between">
					{/* <!-- Logo Area --> */}
					<div className="logo-area p-2">
						<a
							href="#"
							className="text-dark">
							{isRegistering ? "Register" : "Login"}
						</a>
					</div>
					{/* <!-- Close Icon --> */}
					<div
						className="closeIcon float-end"
						style={{ fontSize: "1em" }}
						onClick={() => {
							props.setLogin(false)
							// Check location to index
							history.push("/")
						}}>
						<CloseSVG />
					</div>
				</div>
				<div className="p-2">
					<center>
						<div className="mycontact-form">
							<form onSubmit={isRegistering ? onRegister : onLogin}>
								{isRegistering ? (
									<div>
										{/* Name Start */}
										<input
											type="text"
											placeholder="Your Name"
											className="form-control mb-2"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
										{/* Name End */}

										{/* Email Start */}
										<input
											type="text"
											name="email"
											placeholder="Your Email"
											className="form-control mb-2"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											autoComplete="email"
										/>
										{/* Email End */}

										{/* Password Start */}
										<input
											type="password"
											placeholder="Your Password"
											className="form-control mb-2"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{/* Password End */}

										{/* Password Confirmation Start */}
										<input
											type="password"
											placeholder="Confirm Your Password"
											className="form-control mb-2"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
										{/* Password Confirmation End */}

										{/* Login Button Start */}
										<Btn
											type="submit"
											className="mt-2 w-75"
											text="Register"
											loading={loading}
										/>
										{/* Login Button End */}

										{/* Login Button Start */}
										<Btn
											type="submit"
											icon={<ForwardSVG />}
											className="mt-2 w-75"
											text="Login"
											onClick={() => setIsRegistering(!isRegistering)}
										/>
										{/* Login Button End */}
									</div>
								) : (
									<div>
										{/* Email Start */}
										<input
											id="email"
											type="text"
											className="form-control mb-2"
											name="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required={true}
											autoFocus
										/>
										{/* Email End */}

										{/* Password Start */}
										<input
											type="password"
											placeholder="Your Password"
											className="form-control mb-2"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{/* Password End */}

										{/* Login Button Start */}
										<Btn
											type="submit"
											className="mt-2 w-75"
											text="Login"
											loading={loading}
										/>
										{/* Login Button End */}

										<Btn
											type="submit"
											icon={<BackSVG />}
											className="mt-2 w-75"
											text="Register"
											onClick={() => setIsRegistering(!isRegistering)}
										/>
									</div>
								)}
							</form>
						</div>
					</center>
				</div>
			</div>
		</div>
	)
}

export default LoginPopUp
