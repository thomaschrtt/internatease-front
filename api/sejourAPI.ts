import axios from "@/api/Axios";

export const fetchStays = async () => {
    try {
        const response = await axios.get('/api/occupations');
       return response.data.member
    } catch (error) {
        console.error('Error fetching stays:', error)
    }
}

export const fetchRooms = async () => {
    try {
        const response = await axios.get('/api/chambres');
        return response.data.member
    } catch (error) {
        console.error('Error fetching rooms:', error)
    }
}

export const fetchStudents = async () => {
    try {
        const response = await axios.get('/api/etudiants');
        return response.data.member
    } catch (error) {
        console.error('Error fetching students:', error)
    }
}

export const editStay = async (stayId: number, dateFin: string) => {
    try {
        await axios.patch(`/api/occupations/${stayId}`, {date_fin: dateFin}, {
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
        });
    } catch (error) {
        console.error('Error editing stay:', error);
    }
}

export const addStay = async (date_debut: Date, date_fin: Date, chambre_id: number, etudiant_id: number) => {
    try {
        await axios.post('/api/occupations', {date_debut, date_fin, chambre_id, etudiant_id}, {
            headers: {
                'Content-Type': 'application/ld+json',
            },
        });
    } catch (error) {
        console.error('Error adding stay:', error);
    }
}

export const searchAvailableStudents = async (searchStartDate: string, searchEndDate: string) => {
    try {
        const response = await axios.get(`/api/available-students?date_debut=${searchStartDate}&date_fin=${searchEndDate}`);
        return response.data
    } catch (error) {
        console.error('Error fetching available students:', error);
    }
}