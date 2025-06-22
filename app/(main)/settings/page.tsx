'use client'
import {StageManagement} from "@/components/settings/StageManagement";
import {useCustomMutation, useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {addStage, deleteStage, editStage, fetchStages} from "@/api/stagesAPI";
import {fetchClasses} from "@/api/studentAPI";
import {toast} from "@/hooks/use-toast";

export default function SettingsPage() {

    const {data: stages} = useCustomQuery(['stages'], fetchStages, {initialData: []})
    const {data: classes} = useCustomQuery(['classes'], fetchClasses, {initialData: []})

    const {mutate: addStageMutation} = useCustomMutation(
        (stageData: Partial<Stage>) => addStage(stageData),
        [['stages']],
        {
            onSuccess: () => {
                toast({title: 'Stage ajouté', description: 'Le stage a été ajouté avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de l\'ajout du stage'})
            }
        }
    )

    const {mutate: editStageMutation} = useCustomMutation(
        ({id, stageData}) => editStage(id, stageData),
        [['stages']],
        {
            onSuccess: () => {
                toast({title: 'Stage modifié', description: 'Le stage a été modifié avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de la modification du stage'})
            }
        }
    )

    const {mutate: deleteStageMutation} = useCustomMutation(
        (id: number) => deleteStage(id),
        [['stages']],
        {
            onSuccess: () => {
                toast({title: 'Stage supprimé', description: 'Le stage a été supprimé avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de la suppression du stage'})
            }
        }
    )

    if (!stages || !classes) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>Settings</h1>
            <StageManagement
                stages={stages}
                classes={classes}
                onAdd={(stage) => Promise.resolve(addStageMutation(stage))}
                onEdit={(id: number, stage: Partial<Stage>) => Promise.resolve(editStageMutation({id, stageData: stage}))}
                onDelete={(id: number) => Promise.resolve(deleteStageMutation(id))}
                />
        </div>
    );
}