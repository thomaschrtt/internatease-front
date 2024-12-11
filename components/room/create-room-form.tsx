import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

type CreateRoomFormProps = {
    blocks: Bloc[]
    addRoomMutation: (roomData: ChambreInsert) => void
}

export function CreateRoomForm({blocks, addRoomMutation}: CreateRoomFormProps) {
    const [roomNumber, setRoomNumber] = useState('')
    const [capacity, setCapacity] = useState('')
    const [blockId, setBlockId] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        addRoomMutation({
            numero_chambre: parseInt(roomNumber),
            capacite: parseInt(capacity),
            bloc_id: parseInt(blockId),
            type_special: null
        })
        setRoomNumber('')
        setCapacity('')
        setBlockId('')

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="roomNumber">Numéro de chambre</Label>
                <Input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="block">Bloc</Label>
                <Select onValueChange={(value) => setBlockId(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un bloc"/>
                    </SelectTrigger>
                    <SelectContent>
                        {blocks.map((block) => (
                            <SelectItem key={block.id} value={block.id.toString()}>
                                {block.nom_bloc} - Étage {block.etage.numero_etage}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Créer la chambre</Button>
        </form>
    )
}