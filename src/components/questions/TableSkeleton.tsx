import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-gray-800 hover:bg-transparent">
                    <TableCell className="text-center">
                        <Skeleton className="h-4 w-8 mx-auto bg-gray-800" />
                    </TableCell>
                    <TableCell className="pl-6">
                        <Skeleton className="h-4 w-64 bg-gray-800" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-5 w-16 mx-auto bg-gray-800 rounded-full" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-4 w-12 mx-auto bg-gray-800" />
                    </TableCell>
                    <TableCell className="pl-6">
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-20 bg-gray-800 rounded-full" />
                            <Skeleton className="h-5 w-16 bg-gray-800 rounded-full" />
                        </div>
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-8 w-8 bg-gray-800 rounded-md" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
