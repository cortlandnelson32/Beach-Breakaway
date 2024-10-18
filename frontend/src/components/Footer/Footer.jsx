import './Footer.css';
export default function Footer() {
  return (
    <div className='footer'>
      <div className='footer-left'>
        <h3>Cortland Nelson ©2024</h3>
      </div>
      <div className="footer-right">
        <a href="https://github.com/cortlandnelson32" target="_blank" rel="noopener noreferrer">
          <i className="fa fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/cortland-nelson/" target="_blank" rel="noopener noreferrer">
          <i className="fa fa-linkedin"></i>
        </a>
      </div>
    </div>
  )
}
