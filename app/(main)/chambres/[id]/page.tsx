import {RoomDetailsComponent} from "@/components/room/room-details";

export default function DetailChambrePage({ params }: { params: { id: number } }) {
    return (
        <div>
            
                <RoomDetailsComponent
                    id={params.id}
                />
            
        </div>
    );
}