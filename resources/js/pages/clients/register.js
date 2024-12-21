import React, { useEffect, useState } from "react"
import {
	Link,
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"
import CryptoJS from "crypto-js"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"
import BackSVG from "@/svgs/BackSVG"

const register = (props) => {
	var { id } = useParams()
	var history = useHistory()

	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [phone, setPhone] = useState()
	const [location, setLocation] = useState()
	const [password, setPassword] = useState()
	const [passwordConfirmation, setPasswordConfirmation] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Add Client", path: ["clients", "register"] })
	}, [])

	// Encrypt Token
	const encryptedToken = (token) => {
		const secretKey = "MarcusMilesAuthorizationToken"
		// Encrypt
		return CryptoJS.AES.encrypt(token, secretKey).toString()
	}

	/*
	 * Fetch
	 */
	const fetchAuth = (token) => {
		Axios.get("api/auth", { Authorization: `Bearer ${token}` })
			.then((res) => {
				props.setAuth(res.data.data)
				// Redirect
				setTimeout(
					() => history.push(`/admin/erp/clients/${res.data.data.id}/view`),
					1000
				)
			})
			.catch((err) => props.getErrors(err))
	}

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		setLoading(true)
		e.preventDefault()

		Axios.get("/sanctum/csrf-cookie").then(() => {
			Axios.post(`/register`, {
				name: name,
				email: email,
				password: password,
				password_confirmation: passwordConfirmation,
				phone: phone,
				location: location,
				device_name: "deviceName",
				remember: "checked",
			})
				.then((res) => {
					props.setMessages([res.data.message])
					// Remove loader
					setLoading(false)
					// Encrypt and Save Sanctum Token to Local Storage
					props.setLocalStorage("sanctumToken", encryptedToken(res.data.data))
					// Update Logged in user
					fetchAuth(res.data.data)
				})
				.catch((err) => {
					// Remove loader
					setLoading(false)
					props.getErrors(err)
				})
		})
	}

	return (
		<React.Fragment>
			<div className="text-center mt-5 pt-5 px-1">
				<h1>Welcome to Marcus Miles</h1>
				<h2>Create an Account</h2>
			</div>
			<div className="row">
				<div className="col-sm-4"></div>
				<div className="col-sm-4 p-4">
					<form
						onSubmit={onSubmit}
						className="my-5">
						{/* Name Start */}
						<label htmlFor="">Name</label>
						<input
							type="text"
							name="name"
							placeholder="John Doe"
							className="form-control mb-2 me-2"
							onChange={(e) => setName(e.target.value)}
							required={true}
						/>
						{/* Name End */}

						{/* Email Start */}
						<label htmlFor="">Email</label>
						<input
							type="text"
							placeholder="johndoe@gmail.com"
							className="form-control mb-2 me-2"
							onChange={(e) => setEmail(e.target.value)}
							required={true}
						/>
						{/* Email End */}

						{/* Phone Start */}
						<label htmlFor="">Phone</label>
						<input
							type="tel"
							placeholder="0722123456"
							className="form-control mb-2 me-2"
							onChange={(e) => setPhone(e.target.value)}
							required={true}
						/>
						{/* Phone End */}

						{/* Location Start */}
						<label htmlFor="">Location</label>
						<input
							type="text"
							placeholder="Nairobi"
							className="form-control mb-2 me-2"
							onChange={(e) => setLocation(e.target.value)}
						/>
						{/* Location End */}

						{/* Password Start */}
						<label htmlFor="">Password</label>
						<input
							type="password"
							placeholder="********"
							className="form-control mb-2 me-2"
							onChange={(e) => setPassword(e.target.value)}
						/>
						{/* Password End */}

						{/* Password Confirmation Start */}
						<label htmlFor="">Password Confirmation</label>
						<input
							type="password"
							placeholder="********"
							className="form-control mb-2 me-2"
							onChange={(e) => setPasswordConfirmation(e.target.value)}
						/>
						{/* Password Confirmation End */}

						<div className="d-flex justify-content-end mb-2">
							<Btn
								text="register"
								loading={loading}
							/>
						</div>

						<div className="d-flex justify-content-center mb-5">
							<Link
								to="/"
								className="btn mysonar-btn mx-auto">
								<BackSVG />
								<span className="me-">back to home</span>
							</Link>
						</div>
						<div className="col-sm-4"></div>
					</form>
				</div>
			</div>
		</React.Fragment>
	)
}

export default register
