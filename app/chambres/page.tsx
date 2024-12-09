import {Chambres} from "@/components/room/chambres";
import {LayoutComponent} from "@/components/layout";

export default function DashboardPage() {
    return (
        <div>
            <LayoutComponent>
                <Chambres/>
            </LayoutComponent>
        </div>
    );
}