// Code for Supabase connection script with authentication support
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helper functions
export const auth = {
  // Sign up a new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    return { user: data.user, error };
  },

  // Sign in an existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { user: data.user, error };
  },

  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current user
  getCurrentUser() {
    return supabase.auth.getUser();
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions with RLS support
export const database = {
  // Inventory operations
  async getInventaire() {
    const { data, error } = await supabase
      .from('inventaire')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addInventaire(item) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');
    
    const { data, error } = await supabase
      .from('inventaire')
      .insert([{ ...item, user_id: user.id }]);
    return { data, error };
  },

  async updateInventaire(id, updates) {
    const { data, error } = await supabase
      .from('inventaire')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  async deleteInventaire(id) {
    const { data, error } = await supabase
      .from('inventaire')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Categories operations
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nom');
    return { data, error };
  },

  // Projects operations
  async getProjets() {
    const { data, error } = await supabase
      .from('projets')
      .select('*')
      .order('nom');
    return { data, error };
  },

  // Movements operations
  async getMouvements() {
    const { data, error } = await supabase
      .from('mouvements')
      .select('*')
      .order('date', { ascending: false });
    return { data, error };
  }
};

export default supabase;