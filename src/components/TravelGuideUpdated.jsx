import React, { useState, useEffect, useRef } from 'react';

// Image component with loading state
const OptimizedImage = ( { src, alt, className, caption } ) => {
    const [ isLoading, setIsLoading ] = useState( true );
    const [ isHovered, setIsHovered ] = useState( false );
    const [ showModal, setShowModal ] = useState( false );

    // Check if this image is inside a small image container
    const isSmallImage = document.querySelector( '.w-32' )?.contains( document.activeElement ) ||
        document.querySelector( '.h-24' )?.contains( document.activeElement );

    const toggleModal = ( e ) => {
        // Check if the clicked element or its parent has the small image classes
        const isSmall = e.target.closest( '.w-32' ) || e.target.closest( '.h-24' );
        if ( isSmall ) {
            setShowModal( !showModal );
        }
    };

    return (
        <>
            <div
                className={ `relative w-full group ${ isSmallImage ? 'cursor-pointer' : '' }` }
                onMouseEnter={ () => setIsHovered( true ) }
                onMouseLeave={ () => setIsHovered( false ) }
            >
                { isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                ) }
                <div
                    className="overflow-hidden rounded-xl"
                    onClick={ toggleModal }
                >
                    <img
                        src={ src }
                        alt={ alt }
                        className={ `
                            ${ className }
                            ${ isLoading ? 'opacity-0' : 'opacity-100' }
                            transition-all duration-500 ease-in-out transform
                            group-hover:scale-110 group-hover:shadow-2xl` }
                        onLoad={ () => setIsLoading( false ) }
                    />
                </div>
                { caption && (
                    <div className={ `
                        absolute bottom-0 left-0 right-0 
                        bg-gradient-to-t from-black/80 to-transparent
                        text-white p-3 transition-all duration-300 ease-in-out
                        ${ isHovered ? 'opacity-100' : 'opacity-0' }` }>
                        <p className="text-sm font-medium">{ caption }</p>
                    </div>
                ) }
            </div>

            {/* Modal for larger image view */ }
            { showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4"
                    onClick={ () => setShowModal( false ) }
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh]"
                        onClick={ ( e ) => e.stopPropagation() }
                    >
                        <button
                            className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={ () => setShowModal( false ) }
                        >
                            ×
                        </button>
                        <img
                            src={ src }
                            alt={ alt }
                            className="w-full h-auto object-contain rounded-lg shadow-2xl"
                        />
                        { caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                                <p className="text-lg">{ caption }</p>
                            </div>
                        ) }
                    </div>
                </div>
            ) }
        </>
    );
};

// Main App component
const TravelGuideUpdated = () => {
    const [ activeSection, setActiveSection ] = useState( 'intro' );
    const sectionRefs = useRef( {} );
    const [ expandedLandmarks, setExpandedLandmarks ] = useState( {} );

    const sections = [
        { id: 'intro', title: 'Uvod: Vaša idealna balkanska i jonska odiseja' },
        { id: 'day1', title: 'Dan 1: Beograd do Bitolja' },
        { id: 'day2', title: 'Dan 2: Bitolj do Perdike' },
        { id: 'days3-15', title: 'Dani 3-15: Jonski dragulji' },
        { id: 'day16', title: 'Dan 16: E75 povratak kući' },
        { id: 'practical', title: 'Praktična razmatranja' },
        { id: 'conclusion', title: 'Zaključak' },
    ];

    useEffect( () => {
        const observer = new IntersectionObserver(
            ( entries ) => {
                entries.forEach( ( entry ) => {
                    if ( entry.isIntersecting ) {
                        setActiveSection( entry.target.id );
                    }
                } );
            },
            {
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            }
        );

        const currentRefs = sectionRefs.current;
        sections.forEach( ( { id } ) => {
            const element = document.getElementById( id );
            if ( element ) {
                observer.observe( element );
                currentRefs[ id ] = element;
            }
        } );

        return () => {
            sections.forEach( ( { id } ) => {
                const element = currentRefs[ id ];
                if ( element ) {
                    observer.unobserve( element );
                }
            } );
        };
    }, [] );

    const scrollToSection = ( id ) => {
        const element = sectionRefs.current[ id ];
        if ( element ) {
            // Add offset for the fixed navigation bar (adjust the value based on your nav height)
            const offset = 100; // This accounts for the nav height plus some padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo( {
                top: offsetPosition,
                behavior: 'smooth'
            } );
            setActiveSection( id );
        }
    };

    const toggleLandmark = ( landmarkId ) => {
        setExpandedLandmarks( prev => ( {
            ...prev,
            [ landmarkId ]: !prev[ landmarkId ]
        } ) );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
            {/* Navigation Bar */ }
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg p-4">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-xl font-bold text-blue-800 mb-4 md:mb-0">
                            Balkanska i jonska Odiseja
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                            { sections.map( ( section ) => (
                                <button
                                    key={ section.id }
                                    onClick={ () => scrollToSection( section.id ) }
                                    className={ `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${ activeSection === section.id
                                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                                        }` }
                                >
                                    { section.title.split( ':' )[ 0 ] }
                                </button>
                            ) ) }
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 pt-32 pb-16">
                {/* Hero Section */ }
                <header id="intro" className="text-center mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h1 className="text-5xl font-extrabold text-blue-800 mb-4 leading-tight">
                        Vaša Idealna Balkanska i Jonska Odiseja
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">Beograd - Bitolj - Perdika - Beograd (16 dana)</p>
                    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg">
                        <div className="relative">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Mapa Balkana"
                                className="w-full h-auto object-cover"
                                caption="Putovanje kroz istoriju, kulturu i prirodne lepote Balkana i Jonskog mora."
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white font-medium">Putovanje kroz istoriju, kulturu i prirodne lepote Balkana i Jonskog mora.</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-lg leading-relaxed">
                        Ova 16-dnevna ekspedicija obećava neuporedivu kombinaciju istorijske dubine, živahne kulture i prelepih prirodnih pejzaža, protežući se od srca Srbije preko istorijskih raskrsnica Severne Makedonije, a kulminira u mirnoj lepoti grčke jonske obale. Putovanje je osmišljeno za putnike koji traže autentična iskustva, od drevnih ruševina i užurbanih bazara do mitskih reka i suncem okupanih plaža. Naglasak je na uranjanju u lokalne tradicije, uživanju u autentičnoj kuhinji i otkrivanju skrivenih dragulja Balkana i Jonskog mora.
                    </p>
                    <p className="mt-4 text-lg leading-relaxed">
                        Putovanje počinje u Beogradu, vodeći prema jugu do Bitolja za imerzivni noćni boravak u Severnoj Makedoniji. Glavni deo putovanja odvija se tokom 15 noćenja u zapanjujućoj regiji Perdika u Grčkoj, nudeći savršenu bazu za istraživanje skrivenih dragulja Jonskog mora. Povratak će uključivati pažljivo odabrano zaustavljanje duž rute E75 u južnoj Srbiji, osiguravajući tako celovitu i nezaboravnu petlju putovanja.
                    </p>
                </header>

                {/* Day 1 Section */ }
                <section id="day1" className="mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 1: Beograd (Srbija) do Bitolja (Severna Makedonija)</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Istorijsko srce Severne Makedonije (1 noćenje)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutarnja vožnja: Od srpskih ravnica do makedonskih planina</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop"
                                    alt="Autoput u Srbiji"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Vožnja od Beograda do Bitolja (oko 567 km, ~5h 51min).</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Vožnja od Beograda do Bitolja iznosi otprilike 567,3 km i traje oko 5 sati i 51 minutu automobilom. Ova ruta nudi brz i slikovit prelaz iz srpskih ravnica u planinske krajolike Severne Makedonije. Za putnike koji žele maksimalno iskoristiti ograničeno vreme u Bitolju, efikasnost na granici je ključna.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Istraživanje pokazuje da granični prelaz Medžitlija-Niki, koji je direktna ruta između Bitolja i Florine (Grčka), karakteriše "mali saobraćaj" i "gotovo nikakav saobraćaj" tokom sati van špice, poput ručka i sieste. To ukazuje na znatno glatkiji i brži prelaz u poređenju sa potencijalno prometnijim glavnim rutama. Stoga je preporučljivo planirati korišćenje ovog prelaza kako bi se minimizirala kašnjenja i sačuvalo dragoceno vreme za istraživanje Bitolja.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Bitolj: Grad konzula i drevnih odjeka</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative h-64">
                                <div className="relative h-full">
                                    <OptimizedImage
                                        src="https://www.politika.rs/thumbs//upload/PhotoGallery/Image/2022_09///1014z570_Bitolj-Aleksandar-Makedonski-spomenik-Nikola-Trklja.jpg?text=Slide-0"
                                        alt="Širok Sokak, Bitolj"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">Bitolj</h5>
                                        <p className="text-white drop-shadow-md">Dobrodošli u Bitolj, grad bogate istorije i kulture.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Bitolj, drugi po veličini grad u Severnoj Makedoniji, nosi počasnu titulu "Grada konzula", što svedoči o njegovoj istorijskoj važnosti kao diplomatskog i trgovačkog centra tokom osmanskog perioda. Njegova istorija seže u 4. vek pre Hrista, obeležena osnivanjem Herakleje Linkestidske od strane Filipa II. Makedonskog.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Grad je igrao značajnu ulogu u raznim carstvima, uključujući period pod srpskom vlašću u 14. veku tokom pohoda kralja Stefana Dušana, a kasnije je postao deo Kraljevine Srba, Hrvata i Slovenaca nakon Prvog svetskog rata. Bitolj je bogat kulturnim spomenicima i istorijskom baštinom.
                        </p>
                        <div className="mb-8">
                            <h4 className="text-xl font-medium text-gray-700 mb-4">Obavezno posetiti znamenitosti:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                        <OptimizedImage
                                            src="https://yusundials.com/wp-content/uploads/2015/07/10-Herakleja-Linkestidska-3.jpg"
                                            alt="Mozaici u Herakleji Linkestidskoj"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h5 className="text-xl font-semibold text-white drop-shadow-lg">Herakleja Linkestidska</h5>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            Samo nekoliko kilometara od centra Bitolja, ovo drevno arheološko nalazište je riznica rimske i vizantijske istorije. Posetioci mogu istražiti dobro očuvane ruševine, uključujući amfiteatar, rimske terme i bazilike ukrašene složeno očuvanim mozaicima koji prikazuju živopisne scene flore i faune. Nalazište je otvoreno od 9 do 18 sati od aprila do oktobra, te od 9 do 16 sati od oktobra do marta.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden    ">
                                        <OptimizedImage
                                            src="https://bitola.info/wp-content/uploads/2017/02/Shirok_sokak_Bitola.jpg"
                                            alt="Širok Sokak noću"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h5 className="text-xl font-semibold text-white drop-shadow-lg">Širok Sokak</h5>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            Živahna pešačka ulica, srce modernog Bitolja. Ovo je glavna promenada grada, okružena kafićima, restoranima i trgovinama. Idealno mesto za uživanje u atmosferi grada i posmatranje lokalnog života.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                        <OptimizedImage
                                            src="https://media-cdn.tripadvisor.com/media/photo-s/02/2c/79/7d/bitola.jpg"
                                            alt="Sahat-kula, Bitolj"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h5 className="text-xl font-semibold text-white drop-shadow-lg">Sahat-kula (Saat Kula)</h5>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            Istaknuti simbol Bitolja iz 16. veka. Ova impresivna kula je jedan od najprepoznatljivijih simbola grada, koja je nekada služila kao sat na trgu. Danas predstavlja važan istorijski spomenik i popularno mesto za fotografisanje.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                        <OptimizedImage
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/St._Demetrius_Church_%28Bitola%29.jpg/500px-St._Demetrius_Church_%28Bitola%29.jpg"
                                            alt="Crkva sv. Dimitrija, Bitolj"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h5 className="text-xl font-semibold text-white drop-shadow-lg">Crkva sv. Dimitrija</h5>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            Značajno versko nasleđe, poznata po svojim impresivnim freskama i arhitekturi. Ova crkva predstavlja važan deo verskog i kulturnog nasleđa grada, sa bogatom istorijom koja seže u srednji vek.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                        <OptimizedImage
                                            src="https://i0.wp.com/cineculture.gaussinstitute.org/wp-content/uploads/2020/10/stara-carsija-618.jpg?fit=900%2C572&ssl=1"
                                            alt="Stari bazar, Bitolj"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h5 className="text-xl font-semibold text-white drop-shadow-lg">Stari bazar (Stara Čaršija)</h5>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            Tradicionalni trgovački centar grada, gde možete pronaći autentične proizvode, lokalne specijalitete i doživeti atmosferu starog Bitolja. Idealno mesto za kupovinu suvenira i iskustvo lokalne kulture.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Kulturno uranjanje</h4>
                        <p className="text-gray-700 mb-4">
                            Bitolj je grad koji tokom cele godine slavi razne kulturne i umetničke događaje. Značajni festivali uključuju renomirani Međunarodni festival filmske kamere "Braća Manaki" (slavi kinematografiju), Bitoljski Shakespeare Festival i Bitola Babam Bitola Festival, koji uključuje tradicionalnu muziku i kulinarske delicije. Ovi događaji pružaju duboke veze sa lokalnim tradicijama i živahnom atmosferom.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Iako specifična mesta za redovnu tradicionalnu narodnu muziku nisu opsežno detaljno opisana, Serenada na Širokom sokaku je popularan festival narodne muzike koji se održava u Bitolju. Neki smeštaji, poput Guest House Via, nude "sesije tradicionalne muzike" za svoje goste, stvarajući autentičnu kulturnu atmosferu.
                        </p>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Blagovanje i noćenje: Autentični makedonski ukusi</h4>
                        <p className="text-gray-700 mb-4">
                            Za ukus tradicionalne makedonske kuhinje, razmotrite Restoran Oscar, smešten na putu za Nižepole blizu Pelistera, visoko preporučen od strane lokalne zajednice zbog svojih mesnih, vegetarijanskih i veganskih specijaliteta, kao i kvalitetnih makedonskih vina. Etno restoran Brioni u Čalgiškoj ulici takođe nudi tradicionalnu makedonsku hranu i mesne specijalitete.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Na Širokom sokaku, Ravenna je idealno mesto za isprobavanje tradicionalnih balkanskih jela, uključujući ćevape i jela od svinjetine. Ne propustite lokalne specijalitete poput tavče gravče i Bitolsko brašno.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Za putnike koji traže dublje kulturno iskustvo tokom kratkog boravka, odabir smeštaja može značajno obogatiti putovanje. Guest House Via izričito nudi "sesije tradicionalne muzike", "radionice narodnog plesa" i "mogućnosti kulturne razmene" gde gosti mogu komunicirati sa lokalnim umetnicima i muzičarima. To znači da se jednostavan noćni boravak može pretvoriti u autentično kulturno iskustvo, omogućavajući putnicima da se dublje povežu sa makedonskom tradicijom i maksimiziraju svaki trenutak svog boravka.
                        </p>
                    </div>
                </section>

                {/* Day 2 Section */ }
                <section id="day2" className="mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 2: Bitolj (Severna Makedonija) do Perdike (Grčka)</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Putovanje do Jonskog mora (1 noćenje)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutarnja vožnja: Od planina do mora</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative">
                                <OptimizedImage
                                    src="https://nikana.gr/images/5643/put-kolima-do-grke-kako-najbolje-planirati-putovanje-do-mora-blog-blog-3.jpg"
                                    alt="Planinski put"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Vožnja od Bitolja do Perdike (oko 180 km, ~3h).</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Putovanje od Bitolja do Perdike vodi kroz prelepe planinske krajolike i male gradove, nudeći uvid u lokalni život i kulturu. Ruta je dobro održavana i nudi prelepe poglede na prirodu.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Perdika: Vaš dom na Jonskom moru</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative">
                                <OptimizedImage
                                    src="https://www.greeka.com/village_beach/photos/180/perdika-top-1-1280.jpg"
                                    alt="Perdika plaža"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Dobrodošli u Perdiku, vašu bazu za istraživanje Jonskog mora.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Perdika je mirno mesto na obali Jonskog mora, poznato po svojim prelepim plažama i autentičnoj grčkoj atmosferi. Ovo mesto će biti vaša baza za sledećih 15 dana, omogućavajući vam da istražujete sve što Jonsko more ima da ponudi.
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Obavezno posetiti u Perdiki:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.perdika.info/images/_Karavostasi_Beach_Hotel/_large/_0000364%20copy.jpg"
                                        alt="Karavostasi plaža"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Plaža Karavostasi</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Glavna plaža Perdike sa finim peskom i oblucima. Duboka voda, organizovana plaža sa ležaljkama, suncobranima, kafićima i tavernama. Idealna za opšte opuštanje i uživanje u moru.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.visit-thesprotia.gr/wp-content/uploads/2014/07/arilla-aerial2.jpg"
                                        alt="Arilas plaža"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Plaža Arilas</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Prelepa plaža sa kristalno čistom vodom i finim peskom. Organizovana sa svim potrebnim sadržajima za udobno opuštanje. Idealna za porodice i sportiste.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://nontasfishrestaurant.gr/wp-content/uploads/2022/01/drz-antzi-studios_Q1A8346-Copy.jpg"
                                        alt="Nontas Fish Restaurant"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Nontas Fish Restaurant</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Renomirana, porodična tradicionalna taverna koja posluje od 1936. godine. Specijalizovana za svežu morsku hranu i ribu koju love lokalni ribari. Autentično grčko iskustvo.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.greeka.com/photos/epirus/parga/hero/parga-1280.jpg"
                                        alt="Parga"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Parga</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Šarmantni grad na obali Jonskog mora, udaljen 30-40 minuta vožnje od Perdike. Posećujte venecijanski dvorac, prelepe plaže Valtos, Lihnos i Sarakiniko. Ne propustite restorane The Captain's i Fish Taverna Suli.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/56/5e/47/caption.jpg?w=500&h=400&s=1"
                                        alt="Sivota"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Sivota</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Prelepo mesto sa kristalno čistim vodama i prelepim plažama. Posećujte Bela Vraka, Pisina (Plava laguna), Mega Amos i Mikri Amos plaže. Probajte restorane Ionion Fish, Oliva Beach Bar i Taverna Stavros.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Days 3-15 Section */ }
                <section id="days3-15" className="mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dani 3-15: Jonski dragulji</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Istraživanje Jonskog mora (15 noćenja)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Istraživanje Jonskih ostrva</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative">
                                <OptimizedImage
                                    src="https://www.halotours.rs/core/media/Jonska-ostrva-620x245.jpg"
                                    alt="Jonska ostrva"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Istražite prelepa Jonska ostrva tokom vašeg boravka.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Tokom vašeg 15-dnevnog boravka u Perdiki, imaćete priliku da istražite prelepa Jonska ostrva i njihove znamenitosti. Svako ostrvo ima svoju jedinstvenu priču i lepotu koju treba otkriti.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-4">Obavezno posetiti mesta:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.ponte.rs/UPLOADS-PONTE/2023/02/KRF-OSTRVO.jpg"
                                        alt="Korfu grad"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Korfu</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Istorijski grad sa utvrđenjima i prelepim plažama. Posećujte Stari grad, utvrđenje i prelepe plaže.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://maestral.co.rs/wp-content/uploads/2023/11/Ostrvo-Zakintos-Grcka-2.jpg"
                                        alt="Zakintos plaža"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Zakintos</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Poznat po svojim plavim pećinama i prelepim plažama. Ne propustite posetu Plavim pećinama i plaži Navagio.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.mediteraneo.rs/pic/Kefalonija-01.jpg"
                                        alt="Kefalonija pejzaž"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Kefalonija</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Najveće Jonsko ostrvo sa prelepim pejzažima. Posetite Melisani pećinu i plažu Myrtos.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://grckikutak.com/wp-content/uploads/2020/06/itaka.png"
                                        alt="Itaka zaliv"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Itaka</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Dom legendarnog Odiseja sa prelepim zalivima. Istražite istorijski centar i prelepe plaže.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-4">Aktivnosti i doživljaji:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://d2p1cf6997m1ir.cloudfront.net/media/thumbnails/1d/09/1d09f7541afd9d6fbc7b50775b87288b.webp"
                                        alt="Ronjenje u Jonskom moru"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Ronjenje</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Istražite podvodni svet Jonskog mora. Organizovani izleti sa opremom i instruktorima.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://dynamic-media.tacdn.com/media/photo-o/2e/e7/3c/1f/caption.jpg?w=800&h=600&s=1"
                                        alt="Vožnja čamcem"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Vožnja čamcem</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Posetite skrivene plaže i zalive. Organizovani izleti sa iskusnim kapetanima.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://images.squarespace-cdn.com/content/v1/62b42acaae8de47236dbc8f2/abc61c8d-96b4-49c1-b492-7652236f7dc3/pexels-daniel-jurin-1835718.jpg"
                                        alt="Grčka kuhinja"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Lokalna kuhinja</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Probajte autentične grčke specijalitete. Kuvarice će vas naučiti kako da pripremite tradicionalna jela.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-4">Plaže u Perdiki</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.perdika.info/images/_Karavostasi_Beach_Hotel/_large/_0000364%20copy.jpg"
                                        alt="Karavostasi plaža"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Karavostasi</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <p><span className="font-medium">Sastav obale:</span> Fini pesak i oblutci</p>
                                        <p><span className="font-medium">Dubina vode:</span> Duboka</p>
                                        <p><span className="font-medium">Organizacija:</span> Organizovana</p>
                                        <p><span className="font-medium">Dostupni sadržaji:</span> Ležaljke, suncobrani, kafići, taverne, spasilac</p>
                                        <p><span className="font-medium">Prikladnost:</span> Opšte opuštanje</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.visit-thesprotia.gr/wp-content/uploads/2014/07/arilla-aerial2.jpg"
                                        alt="Arilas plaža"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Arilas</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <p><span className="font-medium">Sastav obale:</span> Fini, lepljivi pesak</p>
                                        <p><span className="font-medium">Dubina vode:</span> Plitka</p>
                                        <p><span className="font-medium">Organizacija:</span> Organizovana</p>
                                        <p><span className="font-medium">Dostupni sadržaji:</span> Ležaljke, suncobrani, vodeni bicikli, tuševi, taverne</p>
                                        <p><span className="font-medium">Prikladnost:</span> Porodice sa decom</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/145929450.jpg?k=b5b2bac9d22d0570cc14294ac2b9b0f9a955fa408fa835b9e64ba269cbe771a6&o=&hp=1"
                                        alt="Agia Paraskevi plaža"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Agia Paraskevi</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <p><span className="font-medium">Sastav obale:</span> Fini pesak i oblutci</p>
                                        <p><span className="font-medium">Dubina vode:</span> Tirkizna, čista</p>
                                        <p><span className="font-medium">Organizacija:</span> Organizovana</p>
                                        <p><span className="font-medium">Dostupni sadržaji:</span> Ležaljke, suncobrani, vodeni bicikli, kanui, spasilac</p>
                                        <p><span className="font-medium">Prikladnost:</span> Slikovito, opuštanje</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-4">Preporučeni restorani u Perdiki</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://nontasfishrestaurant.gr/wp-content/uploads/2022/01/drz-antzi-studios_Q1A8346-Copy.jpg"
                                        alt="Nontas Fish Restaurant"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Nontas Fish Restaurant</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Renomirana, porodična tradicionalna taverna koja posluje od 1936. godine.
                                        Specijalizovana za svežu morsku hranu i ribu koju love lokalni ribari.
                                        Autentično grčko iskustvo sa prelepim pogledom na more.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/15/65/18/the-crabs.jpg?w=800&h=400&s=1"
                                        alt="The Crabs Tavern"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">The Crabs Tavern</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Visoko preporučena zbog izuzetne kvaliteta hrane, sa svežom morskom hranom
                                        i dnevnim promenljivim jelovnikom sa jedinstvenim specijalitetima.
                                        Posebno poznata po svojim rakijama i domaćim desertima.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-4">Jednodnevni izleti iz Perdike</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.greeka.com/photos/epirus/parga/hero/parga-1280.jpg"
                                        alt="Parga"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Parga</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Šarmantni grad na obali Jonskog mora, udaljen 30-40 minuta vožnje od Perdike. Posećujte venecijanski dvorac, prelepe plaže Valtos, Lihnos i Sarakiniko. Ne propustite restorane The Captain's i Fish Taverna Suli.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/56/5e/47/caption.jpg?w=500&h=400&s=1"
                                        alt="Sivota"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Sivota</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Prelepo mesto sa kristalno čistim vodama i prelepim plažama. Posećujte Bela Vraka, Pisina (Plava laguna), Mega Amos i Mikri Amos plaže. Probajte restorane Ionion Fish, Oliva Beach Bar i Taverna Stavros.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://lucina-potepanja.com/wp-content/uploads/2019/07/acheron-river-2-1140x660.jpg"
                                        alt="Reka Aheron"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Reka Aheron</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Mistična reka iz grčke mitologije, udaljena 30-45 minuta vožnje od Perdike do Glikija. Uživajte u raftingu, kajaku, jahanju kroz plitke vode i rekarskom trekkingu. Posetite Nekromanteion Aherona i izvore Aherona u Glikiju.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cultural Experiences Section */ }
                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Imersivna kulturna iskustva u Epiru</h4>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <p className="text-gray-700 mb-4">
                                Epir se može pohvaliti izrazitom i drevnom muzičkom tradicijom, koju karakteriše
                                njen dirljiv, često melankoličan zvuk. Ključni instrumenti uključuju klarinet,
                                violinu, lutnju i tamburicu.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h6 className="font-semibold text-gray-800 mb-2">Festivali:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Festival Epirus Music Village (Pogoniji, avgust)</li>
                                        <li>Kanaria Festival (Parga, 14. avgusta)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Day 16 Section */ }
                <section id="day16" className="mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 16: E75 povratak kući</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Povratak u Beograd</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Povratak kroz prirodne lepote</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative h-full">
                                <OptimizedImage
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBSDQ7sJqwj5Ai0vvkL16tqsJ2oWpEEy9PNw&s"
                                    alt="E75 put"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Povratak kući kroz prelepe prirodne pejzaže.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Povratak kući kroz prirodne lepote Balkana, sa prilikom za poslednje poglede na prelepe pejzaže i sećanja na nezaboravno putovanje.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Zaključna razmišljanja:</h4>
                        <p className="text-gray-700 mb-4">
                            Ovo putovanje je pružilo neuporedivu priliku za istraživanje bogate istorije, kulture i prirodnih lepota Balkana i Jonskog mora. Svaki dan je donosio nova iskustva i sećanja koja će ostati zauvek.
                        </p>
                    </div>
                </section>

                {/* Practical Considerations Section */ }
                <section id="practical" className="mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Praktična razmatranja</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Saveti za putovanje</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Priprema za putovanje</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative h-full">
                                <OptimizedImage
                                    src="https://innsbrookvacations.com/wp-content/uploads/2024/06/Packing-List-Tips-for-Your-Summer-Vacation.jpg"
                                    alt="Priprema za putovanje"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Saveti za pripremu vašeg putovanja.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Pre polaska na putovanje, proverite sve potrebne dokumente, rezervišite smeštaj i pripremite se za različite vremenske uslove. Takođe, obratite pažnju na lokalne običaje i kulture koje ćete upoznati tokom putovanja.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Saveti za putovanje:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://europeanwesternbalkans.com/wp-content/uploads/2024/03/342301934_253874793759224_803575013896565759_n-960x540-1.jpeg"
                                        alt="Putnički dokumenti"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Putnički dokumenti</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Pre polaska na putovanje, proverite sve potrebne dokumente. Važno je imati važeću ličnu kartu ili pasoš, vozačku dozvolu ako planirate da vozite, i osiguranje. Takođe, napravite kopije svih važnih dokumenata i čuvajte ih na sigurnom mestu.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://www.lareserve-ramatuelle.com/wp-content/uploads/2020/11/lrr_accomodation_junior-suite_bygregoiregardette_6463_bd.jpg"
                                        alt="Smeštaj"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Smeštaj</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Rezervišite smeštaj unapred za sve destinacije. Posebno je važno imati potvrđenu rezervaciju u sezoni. Razmislite o lokaciji smeštaja u odnosu na znamenitosti koje želite da posetite i dostupnost javnog prevoza.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative xl:h-80 lg:h-56 md:h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="https://images.squarespace-cdn.com/content/v1/62b42acaae8de47236dbc8f2/abc61c8d-96b4-49c1-b492-7652236f7dc3/pexels-daniel-jurin-1835718.jpg"
                                        alt="Vremenske prilike"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h5 className="text-xl font-semibold text-white drop-shadow-lg">Vremenske prilike</h5>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        Proverite vremenske prilike za svaku destinaciju pre putovanja. Pripremite odgovarajuću garderobu za različite vremenske uslove. Ne zaboravite na sunčane naočare, kremu za sunčanje i kišobran za slučaj promene vremena.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conclusion Section */ }
                <section id="conclusion" className="mb-16 p-8 bg-white rounded-3xl shadow-xl pt-24">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Zaključak</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Nezaboravno putovanje</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Zaključna razmišljanja</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <div className="relative h-full">
                                <OptimizedImage
                                    src="https://cdn.prod.website-files.com/670e0ce761868ff9e8915a06/671658291a1e7c3b91d6b4d0_90_Quoteson_Vacation_Endingto_Relive_Memories_a80050bd0c.webp"
                                    alt="Zaključak putovanja"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">Nezaboravno putovanje kroz Balkan i Jonsko more.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Ovo putovanje je pružilo neuporedivu priliku za istraživanje bogate istorije, kulture i prirodnih lepota Balkana i Jonskog mora. Svaki dan je donosio nova iskustva i sećanja koja će ostati zauvek.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TravelGuideUpdated; 