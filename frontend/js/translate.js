// translate.js
// Handles language switching for the CAV Zambia Airlines header
// Supported: English (default), French, Portuguese, Spanish, Arabic, German, Italian

const translations = {
    fr: {
        'Book a flight': 'Réserver un vol',
        'Manage / Check in': 'Gérer / Enregistrement',
        'Flight status': 'Statut du vol',
        'Trip type': 'Type de voyage',
        'From': 'De',
        'To': 'À',
        'Passengers': 'Passagers',
        'Class': 'Classe',
        'Departing': 'Départ',
        'Returning': 'Retour',
        'Search Flights': 'Rechercher des vols',
        'Login': 'Connexion',
        'Booking': 'Réservation',
        'Services': 'Services',
        'About Us': 'À propos',
        'Contact': 'Contact',
        'Fly With Us': 'Voyage avec nous',
        'Experience our world class services onboard our fleet': 'Expérience nos services de première classe à bord de notre flotte',
        'Discover your next unforgettable journey': 'Découvrez votre prochain voyage inoubliable',
        'Round Trip': 'Voyage Round Trip',
        'One Way': 'Voyage One Way',
        'Economy Class': 'Economie Classe',
        'Business Class': 'Business Classe',
        'Flight Schedules': 'Programmes des vols',
        'Round Trip - Economy': 'Voyage Round Trip - Economie',
        'Did you know that Cavair Guest members can enjoy complimentary Wi-Fi onboard for messaging apps? Staying in touch with family and friends during your flight has never been easier!': "Saviez-vous que les membres Cavair Guest bénéficient d'un accès Wi-Fi gratuit à bord pour leurs applications de messagerie ? Rester en contact avec sa famille et ses amis pendant votre vol n'a jamais été aussi simple !",
        'ROUTE':"Itinéraire",
        'FLIGHT NO.': 'Numéro de Vol',
        'DEPARTURE TIME': 'Heure de Départ',
        'ARRIVAL TIME': 'Heure d\'arrivée',
        'DAYS': 'Jours',
        'AIRCRAFT': 'Avion',
        'All times are local. +1 indicates arrival on the following day.': 'Toutes les heures sont locales. +1 indique l\'arrivée le jour suivant.',
        'Experience Cavair': 'Expérience Cavair',
        'Your journey with us is the start of something truly special. From our hub at Kenneth Kaunda International Airport, we bring you our signature hospitality, making every moment of your travel experience unforgettable.': 'Votre voyage avec nous est le début d\' quelque chose de véritablement spécial. Depuis notre hub au Kenneth Kaunda International Airport, nous vous apportons notre hospitalité signature, rendant chaque moment de votre expérience de voyage inoubliable.',
        'Booking Reference or Ticket Number': 'Numéro de réservation ou de billet',
        'Last Name': 'Nom de famille',
        'Flight Number': 'Numéro de vol',
        'Departure date*': 'Date de départ*',
        'Find': 'Trouver',
        'Manage Booking': 'Gérer la réservation',
        // Add more as needed
    },
    pt: {
        'Book a flight': 'Reservar voo',
        'Manage / Check in': 'Gerenciar / Check-in',
        'Flight status': 'Status do voo',
        'Trip type': 'Tipo de viagem',
        'From': 'De',
        'To': 'Para',
        'Passengers': 'Passageiros',
        'Class': 'Classe',
        'Departing': 'Partida',
        'Returning': 'Retorno',
        'Search Flights': 'Buscar voos',
        'Login': 'Entrar',
        'Booking': 'Reserva',
        'Services': 'Serviços',
        'About Us': 'Sobre nós',
        'Contact': 'Contato',
    },
    es: {
        'Book a flight': 'Reservar vuelo',
        'Manage / Check in': 'Gestionar / Check-in',
        'Flight status': 'Estado del vuelo',
        'Trip type': 'Tipo de viaje',
        'From': 'Desde',
        'To': 'A',
        'Passengers': 'Pasajeros',
        'Class': 'Clase',
        'Departing': 'Salida',
        'Returning': 'Regreso',
        'Search Flights': 'Buscar vuelos',
        'Login': 'Iniciar sesión',
        'Booking': 'Reserva',
        'Services': 'Servicios',
        'About Us': 'Sobre nosotros',
        'Contact': 'Contacto',
    },
    ar: {
        'Book a flight': 'حجز رحلة',
        'Manage / Check in': 'إدارة / تسجيل الوصول',
        'Flight status': 'حالة الرحلة',
        'Trip type': 'نوع الرحلة',
        'From': 'من',
        'To': 'إلى',
        'Passengers': 'ركاب',
        'Class': 'الدرجة',
        'Departing': 'المغادرة',
        'Returning': 'العودة',
        'Search Flights': 'ابحث عن رحلات',
        'Login': 'تسجيل الدخول',
        'Booking': 'الحجز',
        'Services': 'الخدمات',
        'About Us': 'معلومات عنا',
        'Contact': 'اتصل',
    },
    de: {
        'Book a flight': 'Flug buchen',
        'Manage / Check in': 'Verwalten / Einchecken',
        'Flight status': 'Flugstatus',
        'Trip type': 'Reiseart',
        'From': 'Von',
        'To': 'Nach',
        'Passengers': 'Passagiere',
        'Class': 'Klasse',
        'Departing': 'Abflug',
        'Returning': 'Rückkehr',
        'Search Flights': 'Flüge suchen',
        'Login': 'Anmelden',
        'Booking': 'Buchung',
        'Services': 'Dienstleistungen',
        'About Us': 'Über uns',
        'Contact': 'Kontakt',
    },
    it: {
        'Book a flight': 'Prenota un volo',
        'Manage / Check in': 'Gestisci / Check-in',
        'Flight status': 'Stato volo',
        'Trip type': 'Tipo di viaggio',
        'From': 'Da',
        'To': 'A',
        'Passengers': 'Passeggeri',
        'Class': 'Classe',
        'Departing': 'Partenza',
        'Returning': 'Ritorno',
        'Search Flights': 'Cerca voli',
        'Login': 'Accedi',
        'Booking': 'Prenotazione',
        'Services': 'Servizi',
        'About Us': 'Chi siamo',
        'Contact': 'Contatto',
    }
};

function translatePage(lang) {
    if (!translations[lang]) return;
    const dict = translations[lang];
    // Translate static text nodes
    Object.keys(dict).forEach(key => {
        // Find all elements with matching text
        document.querySelectorAll('*').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                if (el.textContent.trim() === key) {
                    el.textContent = dict[key];
                }
            }
        });
    });
    // For RTL languages like Arabic
    if (lang === 'ar') {
        document.body.dir = 'rtl';
        document.body.style.fontFamily = "'Cairo', 'Oxygen', 'Montserrat', Arial, sans-serif";
    } else {
        document.body.dir = 'ltr';
        document.body.style.fontFamily = "'Oxygen', 'Montserrat', Arial, sans-serif";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const langSelect = document.getElementById('language-select');
    const translateTrigger = document.getElementById('translate-trigger');
    let dropdownVisible = false;

    // Show/hide dropdown on icon click
    if (translateTrigger && langSelect) {
        translateTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownVisible = !dropdownVisible;
            langSelect.style.display = dropdownVisible ? 'block' : 'none';
            if (dropdownVisible) langSelect.focus();
        });
    }

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (dropdownVisible && langSelect && !langSelect.contains(e.target) && e.target !== translateTrigger) {
            langSelect.style.display = 'none';
            dropdownVisible = false;
        }
    });

    // Hide dropdown after selection
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            const lang = langSelect.value;
            langSelect.style.display = 'none';
            dropdownVisible = false;
            if (lang === 'en') {
                window.location.reload(); // Reset to English
            } else {
                translatePage(lang);
            }
        });
    }
});
