import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

type StayStatisticsProps = {
    occupancyRate: number
    averageStayDuration: number
}

export function StayStatistics({occupancyRate, averageStayDuration }: StayStatisticsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux d&#39;occupation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{occupancyRate.toFixed(2)}%</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageStayDuration} jours</div>
                </CardContent>
            </Card>
        </div>
    )
}
