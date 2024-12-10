import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

type Student = {
    internat_weekend: boolean;
};

type StudentStatisticsProps = {
    students: Student[];
};

export const StudentStatistics: React.FC<StudentStatisticsProps> = ({ students }) => {
    const totalStudents = students.length;
    const weekendStays = students.filter((s) => s.internat_weekend).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Etudiants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStudents}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Restant les weekends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{weekendStays}</div>
                </CardContent>
            </Card>
        </div>
    );
};
