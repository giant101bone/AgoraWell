"use client"

import { useState } from "react";
import { removeCommunityMemberAction } from "../../app/(dashboard)/communities/[communityId]/members/actions";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MemberManagementListProps {
  communityId: string;
  slug: string; 
  initialMembers: Member[];
}

export default function MemberManagementList({ communityId, slug, initialMembers }: MemberManagementListProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenModal = (member: Member) => {
    setSelectedMember(member);
    setNote("");
    setErrorMsg(null);
  };

  const handleRemoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !note.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await removeCommunityMemberAction({
      communityId,
      targetUserId: selectedMember.id,
      note: note.trim(),
      slug,
    });

    setIsSubmitting(false);

    if (result.success) {
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setSelectedMember(null);
    } else {
      setErrorMsg(result.serverError || "An unknown mutation error occurred.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Active Agora Cohorts</h3>
      </div>

      <ul className="divide-y divide-gray-100">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{member.name || "Anonymous Member"}</p>
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 border">
                  {member.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{member.email || "No Email Provided"}</p>
            </div>
            
            <button
              onClick={() => handleOpenModal(member)}
              className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg transition"
            >
              Exile Member
            </button>
          </li>
        ))}
      </ul>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-6">
            <h4 className="text-base font-bold text-gray-900">Exile {selectedMember.name || "Member"}</h4>
            <p className="text-xs text-gray-500 mt-1">
              Provide a clear reason for the removal. This note will be recorded in the audit logs and sent to the user.
            </p>

            <form onSubmit={handleRemoveSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Reason Note
                </label>
                <textarea
                  required
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Violated community guidelines / Inactivity..."
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedMember(null)}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !note.trim()}
                  className="px-3 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-900 rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Removal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}