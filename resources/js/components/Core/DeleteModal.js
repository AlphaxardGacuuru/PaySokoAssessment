import React from "react"

import Btn from "@/components/Core/Btn"

import DeleteSVG from "@/svgs/DeleteSVG"

const DeleteModal = ({ index, model, modelName, onDelete }) => {
	return (
		<React.Fragment>
			{/* Confirm Delete Modal End */}
			<div
				className="modal fade"
				id={`deleteModal${index}`}
				tabIndex="-1"
				aria-labelledby="deleteModalLabel"
				aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content rounded-4">
						<div className="modal-header">
							<h1
								id="deleteModalLabel"
								className="modal-title fs-5">
								Delete {modelName}
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div className="modal-body text-start text-wrap">
							Are you sure you want to delete {model.name ?? modelName}.
						</div>
						<div className="modal-footer justify-content-between">
							<button
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal">
								Close
							</button>
							<button
								type="button"
								className="btn btn-danger rounded-4"
								data-bs-dismiss="modal"
								onClick={() => onDelete(model.id)}>
								<span className="me-1">{<DeleteSVG />}</span>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Confirm Delete Modal End */}

			{/* Button trigger modal */}
			<Btn
				icon={<DeleteSVG />}
				text="delete"
				dataBsToggle="modal"
				dataBsTarget={`#deleteModal${index}`}
				onClick={(e) => e.preventDefault()}
			/>
			{/* Button trigger modal End */}
		</React.Fragment>
	)
}

export default DeleteModal
