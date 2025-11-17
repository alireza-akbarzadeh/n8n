import { PAGINAITION } from '@/config/constants';
import * as React from 'react';

interface UseEntitySearchArgs<T> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchArgs<T>) {
  const [localSearch, setLocalSearch] = React.useState(params.search);

  React.useEffect(() => {
    if (localSearch === '' && params.search !== '') {
      setParams({ ...params, search: '', page: PAGINAITION.DEFAULT_PAGE });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({ ...params, search: localSearch, page: PAGINAITION.DEFAULT_PAGE });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debounceMs]);

  React.useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
