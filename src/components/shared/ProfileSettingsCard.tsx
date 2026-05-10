import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ProfileSettingsCardProps {
  user: any;
  title?: string;
  roleLabel?: string;
}

export const ProfileSettingsCard = ({ user, title = "Profile & Contact Info", roleLabel = "Full Name" }: ProfileSettingsCardProps) => {
  const [localUser, setLocalUser] = useState(user || {});
  
  useEffect(() => {
    if (user) setLocalUser(user);
  }, [user]);

  const handleEditProfile = async () => {
    const firstName = prompt('Update First Name:', localUser.firstName || '') ?? localUser.firstName;
    const lastName = prompt('Update Last Name:', localUser.lastName || '') ?? localUser.lastName;
    const phone = prompt('Update Phone Number:', localUser.phone || '') ?? localUser.phone;
    const address = prompt('Update Address:', localUser.address || '') ?? localUser.address;

    try {
      if (localUser.id || localUser.uid) {
        const id = localUser.id || localUser.uid;
        await updateDoc(doc(db, 'users', id), { firstName, lastName, phone, address });
        setLocalUser({ ...localUser, firstName, lastName, phone, address });
        (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Profile updated successfully!" })] }).catch(console.error) ); alert("Profile updated successfully!\n\n[Live Production Transaction Logged]"); })();
      } else {
        (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Could not update profile (No User ID)." })] }).catch(console.error) ); alert("Could not update profile (No User ID).\n\n[Live Production Transaction Logged]"); })();
      }
    } catch (e) {
      console.error(e);
      (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Error updating profile." })] }).catch(console.error) ); alert("Error updating profile.\n\n[Live Production Transaction Logged]"); })();
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 mb-4">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <User size={24} className="text-[#1a4731]" />
             {title}
          </h3>
          <button onClick={handleEditProfile} className="text-xs text-[#1a4731] font-black uppercase tracking-widest hover:underline border border-[#1a4731] px-4 py-2 rounded-xl transition-colors hover:bg-emerald-50">Edit Info</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="min-w-0">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{roleLabel}</p>
             <p className="font-bold text-slate-800 truncate">{localUser.firstName} {localUser.lastName}</p>
          </div>
          <div className="min-w-0">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
             <p className="font-bold text-slate-800 truncate" title={localUser.email}>{localUser.email}</p>
          </div>
          <div className="min-w-0">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
             <p className="font-bold text-slate-800 truncate">{localUser.phone || 'Not Provided'}</p>
          </div>
          <div className="md:col-span-3 min-w-0">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Address</p>
             <p className="font-bold text-slate-800 truncate" title={localUser.address}>{localUser.address || 'Not Provided'}</p>
          </div>
       </div>
    </div>
  );
};
