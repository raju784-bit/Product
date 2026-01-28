
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqrrnwzvjptmkgpttfhk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnJud3p2anB0bWtncHR0ZmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1Mzk0NzcsImV4cCI6MjA4NTExNTQ3N30.TD6r957Mnv4rPqF_d1TXIxHIqTe_T6BU9IZUGt9qYX4';

export const supabase = createClient(supabaseUrl, supabaseKey);
