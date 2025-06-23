'use client'
import {StageManagement} from "@/components/settings/StageManagement";
import {useCustomMutation, useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {addStage, deleteStage, editStage, fetchStages} from "@/api/stagesAPI";
import {fetchClasses} from "@/api/studentAPI";
import {toast} from "@/hooks/use-toast";
import { ChambreManagement } from "@/components/settings/chambre-management";
import { BlocManagement } from "@/components/settings/bloc-management";
import { EtageManagement } from "@/components/settings/etage-management";
import { addBloc, addEtage, deleteBloc, deleteEtage, editBloc, editEtage, fetchBlocs, fetchEtages, fetchRooms,  } from "@/api/chambreAPI";

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
    
    const {data: etages} = useCustomQuery(['floors'], fetchEtages, {initialData: []})
    const {data: blocs} = useCustomQuery(['blocs'], fetchBlocs, {initialData: []})
    const {data: chambres} = useCustomQuery(['chambres'], fetchRooms, {initialData: []})

    const {mutate: handleAddEtage} = useCustomMutation(
        (etageData: Partial<Etage>) => addEtage(etageData),
        [['floors']],
        {
            onSuccess: () => {
                toast({title: 'Étage ajouté', description: 'L\'étage a été ajouté avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de l\'ajout de l\'étage'})
            }
        }
    )

    const {mutate: handleEditEtage} = useCustomMutation(
        ({id, etageData}) => editEtage(id, etageData),
        [['floors']],
        {
            onSuccess: () => {
                toast({title: 'Étage modifié', description: 'L\'étage a été modifié avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de la modification de l\'étage'})
            }
        }
    )

    const {mutate: handleDeleteEtage} = useCustomMutation(
        (id: number) => deleteEtage(id),
        [['floors']],
        {
            onSuccess: () => {
                toast({title: 'Étage supprimé', description: 'L\'étage a été supprimé avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de la suppression de l\'étage'})
            }
        }
    )
    const {mutate: handleAddBloc} = useCustomMutation(
        (blocData: Partial<Bloc>) => addBloc(blocData),
        [['blocs']],
        {
            onSuccess: () => {
                toast({title: 'Bloc ajouté', description: 'Le bloc a été ajouté avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de l\'ajout du bloc'})
            }
        }
    )

    const {mutate: handleEditBloc} = useCustomMutation(
        ({id, blocData}) => editBloc(id, blocData),
        [['blocs']],
        {
            onSuccess: () => {
                toast({title: 'Bloc modifié', description: 'Le bloc a été modifié avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de la modification du bloc'})
            }
        }
    )

    const {mutate: handleDeleteBloc} = useCustomMutation(
        (id: number) => deleteBloc(id),
        [['blocs']],
        {
            onSuccess: () => {
                toast({title: 'Bloc supprimé', description: 'Le bloc a été supprimé avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de la suppression du bloc'})
            }
        }
    )
    

    if (!stages || !classes || !etages || !blocs || !chambres) {
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
            <EtageManagement
                etages={etages}
                onAdd={(etage) => Promise.resolve(handleAddEtage(etage))}
                onEdit={(id: number, etage: Partial<Etage>) => Promise.resolve(handleEditEtage({id, etageData: etage}))}
                onDelete={(id: number) => Promise.resolve(handleDeleteEtage(id))}
                />

            <BlocManagement
                blocs={blocs}
                etages={etages}
                onAdd={(bloc) => Promise.resolve(handleAddBloc(bloc))}
                onEdit={(id: number, bloc: Partial<Bloc>) => Promise.resolve(handleEditBloc({id, blocData: bloc}))}
                onDelete={(id: number) => Promise.resolve(handleDeleteBloc(id))}
                />
        </div>
    );
}