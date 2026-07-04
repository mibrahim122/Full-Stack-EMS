import { useCallback, useState, useEffect } from "react"
import Loading from "../components/Loading"
import PayslipList from "../components/payslip/PayslipList"
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm"
import api from "../utils/api"
import { useAuth } from "../context/AuthContext"

const Payslips = () => {
  const [payslips, setPayslips] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const fetchPayslips = useCallback(async () => {
    try {
      const response = await api.get('/payslips')
      setPayslips(response.data)
    } catch (error) {
      console.error('Failed to fetch payslips:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayslips()
  }, [fetchPayslips])

  useEffect(() => {
    const fetchEmployees = async () => {
      if (isAdmin) {
        try {
          const response = await api.get('/employees')
          setEmployees(response.data)
        } catch (error) {
          console.error('Failed to fetch employees:', error)
        }
      }
    }
    fetchEmployees()
  }, [isAdmin])

  if(loading) return <Loading />

// Inside Payslips.jsx return statement
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">{isAdmin ? "Generate and manage employee payslips" : "Your payslip history"}</p>
        </div>
        {isAdmin && <GeneratePayslipForm employees={employees} onSuccess={fetchPayslips} />}
      </div>
      
      {/* ADD the onSuccess prop here so the list updates after a deletion */}
      <PayslipList payslips={payslips} isAdmin={isAdmin} onSuccess={fetchPayslips} />
    </div>
  )
}

export default Payslips