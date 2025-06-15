import React from 'react';

function EditTaskModal({ task, onClose, onSave }) {
  const [updatedTask, setUpdatedTask] = React.useState(task || {});

  React.useEffect(() => {
    setUpdatedTask(task || {});
  }, [task]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUpdatedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(updatedTask);
  };

  if (!task) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-sm modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <input
                name="title"
                value={updatedTask.title || ''}
                onChange={handleChange}
                placeholder="Title"
                required
                className="form-control mb-2"
              />
              <textarea
                name="description"
                value={updatedTask.description || ''}
                onChange={handleChange}
                placeholder="Description"
                className="form-control mb-2"
              />
              <input
                type="date"
                name="dueDate"
                value={updatedTask.dueDate?.split('T')[0] || ''}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <select
                name="priority"
                value={updatedTask.priority || 'medium'}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
