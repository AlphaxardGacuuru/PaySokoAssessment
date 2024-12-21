import React, { useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { HashRouter } from "react-router-dom"

import ScrollToTop from "@/functions/ScrollToTop"
import LoginPopUp from "@/components/Auth/LoginPopUp"
import Footer from "@/components/Layouts/Footer"
import Messages from "@/components/Core/Messages"

import RouteList from "@/components/Core/RouteList"
import { random } from "lodash"

function App() {
	// Function for checking local storage
	const getLocalStorage = (state) => {
		if (typeof window !== "undefined" && localStorage.getItem(state)) {
			return JSON.parse(localStorage.getItem(state))
		} else {
			return []
		}
	}

	// Function for checking local storage
	const getLocalStorageAuth = (state) => {
		if (typeof window !== "undefined" && localStorage.getItem(state)) {
			return JSON.parse(localStorage.getItem(state))
		} else {
			return {
				name: "Guest",
				username: "@guest",
				avatar: "/storage/avatars/male-avatar.png",
				accountType: "normal",
				decos: 0,
				posts: 0,
				fans: 0,
			}
		}
	}

	// Function to set local storage
	const setLocalStorage = (state, data) => {
		localStorage.setItem(state, JSON.stringify(data))
	}

	const url = process.env.MIX_FRONTEND_URL

	// Declare states
	const [messages, setMessages] = useState([])
	const [errors, setErrors] = useState([])
	const [login, setLogin] = useState()
	const [auth, setAuth] = useState(getLocalStorageAuth("auth"))
	const [headerMenu, setHeaderMenu] = useState()
	const [adminMenu, setAdminMenu] = useState("left-open")
	const [page, setPage] = useState({ name: "/", path: [] })

	const [configuration, setConfiguration] = useState({})

	// Function for fetching data from API
	const get = (endpoint, setState, storage = null, errors = true) => {
		Axios.get(`/api/${endpoint}`)
			.then((res) => {
				var data = res.data ? res.data.data : []
				setState(data)
				storage && setLocalStorage(storage, data)
			})
			.catch(() => errors && setErrors([`Failed to fetch ${endpoint}`]))
	}

	// Function for fetching data from API
	const getPaginated = (endpoint, setState, storage = null, errors = true) => {
		Axios.get(`/api/${endpoint}`)
			.then((res) => {
				var data = res.data ? res.data : []
				setState(data)
				storage && setLocalStorage(storage, data)
			})
			.catch(() => errors && setErrors([`Failed to fetch ${endpoint}`]))
	}

	// Function for showing iteration
	const iterator = (key, list) => {
		return key + 1 + list.meta.per_page * (list.meta.current_page - 1)
	}

	// Function for getting errors from responses
	const getErrors = (err, message = false) => {
		const resErrors = err.response.data.errors
		var newError = []
		for (var resError in resErrors) {
			newError.push(resErrors[resError])
		}
		// Get other errors
		message && newError.push(err.response.data.message)
		setErrors(newError)
	}

	// Fetch data on page load
	useEffect(() => {
		get("auth", setAuth, "auth", false)
		get("configurations", setConfiguration, "configurations", false)
}, [])

	/*
	 * Genereate Month and Year Arrays
	 */
	var currentDate = new Date()
	var currentYear = currentDate.getFullYear()
	var currentMonth = currentDate.getMonth() + 1

	const months = [
		"Select Month",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]

	const years = []

	for (let i = currentYear; i > 2009; i--) {
		years.push(i)
	}

	/*
	 *
	 * Register service worker */
	if (window.location.href.match(/https/)) {
		// if ("serviceWorker" in navigator) {
		// 	window.addEventListener("load", () => {
		// 		navigator.serviceWorker.register("/sw.js")
		// 		// .then((reg) => console.log('Service worker registered', reg))
		// 		// .catch((err) => console.log('Service worker not registered', err));
		// 	})
		// }
	}

	/*
	 *
	 * PWA Install button */
	let deferredPrompt
	var btnAdd = useRef()
	const [downloadLink, setDownloadLink] = useState()
	const [downloadLinkText, setDownloadLinkText] = useState("")

	// Listen to the install prompt
	window.addEventListener("beforeinstallprompt", (e) => {
		deferredPrompt = e

		// Show the button
		setDownloadLink(true)

		// Action when button is clicked
		btnAdd.current.addEventListener("click", (e) => {
			// Show install banner
			deferredPrompt.prompt()
			// Check if the user accepted
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					setDownloadLinkText("User accepted")
				}
				deferredPrompt = null
			})

			window.addEventListener("appinstalled", (evt) => {
				setDownloadLinkText("Installed")
			})
		})
	})

	const GLOBAL_STATE = {
		getLocalStorage,
		setLocalStorage,
		url,
		messages,
		setMessages,
		errors,
		setErrors,
		get,
		getPaginated,
		iterator,
		getErrors,
		login,
		setLogin,
		auth,
		setAuth,
		headerMenu,
		setHeaderMenu,
		adminMenu,
		setAdminMenu,
		page,
		setPage,

		// Date
		currentDate,
		currentYear,
		currentMonth,
		months,
		years,
		configuration,
		setConfiguration
	}

	return (
		<HashRouter>
			<ScrollToTop />
			<LoginPopUp {...GLOBAL_STATE} />
			<RouteList GLOBAL_STATE={GLOBAL_STATE} />
			<Footer {...GLOBAL_STATE} />
			<Messages {...GLOBAL_STATE} />

			{/* Install button */}
			<button
				ref={btnAdd}
				style={{ display: "none" }}>
				test
			</button>
		</HashRouter>
	)
}

export default App

if (document.getElementById("app")) {
	ReactDOM.render(<App />, document.getElementById("app"))
}
