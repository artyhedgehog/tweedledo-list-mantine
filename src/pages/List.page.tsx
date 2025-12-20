import { useLocation } from 'react-router-dom';
import { TodoApp } from '@/components/TodoMvc/TodoApp';

export function ListPage() {
  const location = useLocation();

  return <TodoApp location={location} />;
}
