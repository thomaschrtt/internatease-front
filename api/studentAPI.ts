import {createClient} from "@/utils/supabase/client";

export const deleteStudent = async (id: number) => {
    const supabase = await createClient();
    await supabase
        .from('etudiant')
        .delete()
        .eq('id', id)
        .throwOnError()
}

export const addStudent = async (studentData: Partial<Etudiant>) => {
    const supabase = await createClient();
    await supabase
        .from('etudiant')
        .insert([studentData])
        .throwOnError()
}


export const fetchStudents: () => Promise<Etudiant[]> = async () => {
    const supabase = await createClient();
    try {
        const {data: etudiant, error} = await supabase
            .from('etudiant')
            .select('*, classe:classe(*)')
        if (error) {
            console.error('Error fetching students:', error)
            return []
        }
        return etudiant as Etudiant[]
    } catch (error) {
        console.error('Error fetching students:', error)
        return []
    }
}


export const fetchClasses: () => Promise<Classe[]> = async () => {
    const supabase = await createClient();
    try {
        const {data: classe, error} = await supabase
            .from('classe')
            .select(`*, stage:stage(*)`);
        if (error) {
            console.error('Error fetching classes:', error)
            return []
        }
        return classe as Classe[]
    } catch (error) {
        console.error('Error fetching classes:', error)
        return []
    }
}
