import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex gap-3 flex-col">
            <Skeleton className="w-[100%] h-[141px] rounded-xl" />
            <Skeleton className="w-[100%] h-[141px] rounded-x1" />
            <Skeleton className="w-[100%] h-[141px] rounded-x1" />
            <Skeleton className="w-[100%] h-[141px] rounded-x1" />
        </div>
    )
}