import { useState } from 'react';

const DECK_FORMATS = [
  'Standard',
  'Pioneer',
  'Modern',
  'Legacy',
  'Vintage',
  'Commander',
  'Pauper',
  'Historic'
];

const COLORS = [
  { code: 'W', name: 'Blanc', bgColor: 'bg-yellow-100' },
  { code: 'U', name: 'Bleu', bgColor: 'bg-blue-500' },
  { code: 'B', name: 'Noir', bgColor: 'bg-gray-900' },
  { code: 'R', name: 'Rouge', bgColor: 'bg-red-600' },
  { code: 'G', name: 'Vert', bgColor: 'bg-green-600' }
];

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckCreated: () => void;
}

function CreateDeckModal({ isOpen, onClose, onDeckCreated }: CreateDeckModalProps) {
  const [deckName, setDeckName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Standard');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleColor = (colorCode: string) => {
    setSelectedColors(prev =>
      prev.includes(colorCode)
        ? prev.filter(c => c !== colorCode)
        : [...prev, colorCode]
    );
  };

  const handleSubmit = async () => {
    setError('');

    if (!deckName.trim()) {
      setError('Le nom du deck est requis');
      return;
    }

    if (selectedColors.length === 0) {
      setError('Veuillez sélectionner au moins une couleur');
      return;
    }

    // Récupérer le token et l'utilisateur
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      setError('Vous devez être connecté pour créer un deck');
      return;
    }

    const user = JSON.parse(userStr);

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/users/deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: deckName,
          format: selectedFormat,
          ownerId: user.id.toString(),
          cards: [],
          commanderId: null,
          imageUri:"https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg",
          colors:selectedColors
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        throw new Error('Erreur lors de la création du deck');
      }

      // Réinitialiser le formulaire
      setDeckName('');
      setSelectedFormat('Standard');
      setSelectedColors([]);
      
      // Notifier le parent et fermer
      onDeckCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDeckName('');
      setSelectedFormat('Standard');
      setSelectedColors([]);
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Créer un nouveau deck</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="deckName" className="block text-sm font-medium text-gray-300 mb-2">
              Nom du deck *
            </label>
            <input
              id="deckName"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Mon super deck"
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-2">
              Format *
            </label>
            <select
              id="format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {DECK_FORMATS.map(format => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Couleurs * (au moins une)
            </label>
            <div className="flex gap-3">
              {COLORS.map(color => (
                <button
                  key={color.code}
                  type="button"
                  onClick={() => toggleColor(color.code)}
                  disabled={isSubmitting}
                  className={`
                    w-12 h-12 rounded-full border-2 transition-all
                    ${color.bgColor}
                    ${selectedColors.includes(color.code)
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-gray-600 opacity-50 hover:opacity-100'
                    }
                    disabled:opacity-30 disabled:cursor-not-allowed
                  `}
                  title={color.name}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                {selectedColors.length} couleur{selectedColors.length > 1 ? 's' : ''} sélectionnée{selectedColors.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création...
                </>
              ) : (
                'Créer le deck'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDeckModal;