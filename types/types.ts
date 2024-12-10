// Type pour l'entité Bloc
type Bloc = {
    id: number | null;
    nom_bloc: string | null;
    etage: Etage | null;
    chambres: Chambre[]; // Liste de chambres
};

// Type pour l'entité Chambre
type Chambre = {
    id: number | null;
    numero_chambre: number | null;
    capacite: number | null;
    type_special: string | null;
    bloc: Bloc | null;
    id_block: number | null;
    etudiants: Etudiant[]; // Liste d'étudiants
    occupations: Occupation[]; // Liste d'occupations
};

// Type pour l'entité Classe
type Classe = {
    id: number | null;
    nom_classe: string | null;
    stages: Stage[]; // Liste de stages
};

// Type pour l'entité Etage
type Etage = {
    id: number | null;
    numero_etage: number | null;
    genre: string | null; // Enum Genre en tant que string
};

// Type pour l'entité Etudiant
type Etudiant = {
    id: number | null;
    nom: string | null;
    prenom: string | null;
    internat_weekend: boolean;
    genre: string | null; // Enum Genre en tant que string
    chambre: Chambre | null;
    idChambre: number | null;
    occupations: Occupation[]; // Liste d'occupations
    num_etu: number | null;
    classe: Classe | null;
    classe_id: number | null;
};

// Type pour l'entité Occupation
type Occupation = {
    id: number | null;
    date_debut: Date | null;
    date_fin: Date | null;
    etudiant: Etudiant | null;
    etudiant_id: number | null;
    chambre: Chambre | null;
    chambre_id: number | null;
};

// Type pour l'entité Stage
type Stage = {
    id: number | null;
    date_debut: Date | null;
    date_fin: Date | null;
    classe: Classe | null;
};

// Type pour l'entité Utilisateur
type Utilisateur = {
    id: number | null;
    email: string | null;
    roles: string[];
    password: string | null; // Hashed password
    plainPassword: string | null;
};
