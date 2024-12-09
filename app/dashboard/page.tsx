import {Chambres} from "@/components/room/chambres";
import {LayoutComponent} from "@/components/layout";
import {StaysManagement} from "@/components/stays/stays-management";

export default function DashboardPage() {
    return (
        <div>
            <LayoutComponent>
                <StaysManagement/>
            </LayoutComponent>
        </div>
    );
}