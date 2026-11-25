import { getLesson } from '../data/lessons';
import { LessonPlayer } from '../features/adults/LessonPlayer';
import { NotFound } from './NotFound';

export function LessonPlay({ id }: { id: string }) {
  const lesson = getLesson(id);
  if (!lesson) return <NotFound />;
  return <LessonPlayer key={lesson.id} lesson={lesson} />;
}
