import {LayoutComponent} from "@/components/layout";
import {RoomDetailsComponent} from "@/components/room/room-details";

export default function DetailChambrePage({ params }: { params: { id: number } }) {
    return (
        <div>
            <LayoutComponent>
                <RoomDetailsComponent
                    idRequest ={params.id}
                />
            </LayoutComponent>
        </div>
    );
}