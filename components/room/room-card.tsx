import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {AlertCircle} from "lucide-react";
import {useRouter} from "next/navigation";

type RoomCardProps = {
    room: any;
    handleRoomHover: (roomId: string) => void;
    setHoveredRoom: (roomId: string | null) => void;
    hoveredRoomStudents: any[];
};

export const RoomCard = ({
                             room,
                             handleRoomHover,
                             setHoveredRoom,
                             hoveredRoomStudents,
                         }: RoomCardProps) => {
    const router = useRouter(); // Use the Next.js router

    const handleCardClick = () => {
        router.push(`/chambres/${room.id}`); // Redirect to the room detail page
    };
    return (
        <TooltipProvider key={room.id}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card
                        className="cursor-pointer h-[200px] flex flex-col justify-between" // Adjust card height to align content
                        onMouseEnter={() => handleRoomHover(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        onClick={handleCardClick} // Handle the click event to redirect
                    >
                        <CardHeader>
                            <CardTitle>Chambre {room.numero_chambre}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between">
                            <div>
                                <p>Bloc: {room.bloc.nom_bloc}</p>
                                <p>Etage: {room.bloc.etage.numero_etage}</p>
                                <p>Capacité: {room.capacite}</p>
                            </div>

                            {/* Reserve space for special type even if not present */}
                            <div className="min-h-[24px] flex items-center">
                                {room.type_special ? (
                                    <p className="text-yellow-600">
                                        <AlertCircle className="inline mr-1 h-4 w-4" />
                                        {room.type_special}
                                    </p>
                                ) : (
                                    <span />
                                    )}
                            </div>

                            {/*<Progress value={(room.etudiants.length / room.capacite) * 100} className="mt-2" />*/}
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="p-2">
                        <h3 className="font-bold mb-2">Chambre {room.numero_chambre}</h3>
                        {/*{hoveredRoomStudents.length > 0 ? (*/}
                        {/*    <ul>*/}
                        {/*        {hoveredRoomStudents.map((student) => (*/}
                        {/*            <li key={student.id}>*/}
                        {/*                {student.nom} {student.prenom} - {student.classe.nomClasse}*/}
                        {/*            </li>*/}
                        {/*        ))}*/}
                        {/*    </ul>*/}
                        {/*) : (*/}
                        {/*    <p>Pas d&#39;étudiants ici</p>*/}
                        {/*)}*/}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    );
};
