import React from "react"

const Messages = ({ messages, setMessages, errors, setErrors }) => {
	// Reset Messages and Errors to null after 3 seconds
	if (errors.length > 0 || messages.length > 0) {
		setTimeout(() => setErrors([]), 4900)
		setTimeout(() => setMessages([]), 4900)
	}

	return (
		<center>
			<h6
				id="snackbar"
				className={errors.length > 0 || messages.length > 0 ? "show" : ""}>
				{/* Message Toast */}
				{messages.map((message, key) => (
					<div
						key={key}
						className="glass p-2 mt-2 text-light"
						style={{
							backgroundColor: "rgba(143, 234, 133, 1)",
							transition: "0.3s",
						}}>
						{message}
					</div>
				))}
				{/* Error Toast */}
				{errors.map((error, key) => (
					<div
						key={key}
						className="glass p-2 mt-2 text-light"
						style={{
							backgroundColor: "rgba(235, 96, 96, 1)",
							transition: "0.3s",
						}}>
						{error}
					</div>
				))}
			</h6>
		</center>
	)
}

export default Messages
