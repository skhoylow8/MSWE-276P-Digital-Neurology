import React from 'react';

/**
 * Modal - A component representing a modal dialog.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier for the modal.
 * @param {ReactNode} props.children - The content to be displayed within the modal.
 * @returns {JSX.Element} - JSX element representing the Modal component.
 */
const Modal = ({ id, children }) => {
  return (
    <dialog id={id} className="modal text-stone-900 overflow-y-scroll">
        <div className="modal-box">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            { children }
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
    )
}

export default Modal