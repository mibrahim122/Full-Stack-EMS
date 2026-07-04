import { PencilIcon, Trash2Icon, RotateCcw } from 'lucide-react'
import React from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const EmployeeCard = ({ employee, onDelete, onEdit, isTrashPage = false }) => {

  // Action loop for handling deletions (Soft Delete & Permanent Delete)
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevents click from bubbling up

    // Set text prompts based on context
    const message = isTrashPage 
      ? `CRITICAL WARNING: This will permanently erase ${employee.firstName} and their login account from the database. Proceed?`
      : `Are you sure you want to move ${employee.firstName} to the trash?`;
    
    if (!window.confirm(message)) return;
    
    try {
      // Point to the correct endpoint route based on page context
      const url = isTrashPage ? `/employees/${employee._id}/permanent` : `/employees/${employee._id}`;
      
      await api.delete(url);
      
      toast.success(isTrashPage ? 'Employee and account permanently erased' : 'Employee moved to trash successfully');
      
      // Refresh list on parent view
      if (onDelete) onDelete(); 
    } catch (error) {
      // Capture the REAL backend error message, not just the generic Axios error
      const errorMessage = error.response?.data?.message || error.message || 'Action failed';
      toast.error(errorMessage);
    }
  }

  // Action loop for restoring a soft-deleted record
  const handleRestore = async (e) => {
    e.stopPropagation(); // Prevents click from bubbling up

    if (!window.confirm(`Restore ${employee.firstName} back to the active employee list?`)) return;
    
    try {
      // Hit the restore endpoint
      await api.put(`/employees/${employee._id}/restore`);
      
      toast.success('Employee restored successfully!');
      
      // Re-fetch list on parent view
      if (onEdit) onEdit(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to restore employee';
      toast.error(errorMessage);
    }
  }

  const avatarUrl = employee.avatar || `https://i.pravatar.cc/150?u=${employee._id || employee.firstName}`;

  return (
    <div className='group relative card card-hover overflow-hidden'>
      <div className='relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-slate-100 to-slate-50'>
        
        {/* Profile Avatar Frame */}
        <div className='w-full h-full flex items-center justify-center'>
          <div className='w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-md transition-transform duration-300 group-hover:scale-105'>
            <img 
              src={avatarUrl} 
              alt={`${employee.firstName} ${employee.lastName}`}
              className={`w-full h-full object-cover ${isTrashPage ? 'grayscale opacity-75' : ''}`}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=e0e7ff&color=6366f1`;
              }}
            />
          </div>
        </div>

        {/* Top Indicators */}
        <div className='absolute top-3 left-3 flex gap-2'>
          <span className='bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-600 rounded-lg shadow-sm'>
            {employee.department || "Remote"}
          </span>
          {isTrashPage && <span className='bg-rose-500 font-medium text-white px-2.5 py-1 text-xs rounded shadow-sm animate-pulse'>IN TRASH</span>}
        </div>

        {/* Dynamic Action Buttons on Hover Overlay */}
        <div className='absolute inset-0 bg-linear-to-t from-indigo-700/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-3'>
          {isTrashPage ? (
            <>
              {/* RESTORE BUTTON */}
              <button type="button" onClick={handleRestore} title="Restore Employee" className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-emerald-600 rounded-xl shadow-lg transition-all hover:scale-105'>
                <RotateCcw className="w-4 h-4"/>
              </button>
              {/* PERMANENT HARD-DELETE BUTTON */}
              <button type="button" onClick={handleDelete} title="Delete Permanently" className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-red-600 rounded-xl shadow-lg transition-all hover:scale-105'>
                <Trash2Icon className="w-4 h-4"/>
              </button>
            </>
          ) : (
            <>
              {/* REGULAR ACTIVE DIRECTORY ACTIONS */}
              <button type="button" onClick={() => onEdit(employee)} title="Edit Details" className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-indigo-600 rounded-xl shadow-lg transition-all hover:scale-105'>
                <PencilIcon className="w-4 h-4"/>
              </button>
              <button type="button" onClick={handleDelete} title="Move to Trash" className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 rounded-xl shadow-lg transition-all hover:scale-105'>
                <Trash2Icon className="w-4 h-4"/>
              </button>
            </>
          )}
        </div>
      </div>

      <div className='p-5'>
        <h3 className='text-slate-900 font-medium'>{employee.firstName} {employee.lastName}</h3>
        <p className='text-xs text-slate-500 mt-0.5'>{employee.position}</p>
      </div>
    </div>
  )
}

export default EmployeeCard