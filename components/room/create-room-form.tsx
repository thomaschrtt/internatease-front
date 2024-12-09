'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {toast} from "@/hooks/use-toast"
import axios from "@/api/Axios";

type CreateRoomFormProps = {
    blocks: any[]
    onRoomCreated: () => void
}

export function CreateRoomForm({blocks, onRoomCreated}: CreateRoomFormProps) {
    const [roomNumber, setRoomNumber] = useState('')
    const [capacity, setCapacity] = useState('')
    const [blockId, setBlockId] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('/api/chambres', {
                numero_chambre: parseInt(roomNumber),
                capacite: parseInt(capacity),
                id_block: parseInt(blockId),
            }, {
                headers: {
                    'Content-Type': 'application/ld+json',
                }
            })
            toast({
                title: "Chambre créée",
                description: "La nouvelle chambre a été ajoutée avec succès.",
            })
            onRoomCreated()
            // Reset form
            setRoomNumber('')
            setCapacity('')
            setBlockId('')

        } catch (error) {
            console.error('Error creating room:', error)
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de la chambre.",
                variant: "destructive",
            })
        }
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