import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  const goToHistorial = () => {
    navigate('/historial');
  };

  const goToTiposObjeto = () => {
    navigate('/tipos-objeto');
  };

  const goToRecomendaciones = () => {
    navigate('/recomendaciones');
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const getCurrentPath = () => {
    return location.pathname;
  };

  return {
    goTo,
    goBack,
    goHome,
    goToHistorial,
    goToTiposObjeto,
    goToRecomendaciones,
    isCurrentPath,
    getCurrentPath,
    currentPath: location.pathname
  };
}; 