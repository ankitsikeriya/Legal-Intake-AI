'use client';

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import { Loader2, Pencil, User, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserProfile() {
    const { data: session } = authClient.useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    if (!session) return (
        <div className="flex items-center gap-3 p-2 rounded-xl animate-pulse bg-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
        </div>
    );

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        await authClient.updateUser({
            name: name,
        }, {
            onSuccess: () => {
                setIsEditing(false);
                router.refresh();
            },
            onError: (ctx) => {
                alert(ctx.error.message);
                setIsLoading(false);
            }
        });
        setIsLoading(false);
    };

    return (
        <>
            <div className="group relative">
                <button
                    onClick={() => {
                        setName(session.user.name || "");
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white hover:shadow-md transition-all text-left group-hover:ring-1 ring-slate-200"
                >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                        {session.user.image ? (
                            <img src={session.user.image} alt={session.user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            session.user.name?.charAt(0).toUpperCase() || "L"
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                            {session.user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {session.user.email}
                        </p>
                    </div>
                    <Pencil className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Edit Modal (Simple Fixed Overlay) */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleUpdateProfile} disabled={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
