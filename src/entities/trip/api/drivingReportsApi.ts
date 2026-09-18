import { apiClient } from "@shared/api/client"
import type {
    CreateDrivingReportRequest,
    DrivingReportResponse,
    DrivingReportSummaryQuery,
    DrivingReportSummaryResponse,
} from "./types"

export const drivingReportsApi = {
    create: (payload: CreateDrivingReportRequest) =>
        apiClient.post<DrivingReportResponse>("/driving-reports", payload).then((res) => res.data),

    findOne: (reportId: string) =>
        apiClient.get<DrivingReportResponse>(`/driving-reports/${reportId}`).then((res) => res.data),

    summary: (query: DrivingReportSummaryQuery = {}) =>
        apiClient
            .get<DrivingReportSummaryResponse>("/driving-reports/summary", { params: query })
            .then((res) => res.data),
}
