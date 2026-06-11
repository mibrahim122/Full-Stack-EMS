import React, { useEffect, useState } from 'react'
import Loading from "../components/Loading"
import { Lock } from "lucide-react"
import ProfileForm from '../components/ProfileForm'
import ChangePasswordModal from '../components/ChangePasswordModal'
import api from '../utils/api'

const Settings = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const fetchProfile = async () => {
        try {
            const response = await api.get('/employees/profile')
            setProfile(response.data)
        } catch (error) {
            console.error('Failed to fetch profile:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchProfile()
    },[])

    if(loading) return <Loading />

    return (
        <div className="max-w-10xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and preferences</p>
            </div>

            {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}

            {/* Change Password trigger */}
            <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 rounded-lg">
                        <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">Password</p>
                        <p className="text-sm text-slate-500">Update your account password</p>
                    </div>
                </div>
                <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-sm">
                    Change
                </button>
            </div>
            <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    )
}

export default Settings
