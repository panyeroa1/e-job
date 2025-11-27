import { createClient } from '@supabase/supabase-js';
import { ApplicantData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Persistence will not work.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function saveApplicant(data: ApplicantData): Promise<string | null> {
  try {
    console.log('Attempting to save to Supabase:', data);
    
    const { error } = await supabase
      .from('applicants')
      .insert([
        {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          experience: data.experience,
          resume_data: data.extractedResume,
          photo_url: data.photoBase64 ? `data:image/jpeg;base64,${data.photoBase64}` : null,
          status: 'applied'
        }
      ]);

    if (error) {
      console.error('Supabase save error:', error);
      alert('Error saving to database: ' + error.message);
      return null;
    }
    
    console.log('Successfully saved to Supabase with ID:', data.id);
    return data.id;
  } catch (err) {
    console.error('Unexpected error saving applicant:', err);
    alert('Unexpected error: ' + err);
    return null;
  }
}

export async function getApplicant(id: string): Promise<ApplicantData | null> {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching applicant:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      experience: data.experience,
      resumeText: '',
      extractedResume: data.resume_data,
      photoBase64: data.photo_url?.replace('data:image/jpeg;base64,', '') || undefined,
      timestamp: new Date(data.created_at).getTime()
    };
  } catch (err) {
    console.error('Unexpected error fetching applicant:', err);
    return null;
  }
}
