import logo from '../../assets/images/thuonghieu.jpg';

const Logo = () => {
  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default Logo;