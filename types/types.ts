// Type pour l'entité Bloc
type Bloc = {
    id: number;
    nom_bloc: string;
    etage: Etage;
    chambres: Chambre[]; // Liste de chambres
};

// Type pour l'entité Chambre
type Chambre = {
    id: number;
    numero_chambre: number;
    capacite: number;
    type_special: string | null;
    bloc: Bloc;
    bloc_id: number;
    etudiants: Etudiant[]; // Liste d'étudiants
    occupations: Occupation[]; // Liste d'occupations
};

type AvailableChambre = {
    chambre_id: number;
    numero_chambre: number;
    etage_id: number;
    genre: null;
    nom_bloc: string;
    numero_etage: number;
    capacite: number;
    type_special: string | null;
    bloc_id: number;
}

type AvailableEtudiant = {
    etudiant_id: number,
    nom: string,
    prenom: string,
    genre: string,
    num_etu: number,
    classe_id: number,
    internat_weekend: boolean
}

type MoveStudentData = {
    p_etudiant_id: number,
    p_new_chambre_id: number,
    p_date_debut: string,
    p_is_definitive: boolean,
    p_stay_id: number
}


// Type pour l'entité Classe
type Classe = {
    id: number;
    nom_classe: string;
    stages: Stage[]; // Liste de stages
};

// Type pour l'entité Etage
type Etage = {
    id: number;
    numero_etage: number;
    genre: string | null; // Enum Genre en tant que string
    blocs: Bloc[]; // Liste de blocs
};

// Type pour l'entité Etudiant
type Etudiant = {
    id: number;
    nom: string;
    prenom: string;
    internat_weekend: boolean;
    genre: string;
    occupations: Occupation[]; // Liste d'occupations
    num_etu: number;
    classe: Classe;
    classe_id: number;
};

// Type pour l'entité Occupation
type Occupation = {
    id: number;
    date_debut: Date;
    date_fin: Date;
    etudiant: Etudiant;
    etudiant_id: number;
    chambre: Chambre;
    chambre_id: number;
};

type OccupationInsert = Omit<Occupation, 'id' | 'chambre' | 'etudiant'>

type ChambreInsert = Omit<Chambre, 'id' | 'bloc' | 'etudiants' | 'occupations'>

// Type pour l'entité Stage
type Stage = {
    id: number;
    date_debut: Date;
    date_fin: Date;
    classe: Classe;
};
