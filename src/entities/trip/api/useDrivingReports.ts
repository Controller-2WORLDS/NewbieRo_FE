import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { drivingReportsApi } from "./drivingReportsApi"
import type { CreateDrivingReportRequest, DrivingReportSummaryQuery } from "./types"

export function useCreateDrivingReport() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateDrivingReportRequest) => drivingReportsApi.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driving-reports", "summary"] }),
    })
}

export function useDrivingReport(reportId: string | undefined) {
    return useQuery({
        queryKey: ["driving-reports", reportId],
        queryFn: () => drivingReportsApi.findOne(reportId as string),
        enabled: Boolean(reportId),
    })
}

export function useDrivingReportSummary(query: DrivingReportSummaryQuery = {}) {
    return useQuery({
        queryKey: ["driving-reports", "summary", query],
        queryFn: () => drivingReportsApi.summary(query),
    })
}
