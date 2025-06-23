import {createClient} from "@/utils/supabase/client";

export const fetchRooms: () => Promise<Chambre[]> = async () => {
    const supabase = await createClient();
    try {
        const {data: chambre, error} = await supabase
            .from('chambre')
            .select('*, bloc:bloc(*, etage:etage(*))')
        if (error) {
            console.error('Error fetching rooms:', error)
            return []
        }
        return chambre as Chambre[]
    } catch (error) {
        console.error('Error fetching rooms:', error)
        return []
    }
}

export const fetchBlocs: () => Promise<Bloc[]> = async () => {
    const supabase = await createClient();
    try {
        const {data: bloc, error} = await supabase
            .from('bloc')
            .select('*, etage:etage(*), chambres:chambre(*)')
        if (error) {
            console.error('Error fetching blocks:', error)
            return []
        }
        return bloc as Bloc[]
    } catch (error) {
        console.error('Error fetching blocks:', error)
        return []
    }
}

export const fetchEtages: () => Promise<Etage[]> = async () => {
    const supabase = await createClient();
    try {
        const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" format
        const {data: etage, error} = await supabase
            .from('etage')
            .select('*, blocs:bloc(*, chambres:chambre(*, bloc:bloc(*, etage:etage(*)), occupations:occupation(*, etudiant:etudiant(*, classe:classe(*)))))')
            .lte('blocs.chambres.occupations.date_debut', today)
            .gt('blocs.chambres.occupations.date_fin', today)

        if (error) {
            console.error('Error fetching floors:', error)
            return []
        }
        return etage as Etage[]
    } catch (error) {
        console.error('Error fetching floors:', error)
        return []
    }
}

export async function  fetchEtageForSpecificDate (date: string): Promise<Etage[]>  {
    const supabase = await createClient();
    try {
        const {data: etage, error} = await supabase
            .from('etage')
            .select('*, blocs:bloc(*, chambres:chambre(*, bloc:bloc(*, etage:etage(*)), occupations:occupation(*, etudiant:etudiant(*, classe:classe(*)))))')
            .lte('blocs.chambres.occupations.date_debut', date)
            .gt('blocs.chambres.occupations.date_fin', date)

        if (error) {
            console.error('Error fetching floors:', error)
            return []
        }
        return etage as Etage[]
    } catch (error) {
        console.error('Error fetching floors:', error)
        return []
    }
}

export const fetchRoomStays: (roomId: number) => Promise<Occupation[]> = async (roomId: number) => {
    const supabase = await createClient();
    const {data: occupation, error} = await supabase
        .from('occupation')
        .select('*, etudiant:etudiant(*)')
        .eq('chambre_id', roomId)
        .order('date_debut', {ascending: false})
    if (error) {
        console.error('Error fetching room stays:', error)
        return []
    }
    return occupation as Occupation[]

}

export const addRoom = async (room: Partial<Chambre>) => {
    const supabase = await createClient();
    await supabase
        .from('chambre')
        .insert([room])
        .throwOnError()
}

export const addBloc = async (bloc: Partial<Etage>) => {
    const supabase = await createClient();
    await supabase
        .from('bloc')
        .insert([bloc])
        .throwOnError()
}

export const addEtage = async (etage: Partial<Etage>) => {
    const supabase = await createClient();
    await supabase
        .from('etage')
        .insert([etage])
        .throwOnError()
}

export const editRoom = async (id: number, room: Partial<Chambre>) => {
    const supabase = await createClient();
    console.log('Editing room with ID:', id, 'and data:', room);
    await supabase
        .from('chambre')
        .update(room)
        .eq('id', id)
        .throwOnError()
}

export const editBloc = async (id: number, bloc: Partial<Bloc>) => {
    const supabase = await createClient();
    await supabase
        .from('bloc')
        .update(bloc)
        .eq('id', id)
        .throwOnError()
}
export const editEtage = async (id: number, etage: Partial<Etage>) => {
    const supabase = await createClient();
    await supabase
        .from('etage')
        .update(etage)
        .eq('id', id)
        .throwOnError()
}
export const deleteRoom = async (id: number) => {
    const supabase = await createClient();
    await supabase
        .from('chambre')
        .delete()
        .eq('id', id)
        .throwOnError()
}
export const deleteBloc = async (id: number) => {
    const supabase = await createClient();
    await supabase
        .from('bloc')
        .delete()
        .eq('id', id)
        .throwOnError()
}
export const deleteEtage = async (id: number) => {
    const supabase = await createClient();
    await supabase
        .from('etage')
        .delete()
        .eq('id', id)
        .throwOnError()
}