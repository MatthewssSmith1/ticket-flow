import { useMemo, useState } from 'react';
import { useOrgStore } from '@/stores/orgStore';
import { MultiSelect } from './ui/multi-select';
import { Group } from '@/types/types';

type Props = {
  value: string[];
  onValueChange: (groupIds: string[]) => void;
  filter?: (group: Group) => boolean;
  placeholder?: string;
}

export function GroupMultiSelect({ value, onValueChange, filter, placeholder }: Props) {
  const { openOrg } = useOrgStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    value.map(id => id.toString())
  );

  const groups = useMemo(() =>
    openOrg?.groups?.filter(filter ?? (() => true)) ?? [], 
  [openOrg, filter]);

  const options = useMemo(() => 
    groups.map(group => ({
      label: group.name,
      value: group.id.toString()
    })),
  [groups]);

  const handleValueChange = (values: string[]) => {
    setSelectedIds(values);
    onValueChange(values);
  };

  return (
    <MultiSelect
      options={options}
      onValueChange={handleValueChange}
      defaultValue={selectedIds}
      placeholder={placeholder ?? "Select groups"}
    />
  );
}
