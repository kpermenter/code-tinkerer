import 'bulmaswatch/superhero/bulmaswatch.min.css';

export const Header: React.FC = () => {
  return (
    <div className='hero'>
      <div className='hero-body'>
        <p className='title'>
          {'<> Code Tinkerer </>'}
        </p>
        <p className='subtitle' style={{ color: '#f14668' }}>
          Let's build something awesome.
        </p>
      </div>
    </div>
  );
}
