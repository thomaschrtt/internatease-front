import {createClient} from "@/utils/supabase/client";

export const fetchStays: () => Promise<Occupation[]> = async () => {
    const supabase = await createClient();
    try {
        const {data: sejour, error} = await supabase
            .from('occupation')
            .select('*, chambre:chambre(*), etudiant:etudiant(*)')
            .order('date_debut', {ascending: false})
        if (error) {
            console.error('Error fetching stays:', error)
            return []
        }
        return sejour as Occupation[]
    } catch (error) {
        console.error('Error fetching stays:', error)
        return []
    }
}

export const deleteStay: (stayId: number) => Promise<void> = async (stayId: number) => {
    const supabase = await createClient();
    await supabase
        .from('occupation')
        .delete()
        .eq('id', stayId)
        .throwOnError()
}
export const editStay = async (stayId: number, dateFin: string) => {
    const supabase = await createClient();
    await supabase
        .from('occupation')
        .update({date_fin: dateFin})
        .eq('id', stayId)
        .throwOnError()
}

export const normalizeDateToLocalMidnight = (date: Date): Date => {
    const offset = date.getTimezoneOffset(); // Décalage en minutes
    const normalizedDate = new Date(date.getTime() - offset * 60 * 1000);
    return new Date(normalizedDate.toISOString().split('T')[0]); // Fixe l'heure à 00:00:00
};


export const addStay = async (stay: OccupationInsert) => {
    const supabase = await createClient();
    stay.date_debut = normalizeDateToLocalMidnight(stay.date_debut);
    stay.date_fin = normalizeDateToLocalMidnight(stay.date_fin);
    await supabase
        .from('occupation')
        .insert([stay])
        .throwOnError()
}

export const searchAvailableRoom =
    async (
        searchStartDate: string | undefined,
        searchEndDate: string | undefined,
        excludedStudentIds: number[] = [],
        excludedChambreIds: number[] = []
    ) => {
        if (!searchStartDate || !searchEndDate) {
            return []
        }
        const supabase = await createClient();
        const {data: availableRooms, error} = await supabase
            .rpc('get_available_rooms', {
                p_date_debut: searchStartDate,
                p_date_fin: searchEndDate,
                p_excluded_student_ids: excludedStudentIds,
                p_excluded_chambre_ids: excludedChambreIds
            });
        console.log((availableRooms as AvailableChambre[]).filter(room => room.numero_chambre === 101))
        if (error) {
            console.error('Error fetching available rooms:', error)
            return []
        }

        return availableRooms as AvailableChambre[]
    }

export const searchAvailableStudents = async (searchStartDate: string | undefined, searchEndDate: string | undefined) => {
    if (!searchStartDate || !searchEndDate) {
        return []
    }
    const supabase = await createClient();
    const {data: availableStudents, error} = await supabase
        .rpc('get_unassigned_students', {
            p_date_debut: searchStartDate,
            p_date_fin: searchEndDate
        });
    if (error) {
        console.error('Error fetching available students:', error)
        return []
    }

    return availableStudents as AvailableEtudiant[]
}


export const moveStudent: (data: MoveStudentData) => Promise<void> = async (data: MoveStudentData) => {
    const supabase = await createClient();
    await supabase.rpc('move_student', data)
}

