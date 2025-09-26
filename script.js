// Initialisation de Supabase
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour récupérer l'inventaire
async function fetchInventory() {
    const { data: inventory, error } = await supabase
        .from('inventory')
        .select('*');
    if (error) console.error('Erreur lors de la récupération de l'inventaire:', error);
    return inventory;
}

// Fonction pour ajouter un nouvel article
async function addItem(item) {
    const { data, error } = await supabase
        .from('inventory')
        .insert([{ item }]);
    if (error) console.error('Erreur lors de l'ajout de l'article:', error);
    return data;
}

// Fonction pour supprimer un article
async function deleteItem(id) {
    const { data, error } = await supabase
        .from('inventory')
        .delete()
        .match({ id });
    if (error) console.error('Erreur lors de la suppression de l'article:', error);
    return data;
}

// Synchronisation en temps réel
supabase
    .from('inventory')
    .on('INSERT', payload => {
        console.log('Nouvel article ajouté:', payload.new);
        // Mettre à jour l'UI ici
    })
    .on('DELETE', payload => {
        console.log('Article supprimé:', payload.old);
        // Mettre à jour l'UI ici
    })
    .subscribe();

// Fonction pour persister l'inventaire après le rechargement
window.addEventListener('load', async () => {
    const inventory = await fetchInventory();
    console.log('Inventaire récupéré:', inventory);
    // Afficher l'inventaire dans l'UI ici
});