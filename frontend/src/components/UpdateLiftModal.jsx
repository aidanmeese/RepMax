import ReactModal from "react-modal";

const UpdateLiftModal = ({
    isOpen,
    onRequestClose,
    formData,
    onChange,
    onSubmit,
    onDelete
}) => {
    return (
        <ReactModal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="modal-overlay"
            ariaHideApp={false}
        >
            <h2>Edit Lift</h2>
            <form onSubmit={onSubmit} className="modal-form">
                <label className="modal-label">Reps:</label>
                <input
                    type="number"
                    name="reps"
                    value={formData.reps}
                    onChange={onChange}
                    required
                />
                <label className="modal-label">Weight:</label>
                <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={onChange}
                    required
                />
                <label className="modal-label">Unit:</label>
                <select
                    name="weight_type"
                    value={formData.weight_type}
                    onChange={onChange}
                >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                </select>
                <div className="modal-buttons">
                    <button type="submit" className="update-btn">Update</button>
                    <div className="delete-cancel-buttons">    
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => onDelete && onDelete(formData._id)}
                        >
                            Delete
                        </button>
                        <button type="button" className="cancel-btn"onClick={onRequestClose}>Cancel</button>
                    </div>
                </div>
            </form>
        </ReactModal>
    );
};

export default UpdateLiftModal;
