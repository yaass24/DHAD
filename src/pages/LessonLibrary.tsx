import { LESSONS } from '../data/lessons';
import { PageHeader } from '../components/PageHeader';
import { LessonCard } from '../components/LessonCard';

export function LessonLibrary() {
  return (
    <div className="theme-adults">
      <PageHeader title="دروس البلاغة" lead="أربعة دروس قصيرة: شرح موجز بشواهد من القرآن والحديث والشعر، ثم أسئلة تطبيقية تشرح سبب كل إجابة." back="/adults" backLabel="ضاد للكبار" tone="adults" />
      <section className="section">
        <div className="container lesson-list">
          {LESSONS.map((l, i) => (
            <LessonCard key={l.id} lesson={l} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
