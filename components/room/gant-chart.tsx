import React, {useEffect, useState} from "react";
import {Chart} from "react-google-charts";
import {useRouter} from "next/navigation"; // Assuming you're using Next.js's router
import {parseISO} from 'date-fns';

type Stay = {
    id: number;
    date_debut: string;
    date_fin: string;
    etudiant: {
        id: number;
        nom: string;
        prenom: string;
    };
};

type Room = {
    id: number;
    numero_chambre: string;
    capacite: number;
};

type RoomDetailsProps = {
    stays: Stay[];
};

export function RoomGanttChart({ stays }: RoomDetailsProps) {
    const [chartData, setChartData] = useState<any[]>([]);
    const router = useRouter(); // Use Next.js router for navigation

    useEffect(() => {
        prepareChartData();
    }, [stays]);

    const prepareChartData = () => {
        const columns = [
            { type: "string", id: "Student" },
            { type: "date", id: "Start Date" },
            { type: "date", id: "End Date" },
        ];

        const rows = stays.map(stay => [
            `${stay.etudiant.prenom} ${stay.etudiant.nom}`,
            parseISO(stay.date_debut),
            parseISO(stay.date_fin),
        ]);

        setChartData([columns, ...rows]);
    };

    const handleChartClick = (chartEvent: any) => {
        if (chartEvent.row !== null) {
            const clickedStay = stays[chartEvent.row];
            const studentId = clickedStay.etudiant.id;

            // Redirect to a page for the student (e.g., /students/[id])
            router.push(`/students/${studentId}`);
        }
    };

    return (
        <div className="chart-container">
            {chartData.length > 1 ? (
                <Chart
                    chartType="Timeline"
                    data={chartData}
                    width="100%"
                    height="400px"
                    options={{
                        timeline: { showRowLabels: true },
                        colors: ['#0b182c'], // Custom colors
                    }}
                    chartEvents={[
                        {
                            eventName: 'select', // Event when a data point is clicked
                            callback: ({ chartWrapper }) => {
                                const chart = chartWrapper.getChart();
                                const selection = chart.getSelection();
                                if (selection.length > 0) {
                                    handleChartClick(selection[0]);
                                }
                            },
                        },
                    ]}
                />
            ) : (
                <div>Aucune données</div>
            )}
        </div>
    );
}
