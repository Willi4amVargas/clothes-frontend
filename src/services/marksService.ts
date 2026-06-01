import { apiService } from "./apiService"

class MarksService {
    getAll = () => {
        return apiService.get<{ mark: string }[]>(
            `/products/marks`,
            {
                withAuth: false,
                dryRun: false,
            },
        )
    }
}

export const marksService = new MarksService()