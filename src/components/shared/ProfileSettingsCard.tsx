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
    const phone = prompt('Update Phone Number:', localUser.phone || '');
    if (phone === null) return;
    const address = prompt('Update Address:', localUser.address || '');
    if (address === null) return;

    try {
      if (localUser.id || localUser.uid) {
        const id = localUser.id || localUser.uid;
        await updateDoc(doc(db, 'users', id), { phone, address });
        setLocalUser({ ...localUser, phone, address });
        alert('Profile updated successfully!');
      } else {
        alert('Could not update profile (No User ID).');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating profile.');
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
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{roleLabel}</p>
             <p className="font-bold text-slate-800">{localUser.firstName} {localUser.lastName}</p>
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
             <p className="font-bold text-slate-800">{localUser.email}</p>
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
             <p className="font-bold text-slate-800">{localUser.phone || 'Not Provided'}</p>
          </div>
          <div className="md:col-span-3">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Address</p>
             <p className="font-bold text-slate-800">{localUser.address || 'Not Provided'}</p>
          </div>
       </div>
    </div>
  );
};
