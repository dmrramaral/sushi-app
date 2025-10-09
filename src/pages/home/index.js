import { useNavigate } from 'react-router-dom';
import './style.css';

const Home = () => {
  const navigate = useNavigate();
  
  const handleReservarMesa = () => {
    navigate('/login');
  };
  
  const handleVerCardapio = () => {
    navigate('/cardapio');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-container">
          <img src="https://img.freepik.com/premium-vector/sushi-logo-design_9845-32.jpg" alt="Sushi House Logo" className="logo" />
        </div>
        <h1>Bem-vindo ao Sushi House</h1>
        <p>Experimente o melhor do sushi com rodízio e pedidos à la carte!</p>
      </header>
      
      <section className="home-hero">
        <div className="hero-content">
          <h2>Descubra a Autêntica Culinária Japonesa</h2>
          <p>Pratos preparados por chefs especializados com ingredientes frescos e técnicas tradicionais.</p>
        </div>
        <div className="hero-image">
          <img src="https://img.freepik.com/free-photo/side-view-sushi-set-with-soy-sauce-chopsticks-wooden-serving-board_176474-3234.jpg" alt="Variedade de sushi" />
        </div>
      </section>

      <section className="home-options">
        <div className="option-card">
          <img src="https://img.freepik.com/free-photo/delicious-sushi-arrangement_23-2149061769.jpg" alt="Rodízio de Sushi" />
          <h2>Rodízio</h2>
          <p>Desfrute de uma variedade ilimitada de sushis, sashimis e pratos quentes por um preço fixo.</p>
          <ul className="features-list">
            <li>Mais de 50 opções de sushi</li>
            <li>Pratos quentes inclusos</li>
            <li>Sobremesas japonesas</li>
            <li>Bebidas à parte</li>
          </ul>
          <button className="cta-button" onClick={handleReservarMesa}>Reservar Mesa</button>
        </div>
        
        <div className="option-card">
          <img src="https://img.freepik.com/free-photo/delicious-japanese-food-arrangement_23-2149116758.jpg" alt="Sushi à la carte" />
          <h2>À La Carte</h2>
          <p>Prefere escolher? Monte seu pedido com nossos pratos exclusivos e combos especiais.</p>
          <ul className="features-list">
            <li>Combos econômicos</li>
            <li>Pratos exclusivos</li>
            <li>Entrega rápida</li>
            <li>Peça pelo aplicativo</li>
          </ul>
          <button className="cta-button" onClick={handleVerCardapio}>Ver Cardápio</button>
        </div>
      </section>

      <section className="popular-dishes">
        <h2>Pratos Populares</h2>
        <div className="dishes-grid">
          <div className="dish-item">
            <img src="https://img.freepik.com/premium-photo/sushi-set-roll-with-shrimp-philadelphia-cheese-cucumber-sesame-seeds-ginger-wasabi_187166-35564.jpg" alt="Uramaki Philadelphia" />
            <h3>Uramaki Philadelphia</h3>
            <p>Salmão, cream cheese e cebolinha</p>
          </div>
          <div className="dish-item">
            <img src="https://img.freepik.com/free-photo/asian-food-dark_1220-4280.jpg" alt="Sashimi de Salmão" />
            <h3>Sashimi de Salmão</h3>
            <p>Fatias frescas de salmão premium</p>
          </div>
          <div className="dish-item">
            <img src="https://img.freepik.com/free-photo/side-view-nigiri-sushi-set-with-raw-fish-slices_140725-10558.jpg" alt="Nigiri Mix" />
            <h3>Nigiri Mix</h3>
            <p>Seleção de nigiris variados</p>
          </div>
          <div className="dish-item">
            <img src="https://img.freepik.com/premium-photo/california-sushi-roll-with-wasabi_538646-8157.jpg" alt="Hot Philadelphia" />
            <h3>Hot Philadelphia</h3>
            <p>Sushi empanado com salmão e cream cheese</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>O Que Nossos Clientes Dizem</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <p>"O melhor rodízio de sushi da cidade! Variedade incrível e atendimento impecável."</p>
            <h4>- Maria Silva</h4>
          </div>
          <div className="testimonial-card">
            <p>"Peço pelo menos uma vez por semana. Entrega sempre no prazo e os pratos chegam perfeitos."</p>
            <h4>- João Oliveira</h4>
          </div>
          <div className="testimonial-card">
            <p>"Ambiente agradável e sushi fresco. Recomendo para quem busca qualidade!"</p>
            <h4>- Ana Santos</h4>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Endereço</h3>
            <p>Rua dos Sushis, 123</p>
            <p>Bairro Japonês</p>
            <p>São Paulo - SP</p>
          </div>
          <div className="footer-column">
            <h3>Horários</h3>
            <p>Segunda a Sexta: 18h - 23h</p>
            <p>Sábado e Domingo: 12h - 00h</p>
          </div>
          <div className="footer-column">
            <h3>Contato</h3>
            <p>Tel: (11) 1234-5678</p>
            <p>Email: contato@sushihouse.com</p>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Sushi House. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;