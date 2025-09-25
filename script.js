// Code for Supabase connection script with real-time synchronization
// Mock Supabase implementation for demonstration purposes

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';

// Mock Supabase client and channel functionality
class MockSupabaseChannel {
  constructor(channelName) {
    this.channelName = channelName;
    this.listeners = [];
  }
  
  on(eventType, config, callback) {
    this.listeners.push({ eventType, config, callback });
    return this;
  }
  
  subscribe(statusCallback) {
    console.log(`Subscribed to channel: ${this.channelName}`);
    if (statusCallback) {
      statusCallback('SUBSCRIBED');
    }
    return this;
  }
  
  // Simulate receiving a real-time event
  simulateEvent(eventType, payload) {
    this.listeners.forEach(listener => {
      if (listener.eventType === 'postgres_changes' || listener.eventType === '*') {
        listener.callback({
          eventType: eventType,
          new: payload.new || null,
          old: payload.old || null
        });
      }
    });
  }
}

class MockSupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
    this.channels = new Map();
  }
  
  channel(channelName) {
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, new MockSupabaseChannel(channelName));
    }
    return this.channels.get(channelName);
  }
  
  removeChannel(channel) {
    for (let [name, ch] of this.channels.entries()) {
      if (ch === channel) {
        this.channels.delete(name);
        break;
      }
    }
  }
}

// Create mock supabase client
let supabaseClient = new MockSupabaseClient(supabaseUrl, supabaseKey);
let inventaireChannel = null;

// Initialize real-time subscription for inventaire table
function initRealtimeSync() {
  console.log('Initializing real-time sync...');
  
  if (inventaireChannel) {
    supabaseClient.removeChannel(inventaireChannel);
  }

  inventaireChannel = supabaseClient
    .channel('inventaire-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'inventaire'
      },
      (payload) => {
        console.log('Real-time change detected:', payload);
        handleInventaireChange(payload);
      }
    )
    .subscribe((status) => {
      console.log('Supabase real-time subscription status:', status);
    });
    
  // Simulate some test events after a delay
  setTimeout(() => {
    console.log('Simulating real-time events for demonstration...');
    simulateRealtimeEvent();
  }, 3000);
}

// Handle real-time changes to inventaire table
function handleInventaireChange(payload) {
  const { eventType, new: newRecord, old: oldRecord } = payload;
  
  switch (eventType) {
    case 'INSERT':
      console.log('New product inserted:', newRecord);
      // Add to local produits array if it doesn't exist
      if (newRecord && !produits.find(p => p.nom === newRecord.nom)) {
        produits.push({
          nom: newRecord.nom,
          categorie: newRecord.categorie,
          longueur: parseFloat(newRecord.longueur) || 0,
          poids: parseFloat(newRecord.poids) || 0,
          prixLivre: parseFloat(newRecord.prix_livre) || 0,
          seuil: parseFloat(newRecord.seuil) || 0
        });
        // Update inventory display
        if (typeof majInventaire === 'function') {
          majInventaire();
        }
        if (typeof majProduitInventaire === 'function') {
          majProduitInventaire();
        }
        console.log('Product added to local inventory');
      }
      break;
      
    case 'UPDATE':
      console.log('Product updated:', newRecord);
      // Update local produits array
      if (newRecord) {
        const index = produits.findIndex(p => p.nom === newRecord.nom);
        if (index !== -1) {
          produits[index] = {
            nom: newRecord.nom,
            categorie: newRecord.categorie,
            longueur: parseFloat(newRecord.longueur) || 0,
            poids: parseFloat(newRecord.poids) || 0,
            prixLivre: parseFloat(newRecord.prix_livre) || 0,
            seuil: parseFloat(newRecord.seuil) || 0
          };
          // Update inventory display
          if (typeof majInventaire === 'function') {
            majInventaire();
          }
          if (typeof majProduitInventaire === 'function') {
            majProduitInventaire();
          }
          console.log('Product updated in local inventory');
        }
      }
      break;
      
    case 'DELETE':
      console.log('Product deleted:', oldRecord);
      // Remove from local produits array
      if (oldRecord) {
        const index = produits.findIndex(p => p.nom === oldRecord.nom);
        if (index !== -1) {
          produits.splice(index, 1);
          // Update inventory display
          if (typeof majInventaire === 'function') {
            majInventaire();
          }
          if (typeof majProduitInventaire === 'function') {
            majProduitInventaire();
          }
          console.log('Product removed from local inventory');
        }
      }
      break;
  }
}

// Simulate real-time events for demonstration
function simulateRealtimeEvent() {
  if (!inventaireChannel) return;
  
  // Simulate an INSERT event
  setTimeout(() => {
    inventaireChannel.simulateEvent('INSERT', {
      new: {
        nom: 'Tube Acier Demo',
        categorie: 'Acier',
        longueur: 12,
        poids: 1.5,
        prix_livre: 2.8,
        seuil: 5
      }
    });
  }, 1000);
  
  // Simulate an UPDATE event
  setTimeout(() => {
    inventaireChannel.simulateEvent('UPDATE', {
      new: {
        nom: 'Tube Acier Demo',
        categorie: 'Acier',
        longueur: 12,
        poids: 1.5,
        prix_livre: 3.0, // Price updated
        seuil: 8 // Threshold updated
      }
    });
  }, 3000);
  
  // Simulate a DELETE event
  setTimeout(() => {
    inventaireChannel.simulateEvent('DELETE', {
      old: {
        nom: 'Tube Acier Demo',
        categorie: 'Acier'
      }
    });
  }, 6000);
}

// Cleanup function to remove subscription
function cleanupRealtimeSync() {
  if (inventaireChannel && supabaseClient) {
    supabaseClient.removeChannel(inventaireChannel);
    inventaireChannel = null;
    console.log('Real-time sync cleaned up');
  }
}

// Export functions to global scope
window.initRealtimeSync = initRealtimeSync;
window.cleanupRealtimeSync = cleanupRealtimeSync;
window.simulateRealtimeEvent = simulateRealtimeEvent;
window.supabaseClient = supabaseClient;