import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

type RoomFilterProps = {
    floors: Etage[];
    blocks: Bloc[];
    filter: { floor: string; block: string; status: string; gender: string };
    searchTerm: string;
    setFilter: (filter: any) => void;
    setSearchTerm: (term: string) => void;
};

export const RoomFilter = ({
                               floors,
                               blocks,
                               filter,
                               searchTerm,
                               setFilter,
                               setSearchTerm,
                           }: RoomFilterProps) => {
    // Filter blocks based on the selected floor
    const filteredBlocks = filter.floor === 'all'
        ? blocks
        : blocks.filter(block => block.etage.id === parseInt(filter.floor));

    // Handle floor change and reset block if necessary
    const handleFloorChange = (newFloor: string) => {
        setFilter((prev: any) => {
            // Check if the currently selected block is part of the new floor
            const selectedBlockBelongsToNewFloor = blocks.some(
                (block) => block.id === parseInt(prev.block) && block.etage.id === parseInt(newFloor)
            );

            // If the selected block doesn't belong to the new floor, reset the block to 'all'
            const newBlock = selectedBlockBelongsToNewFloor ? prev.block : 'all';

            return { ...prev, floor: newFloor, block: newBlock };
        });
    };


    return (
        <div className="mb-4 flex flex-wrap gap-2">
            <Select onValueChange={handleFloorChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner un étage" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les étages</SelectItem>
                    {floors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id.toString()}>
                            Étage {floor.numero_etage}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilter((prev: any) => ({ ...prev, block: value }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner un bloc" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les blocs</SelectItem>
                    {filteredBlocks.map((block) => (
                        <SelectItem key={block.id} value={block.id.toString()}>
                            Bloc {block.nom_bloc} - Étage {block.etage.numero_etage}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/*<Select onValueChange={(value) => setFilter((prev: any) => ({ ...prev, status: value }))}>*/}
            {/*    <SelectTrigger className="w-[180px]">*/}
            {/*        <SelectValue placeholder="Statut des chambres" />*/}
            {/*    </SelectTrigger>*/}
            {/*    <SelectContent>*/}
            {/*        <SelectItem value="all">Toutes les chambres</SelectItem>*/}
            {/*        <SelectItem value="empty">Chambres vides</SelectItem>*/}
            {/*        <SelectItem value="occupied">Chambres occupées</SelectItem>*/}
            {/*        <SelectItem value="available">Places libres</SelectItem>*/}
            {/*    </SelectContent>*/}
            {/*</Select>*/}

            <Select onValueChange={(value) => setFilter((prev: any) => ({ ...prev, gender: value }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="M">Male (M)</SelectItem>
                    <SelectItem value="F">Female (F)</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="text"
                placeholder="Rechercher des chambres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px]"
            />
        </div>
    );
};
