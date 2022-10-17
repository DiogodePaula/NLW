import LefLet from 'leaflet';
import mapLocalImg from '../images/Local.png';

//ícone de localização do mapa
const mapIcon = LefLet.icon({
  iconUrl: mapLocalImg,
  iconSize: [58, 68],
  //posiciona o ícone para o ponto central do ícone não ser  o centro como o ponto de referencia
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
});

export default mapIcon;
