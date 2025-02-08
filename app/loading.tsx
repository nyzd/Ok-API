import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center">
            <Loader2 size={65} className="animate-spin" />
        </div>
    );
}