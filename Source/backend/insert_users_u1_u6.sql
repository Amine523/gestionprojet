-- Vérifier les utilisateurs existants
SELECT Id, Nom, Email, TypeUtilisateurId FROM Utilisateurs WHERE Email LIKE '%softpro.com%' OR Email LIKE '%softpro.tn%';

-- Mise à jour des utilisateurs existants avec le mot de passe SoftPro
UPDATE Utilisateurs SET MotDePasse = 'SoftPro' WHERE Email = 'admin@softpro.com';
UPDATE Utilisateurs SET MotDePasse = 'SoftPro' WHERE Email = 'adminS@softpro.com';
UPDATE Utilisateurs SET MotDePasse = 'SoftPro' WHERE Email = 'chef@softpro.com';
UPDATE Utilisateurs SET MotDePasse = 'SoftPro' WHERE Email = 'dev1@softpro.com';
UPDATE Utilisateurs SET MotDePasse = 'SoftPro' WHERE Email = 'rh@softpro.com';
UPDATE Utilisateurs SET MotDePasse = 'SoftPro' WHERE Email = 'qa@softpro.com';