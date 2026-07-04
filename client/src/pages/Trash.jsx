import React, { useCallback, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import EmployeeCard from "../components/EmployeeCard"
import api from "../utils/api"

const Trash = () => {
  const [deletedEmployees, setDeletedEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetches only soft-deleted users
  const fetchTrash = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/employees')
      
      // FIXED: Reading the array exactly how Employees.jsx does!
      const employeeArray = response.data || []
      
      // Only keep records where isDeleted is true
      const trashed = employeeArray.filter(emp => emp.isDeleted === true)
      setDeletedEmployees(trashed)
    } catch (error) {
      console.error('Failed to fetch trash data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrash()
  }, [fetchTrash])

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <Trash2 className="text-slate-700" size={24}/> Trash Bin
        </h1>
        <p className="text-sm text-slate-500 mt-1">Review, restore, or permanently delete staff records.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {deletedEmployees.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              Trash bin is empty
            </p>
          ) : (
            deletedEmployees.map((emp) => (
              <EmployeeCard 
                key={emp._id} 
                employee={emp} 
                isTrashPage={true}
                onDelete={fetchTrash} // Runs when hard-deleted to refresh list
                onEdit={fetchTrash}   // Runs when restored to refresh list
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Trash