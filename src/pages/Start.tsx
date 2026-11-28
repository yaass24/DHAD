import { KidScene } from '../art/KidScene';
import { AdultStage } from '../art/AdultArt';
import { Dhaw } from '../art/Mascot';
import { useDispatch, useGame } from '../state/store';
import { navigate } from '../utils/router';
import { playSound } from '../utils/sound';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

export function Start() {
  const dispatch = useDispatch();
  const { experience } = useGame();
  const go = (e: 'kids' | 'adults') => {
    playSound('click');
    dispatch({ type: 'setExperience', experience: e });
    navigate(e === 'kids' ? '/kids' : '/adults');
  };
  return (
    <>
      <PageHeader title="اختر تجربتك" lead="لكل تجربة أسلوبها ومحتواها. لا يُحدَّد المستوى بالعمر، فاختر ما يناسبك، ويمكنك التبديل في أي وقت." back="/" backLabel="الرئيسية">
        <Dhaw mood="happy" size={80} className="ph-dhaw" />
      </PageHeader>
      <section className="section">
        <div className="container choose-grid">
          <button type="button" className={'choose-card choose-kids' + (experience === 'kids' ? ' is-last' : '')} onClick={() => go('kids')}>
            <KidScene background="park" characters={[{ id: 'layan', expression: 'excited', x: 330 }, { id: 'khalid', expression: 'happy', x: 500, flip: true }]} props={[{ id: 'swing', x: 680, y: 410 }]} />
            <span className="choose-body">
              <strong>حكايات ضاد · للأطفال</strong>
              <span>قصص مصوّرة ملوّنة، وكلمات ناقصة تُكمل بها الحوار، ونجوم ومكافآت.</span>
              <span className="choose-cta">
                ادخل عالم الحكايات <Icon name="next" size={18} />
              </span>
            </span>
            {experience === 'kids' && <span className="last-tag">آخر تجربة لك</span>}
          </button>
          <button type="button" className={'choose-card choose-adults' + (experience === 'adults' ? ' is-last' : '')} onClick={() => go('adults')}>
            <AdultStage backdrop="interview" speaker="fahad" mood="smile" />
            <span className="choose-body">
              <strong>ضاد في العمل</strong>
              <span>ثلاثة مسارات: تدريبات نحوية على جمل من العمل مع شرح الإعراب، ودروس بلاغة، وكتابة رسائل مهنية.</span>
              <span className="choose-cta">
                ادخل مسار العمل <Icon name="next" size={18} />
              </span>
            </span>
            {experience === 'adults' && <span className="last-tag">آخر تجربة لك</span>}
          </button>
        </div>
      </section>
    </>
  );
}
