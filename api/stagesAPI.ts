import {createClient} from "@/utils/supabase/client";
import {format} from "date-fns";

export const deleteStage = async (id: number) => {
    const supabase = await createClient();
    await supabase
        .from('stage')
        .delete()
        .eq('id', id)
        .throwOnError()
}

export const addStage = async (stage: Partial<Stage>) => {
    if (!stage.date_debut || !stage.date_fin || !stage.classe) throw new Error('Invalid stage data')
    const supabase = await createClient();
    const stageData: AddStageData = {
        date_debut: new Date(format(stage.date_debut, 'yyyy-MM-dd')),
        date_fin: new Date(format(stage.date_fin, 'yyyy-MM-dd')),
        classe_id: stage.classe.id
    }
    await supabase
        .from('stage')
        .insert([stageData])
        .throwOnError()
}

export const editStage = async (id: number, stage: Partial<Stage>) => {
    if (!stage.date_debut || !stage.date_fin || !stage.classe) throw new Error('Invalid stage data: ' + JSON.stringify(stage))
    const supabase = await createClient();
    const stageData: AddStageData = {
        date_debut: new Date(format(stage.date_debut, 'yyyy-MM-dd')),
        date_fin: new Date(format(stage.date_fin, 'yyyy-MM-dd')),
        classe_id: stage.classe.id
    }
    await supabase
        .from('stage')
        .update(stageData)
        .eq('id', id)
        .throwOnError()
}

export const fetchStages = async () => {
    const supabase = await createClient();
    const {data} = await supabase
        .from('stage')
        .select('*, classe:classe(*)')
        .order('date_debut', {ascending: true})
        .order('classe_id', {ascending: true})
        .throwOnError()
    return data
}