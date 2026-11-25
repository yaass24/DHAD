import { getStory, storyLockedBy } from '../data';
import { useGame } from '../state/store';
import { StoryPlayer } from '../features/children/StoryPlayer';
import { NotFound } from './NotFound';
import { Link } from '../utils/router';

export function StoryPlay({ id }: { id: string }) {
  const story = getStory(id);
  const s = useGame();
  if (!story) return <NotFound />;
  const lockedBy = storyLockedBy(s, id);
  if (lockedBy)
    return (
      <div className="container section center">
        <h1>هذه الحكاية مقفلة</h1>
        <p>أكمل حكاية «{lockedBy.title}» لتفتحها.</p>
        <Link to={`/kids/story/${lockedBy.id}`} className="btn btn-primary">
          اذهب إلى «{lockedBy.title}»
        </Link>
      </div>
    );
  return <StoryPlayer key={id} story={story} />;
}
