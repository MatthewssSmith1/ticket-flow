import { Select, SelectTrigger, SelectContent, SelectItem } from '@ui/select';
import { useMemo, useState } from 'react';
import { useOrgStore } from '@/stores/orgStore';
import { Member } from '@shared/types';

interface MemberSelectProps {
  memberId: number | null;
  onValueChange: (memberId: number | null) => void;
  filter?: (member: Member) => boolean;
}

export function MemberSelect({ memberId, onValueChange, filter }: MemberSelectProps) {
  const { openOrg, getMemberName } = useOrgStore();
  const [value, setValue] = useState<number | null>(memberId);

  const members = useMemo(() =>
    openOrg?.members?.filter(filter ?? (() => true)) ?? [], 
  [openOrg, filter]);

  const handleValueChange = (idStr: string | undefined) => {
    const id = idStr ? parseInt(idStr) : null;
    const selectedMember = members.find(member => member.id === id);
    onValueChange(selectedMember ? selectedMember.id : null);
    setValue(id);
  };

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className="max-w-[200px]">
        {getMemberName(value) || 'Select a member'}
      </SelectTrigger>
      <SelectContent>
        {members.map(member => (
          <SelectItem key={member.id} value={member.id.toString()}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
