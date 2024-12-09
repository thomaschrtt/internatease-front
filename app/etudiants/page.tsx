import {LayoutComponent} from "@/components/layout";
import {Etudiants} from "@/components/students/etudiants";

export default function DashboardPage() {
    return (
        <div>
            <LayoutComponent>
                <Etudiants/>
            </LayoutComponent>
        </div>
    );
}