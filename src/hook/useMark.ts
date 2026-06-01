import { marksService } from "#/services/marksService"
import { useQuery } from "@tanstack/react-query"

export const useMarks = () => {
    const marks = useQuery({
        queryFn: marksService.getAll,
        queryKey: ["marks"]
    })
    return { marks }
}