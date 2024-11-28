import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function useTabsIndex() {
  const router = useRouter();
  const params = useSearchParams();
  const tableIndex = params.get('tableIndex');
  let value = 0;

  switch (tableIndex) {
    case '0':
      value = 0;
      break;
    case '1':
      value = 1;
      break;
    case '2':
      value = 2;
      break;
    default:
      break;
  }

  useEffect(() => {
    if (!tableIndex) router.push('?tableIndex=0');
  }, [router, tableIndex]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(`?tableIndex=${newValue}`);
  };

  return {
    value,
    handleChange,
  };
}
