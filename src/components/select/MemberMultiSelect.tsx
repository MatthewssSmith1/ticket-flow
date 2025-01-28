import { UserIcon, UserPen, UserCog } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MultiSelect } from '@ui/multi-select';
import { useOrgStore } from '@/stores/orgStore';
import { Member } from '@shared/types';

type Props = {
  value: number[];
  onValueChange: (memberIds: number[]) => void;
  filter?: (member: Member) => boolean;
  placeholder?: string;
}

export function MemberMultiSelect({ value, onValueChange, filter, placeholder }: Props) {
  const { openOrg } = useOrgStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    value.map(id => id.toString())
  );

  const members = useMemo(() =>
    openOrg?.members?.filter(filter ?? (() => true)) ?? [], 
  [openOrg, filter]);

  const options = useMemo(() => 
    members.map(member => ({
      label: member.name,
      value: member.id.toString(),
      icon: () => <MemberIcon role={member.role} />
    })),
  [members]);

  const handleValueChange = (values: string[]) => {
    setSelectedIds(values);
    onValueChange(values.map(v => parseInt(v)));
  };

  return (
    <MultiSelect
      options={options}
      onValueChange={handleValueChange}
      defaultValue={selectedIds}
      placeholder={placeholder ?? "Select members"}
    />
  );
}

// different lucide icons for different roles
function MemberIcon({ role }: { role: string }) {
  switch (role) {
    case 'OWNER': return <UserCog />;
    case 'ADMIN': return <UserPen />;
    case 'AGENT': return <UserIcon />;
    case 'CUSTOMER': return <UserIcon />;
  }
}