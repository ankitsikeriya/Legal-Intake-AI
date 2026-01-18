'use client';

import { authClient } from "@/lib/auth-client";
import { Button } from "@/app/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-500 hover:text-slate-900"
            onClick={async () => {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/login");
                        },
                    },
                });
            }}
        >
            <LogOut size={18} className="mr-3" />
            Sign Out
        </Button>
    );
}
