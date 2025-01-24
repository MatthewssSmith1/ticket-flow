import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select';
import { useOrgStore } from '@/stores/orgStore';
import { useState } from 'react';

interface MemberSelectProps {
  memberId: number | null;
  onValueChange: (memberId: number | null) => void;
}

export function MemberSelect({ memberId, onValueChange }: MemberSelectProps) {
  const { members } = useOrgStore();
  const [value, setValue] = useState<number | null>(memberId);

  const handleValueChange = (idStr: string | undefined) => {
    const id = idStr ? parseInt(idStr) : null;
    const selectedMember = members?.find(member => member.id === id);
    onValueChange(selectedMember ? selectedMember.id : null);
    setValue(id);
  };

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className="max-w-[200px]">
        {members?.find(member => member.id === value)?.name || 'Select a member'}
      </SelectTrigger>
      <SelectContent>
        {members?.map(member => (
          <SelectItem key={member.id} value={member.id.toString()}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
