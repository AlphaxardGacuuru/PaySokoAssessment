import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Img from "@/components/Core/Img"

import OptionsSVG from "@/svgs/OptionsSVG"
import ThumbsUpFilledSVG from "@/svgs/ThumbsUpFilledSVG"
import ThumbsUpSVG from "@/svgs/ThumbsUpSVG"

const CommentMedia = (props) => {
	const [hasLiked, setHasLiked] = useState(props.comment.hasLiked)
	const [bottomMenu, setBottomMenu] = useState("")

	useEffect(() => {
		// Set new cart with data with auth
		setHasLiked(props.comment.hasLiked)
	}, [props.comment])

	return (
		<div className="d-flex">
			<div className="py-2">
				<div className="avatar-thumbnail-xs">
					<Link to={`/profile/show/${props.comment.userId}`}>
						<Img
							src={props.comment.userAvatar}
							className="rounded-circle"
							width="40em"
							height="40em"
						/>
					</Link>
				</div>
			</div>
			<div
				className="p-1 flex-grow-1"
				style={{ textAlign: "left" }}>
				<h6
					className="media-heading m-0"
					style={{
						width: "100%",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "clip",
					}}>
					<b className="text-light">{props.comment.userName}</b>
					<small>
						<i className="float-end text-light me-1">
							{props.comment.createdAt}
						</i>
					</small>
				</h6>
				<p className="mb-0 text-white">{props.comment.text}</p>

				{/* Comment likes */}
				<a
					href="#"
					onClick={(e) => {
						e.preventDefault()
						props.onCommentLike(props.comment.id)
						setHasLiked(!hasLiked)
					}}>
					{hasLiked ? (
						<span style={{ color: "rgba(96, 95, 103, 1)" }}>
							<ThumbsUpFilledSVG />
							<small
								className="ms-1"
								style={{ color: "inherit" }}>
								{props.comment.likes}
							</small>
						</span>
					) : (
						<span style={{ color: "rgba(220, 220, 220, 1)" }}>
							<ThumbsUpSVG />
							<small
								className="ms-1"
								style={{ color: "inherit" }}>
								{props.comment.likes}
							</small>
						</span>
					)}
				</a>
				{/* Comment likes End */}

				<small className="ms-1">{props.comment.comments}</small>

				{/* <!-- Default dropup button --> */}
				<div className="dropup-center dropup float-end mb-2">
					<a
						href="#"
						className="text-white"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false">
						<OptionsSVG />
					</a>
					<div className="dropdown-menu dropdown-menu-right">
						{props.comment.userId == props.auth.id && (
							<a
								href="#"
								className="dropdown-item"
								onClick={(e) => {
									e.preventDefault()
									props.onDeleteComment(props.comment.id)
								}}>
								<h6>Delete comment</h6>
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CommentMedia
