import { useQuery } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { StatusBadge } from './StatusBadge';

export function Ticket({ id }: { id: string }) {
  const { data: ticket, error, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  if (isLoading || !ticket) return <div>Loading...</div>;
  if (error) return <div>Error loading ticket</div>;

  const { subject, description, status } = ticket;

  return (
    <main className="grid grid-cols-[2fr_3fr]">
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="mb-1">{subject}</span>
          <StatusBadge status={status} /> 
        </h1>
        <div>{description}</div>
        
      </section>
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        {/* Render messages or other ticket details here */}
      </section>
    </main>
  );
} 