import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handleReservarMesa = () => {
    navigate('/login');
  };
  
  const handleVerCardapio = () => {
    navigate('/cardapio');
  };

  return (
    <div className="max-w-7xl mx-auto bg-white font-sans text-gray-800 pt-5">
      <header className="text-center mb-10 py-10 px-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="mb-5">
          <img 
            src="https://img.freepik.com/premium-vector/sushi-logo-design_9845-32.jpg" 
            alt="Sushi House Logo" 
            className="w-32 h-auto rounded-full mx-auto shadow-md" 
          />
        </div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">Bem-vindo ao Sushi House</h1>
        <p className="text-xl text-gray-700 mb-6">Experimente o melhor do sushi com rodízio e pedidos à la carte!</p>
      </header>
      
      <section className="flex flex-wrap items-center px-5 py-10 bg-white mb-16">
        <div className="flex-1 basis-[400px] pr-0 md:pr-10 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-green-800 mb-5">Descubra a Autêntica Culinária Japonesa</h2>
          <p className="text-lg leading-relaxed">Pratos preparados por chefs especializados com ingredientes frescos e técnicas tradicionais.</p>
        </div>
        <div className="flex-1 basis-[500px]">
          <img 
            src="https://img.freepik.com/free-photo/side-view-sushi-set-with-soy-sauce-chopsticks-wooden-serving-board_176474-3234.jpg" 
            alt="Variedade de sushi" 
            className="w-full h-auto rounded-xl shadow-lg" 
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-10 justify-center px-5 mb-16">
        <div className="flex-1 basis-[350px] bg-gray-50 rounded-xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <img 
            src="https://img.freepik.com/free-photo/delicious-sushi-arrangement_23-2149061769.jpg" 
            alt="Rodízio de Sushi" 
            className="w-full h-[200px] object-cover rounded-lg mb-5"
          />
          <h2 className="text-2xl font-bold text-green-800 mb-4">Rodízio</h2>
          <p className="text-gray-700 mb-5 leading-relaxed">Desfrute de uma variedade ilimitada de sushis, sashimis e pratos quentes por um preço fixo.</p>
          <ul className="list-none p-0 mb-6 text-left">
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Mais de 50 opções de sushi</li>
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Pratos quentes inclusos</li>
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Sobremesas japonesas</li>
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Bebidas à parte</li>
          </ul>
          <button 
            className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
            onClick={handleReservarMesa}
          >
            Reservar Mesa
          </button>
        </div>
        
        <div className="flex-1 basis-[350px] bg-gray-50 rounded-xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <img 
            src="https://img.freepik.com/free-photo/delicious-japanese-food-arrangement_23-2149116758.jpg" 
            alt="Sushi à la carte" 
            className="w-full h-[200px] object-cover rounded-lg mb-5"
          />
          <h2 className="text-2xl font-bold text-green-800 mb-4">À La Carte</h2>
          <p className="text-gray-700 mb-5 leading-relaxed">Prefere escolher? Monte seu pedido com nossos pratos exclusivos e combos especiais.</p>
          <ul className="list-none p-0 mb-6 text-left">
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Combos econômicos</li>
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Pratos exclusivos</li>
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Entrega rápida</li>
            <li className="py-2 border-b border-gray-200 pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-green-800 before:font-bold">Peça pelo aplicativo</li>
          </ul>
          <button 
            className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
            onClick={handleVerCardapio}
          >
            Ver Cardápio
          </button>
        </div>
      </section>

      <section className="py-10 px-5 bg-gray-50 mb-16">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-10">Pratos Populares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://img.freepik.com/premium-photo/sushi-set-roll-with-shrimp-philadelphia-cheese-cucumber-sesame-seeds-ginger-wasabi_187166-35564.jpg" 
              alt="Uramaki Philadelphia" 
              className="w-full h-[180px] object-cover"
            />
            <h3 className="px-4 pt-4 pb-2 text-green-800 font-semibold">Uramaki Philadelphia</h3>
            <p className="px-4 pb-4 text-gray-600">Salmão, cream cheese e cebolinha</p>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://img.freepik.com/free-photo/asian-food-dark_1220-4280.jpg" 
              alt="Sashimi de Salmão" 
              className="w-full h-[180px] object-cover"
            />
            <h3 className="px-4 pt-4 pb-2 text-green-800 font-semibold">Sashimi de Salmão</h3>
            <p className="px-4 pb-4 text-gray-600">Fatias frescas de salmão premium</p>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://img.freepik.com/free-photo/side-view-nigiri-sushi-set-with-raw-fish-slices_140725-10558.jpg" 
              alt="Nigiri Mix" 
              className="w-full h-[180px] object-cover"
            />
            <h3 className="px-4 pt-4 pb-2 text-green-800 font-semibold">Nigiri Mix</h3>
            <p className="px-4 pb-4 text-gray-600">Seleção de nigiris variados</p>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://img.freepik.com/premium-photo/california-sushi-roll-with-wasabi_538646-8157.jpg" 
              alt="Hot Philadelphia" 
              className="w-full h-[180px] object-cover"
            />
            <h3 className="px-4 pt-4 pb-2 text-green-800 font-semibold">Hot Philadelphia</h3>
            <p className="px-4 pb-4 text-gray-600">Sushi empanado com salmão e cream cheese</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-5 text-center mb-16">
        <h2 className="text-3xl font-bold text-red-600 mb-10">O Que Nossos Clientes Dizem</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="flex-1 basis-[300px] bg-gray-50 p-8 rounded-lg shadow-md relative">
            <p className="italic mb-5 leading-relaxed text-gray-700 relative pl-4">
              "O melhor rodízio de sushi da cidade! Variedade incrível e atendimento impecável."
            </p>
            <h4 className="font-medium text-green-800">- Maria Silva</h4>
          </div>
          <div className="flex-1 basis-[300px] bg-gray-50 p-8 rounded-lg shadow-md relative">
            <p className="italic mb-5 leading-relaxed text-gray-700 relative pl-4">
              "Peço pelo menos uma vez por semana. Entrega sempre no prazo e os pratos chegam perfeitos."
            </p>
            <h4 className="font-medium text-green-800">- João Oliveira</h4>
          </div>
          <div className="flex-1 basis-[300px] bg-gray-50 p-8 rounded-lg shadow-md relative">
            <p className="italic mb-5 leading-relaxed text-gray-700 relative pl-4">
              "Ambiente agradável e sushi fresco. Recomendo para quem busca qualidade!"
            </p>
            <h4 className="font-medium text-green-800">- Ana Santos</h4>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-16 px-5">
        <div className="flex flex-wrap justify-between max-w-7xl mx-auto mb-10">
          <div className="flex-1 basis-[300px] mb-8">
            <h3 className="text-gray-100 mb-5 text-lg font-medium relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-red-600">Endereço</h3>
            <p className="text-gray-300 my-2">Rua dos Sushis, 123</p>
            <p className="text-gray-300 my-2">Bairro Japonês</p>
            <p className="text-gray-300 my-2">São Paulo - SP</p>
          </div>
          <div className="flex-1 basis-[300px] mb-8">
            <h3 className="text-gray-100 mb-5 text-lg font-medium relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-red-600">Horários</h3>
            <p className="text-gray-300 my-2">Segunda a Sexta: 18h - 23h</p>
            <p className="text-gray-300 my-2">Sábado e Domingo: 12h - 00h</p>
          </div>
          <div className="flex-1 basis-[300px] mb-8">
            <h3 className="text-gray-100 mb-5 text-lg font-medium relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-red-600">Contato</h3>
            <p className="text-gray-300 my-2">Tel: (11) 1234-5678</p>
            <p className="text-gray-300 my-2">Email: contato@sushihouse.com</p>
          </div>
        </div>
        <div className="text-center pt-5 border-t border-gray-700">
          <p className="text-gray-400 text-sm">© 2025 Sushi House. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;