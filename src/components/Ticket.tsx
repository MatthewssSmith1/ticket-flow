import supabase, { unwrap } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Pill } from './Pill';

const getTicket = (id: string) => ({
  queryKey: ['ticket', id],
  queryFn: async () => (
    await supabase.from('tickets')
      .select('*')
      .eq('id', id)
      .single()
      .then(unwrap)
  )
});

export function Ticket({ id }: { id: string }) {
  const { data: ticket, error, isLoading } = useQuery(getTicket(id));

  if (isLoading || !ticket) return <div>Loading...</div>;
  if (error) return <div>Error loading ticket</div>;

  const { subject, description, status } = ticket;

  return (
    <main className="grid grid-cols-[2fr_3fr]">
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="mb-1">{subject}</span>
          <Pill text={status} /> 
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