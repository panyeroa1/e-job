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
    const { error } = await supabase
      .from('applicants')
      .insert([
        {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          experience: data.experience,
          resume_text: data.resumeText,
          extracted_data: data.extractedResume,
          created_at: new Date(data.timestamp).toISOString()
        }
      ]);

    if (error) {
      console.error('Error saving applicant:', error);
      return null;
    }
    return data.id;
  } catch (err) {
    console.error('Unexpected error saving applicant:', err);
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
      resumeText: data.resume_text,
      extractedResume: data.extracted_data,
      timestamp: new Date(data.created_at).getTime()
    };
  } catch (err) {
    console.error('Unexpected error fetching applicant:', err);
    return null;
  }
}
