import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import mapMarkerImg from '../images//Local.png';

import '../styles/components/sidebar.css';

export default function Sidebar() {
  const { goBack } = useHistory();

  return (
    <aside className="app-sidebar">
      <Link to="/">
        <img src={mapMarkerImg} alt="Happy" />
      </Link>

      <footer>
        <button type="button" onClick={goBack}>
          <FiArrowLeft size={24} color="#FFF" />
        </button>
      </footer>
    </aside>
  );
}
