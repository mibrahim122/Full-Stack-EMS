import React from 'react'
import { format } from 'date-fns'
import { Download, Trash2 } from 'lucide-react' // Added Trash2 icon
import api from '../../utils/api'             // Added API import (adjust path if needed)
import toast from 'react-hot-toast'           // Added toast for notifications

const PayslipList = ({payslips, isAdmin, onSuccess}) => { // Added onSuccess prop

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payslip? This action cannot be undone.")) {
      try {
        await api.delete(`/payslips/${id}`);
        toast.success("Payslip deleted successfully");
        if (onSuccess) onSuccess(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete payslip");
      }
    }
  };

  return (
    <div className='card overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='table-modern'>
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className='text-center py-12 text-slate-400'>
                  No payslips found
                </td>
              </tr>
            ) : (
              payslips.map((payslip) => (
                <tr key={payslip._id || payslip.id}>
                  {isAdmin && (
                    <td className='text-slate-900'>
                      {payslip.employee?.firstName} {payslip.employee?.lastName}
                    </td>
                  )}
                  <td className='text-slate-500'>
                    {format(new Date(payslip.year, payslip.month - 1), 'MMMM yyyy')}
                  </td>
                  <td className='text-slate-500'>
                    ${payslip.basicSalary?.toLocaleString()}
                  </td>
                  <td className='text-slate-500'>
                    ${payslip.netSalary?.toLocaleString()}
                  </td>
                  <td className='text-center'>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => window.open(`/print/payslips/${payslip._id || payslip.id}`)}
                        className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10'
                      >
                        <Download className='w-3 h-3 mr-1.5' /> Download
                      </button>
                      
                      {/* NEW DELETE BUTTON FOR ADMINS */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(payslip._id || payslip.id)}
                          className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors ring-1 ring-red-600/10'
                        >
                          <Trash2 className='w-3 h-3 mr-1.5' /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PayslipList