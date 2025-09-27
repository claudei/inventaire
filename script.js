import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://tvadlycxavdbnaklbxrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YWRseWN4YXZkYm5ha2xieHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4Mjc3OTIsImV4cCI6MjA3NDQwMzc5Mn0.RRTbSenOV4sAeoibw8XaBT9Cikds0k89nYpVWwEYKcI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour récupérer l'inventaire
async function fetchInventory() {
  const { data: inventory, error } = await supabase
    .from('inventaire')
    .select('*');
  if (error) console.error('Erreur lors de la récupération :', error);
  return inventory;
}

// Fonction pour ajouter un nouvel article
window.ajouterProduit = async function(name, qty) {
  const { data, error } = await supabase
    .from('inventaire')
    .insert([{ name, qty }]);
  if (error) alert('Erreur ajout : ' + error.message);
  await chargerInventaireInitial();
  return data;
}

// Fonction pour supprimer un article
window.supprimerProduit = async function(id) {
  const { data, error } = await supabase
    .from('inventaire')
    .delete()
    .eq('id', id);
  if (error) alert('Erreur suppression : ' + error.message);
  await chargerInventaireInitial();
  return data;
}

// Synchronisation en temps réel
supabase
  .channel('inventaire-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'inventaire' }, payload => {
    console.log('Changement inventaire:', payload);
    chargerInventaireInitial();
  })
  .subscribe();

// Fonction d'affichage et chargement initial
async function chargerInventaireInitial() {
  const produits = await fetchInventory();
  const tbody = document.getElementById('inventaire-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (produits) {
    produits.forEach(produit => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${produit.category || ''}</td>
        <td>${produit.name}</td>
        <td>${produit.length || ''}</td>
        <td>${produit.weight || ''}</td>
        <td>${produit.price_per_lb || ''}</td>
        <td>${produit.price_per_bar || ''}</td>
        <td>${produit.qty}</td>
        <td>${produit.min_threshold || ''}</td>
        <td>${produit.to_order || ''}</td>
        <td>${produit.total_value || ''}</td>
        <td><button class="btn btn-remove" onclick="supprimerProduit(${produit.id})">Supprimer</button></td>
      `;
      tbody.appendChild(row);
    });
  }
}
window.onload = chargerInventaireInitial;