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
                        absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 
                        text-white p-2 transition-all duration-300 ease-in-out
                        ${ isHovered ? 'opacity-100' : 'opacity-0' }` }>
                        <p className="text-sm">{ caption }</p>
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
const App = () => {
    const [ activeSection, setActiveSection ] = useState( 'intro' );
    const sectionRefs = useRef( {} );

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
            element.scrollIntoView( { behavior: 'smooth' } );
            setActiveSection( id );
        }
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
                <header id="intro" className="text-center mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h1 className="text-5xl font-extrabold text-blue-800 mb-4 leading-tight">
                        Vaša Idealna Balkanska i Jonska Odiseja
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">Beograd - Bitolj - Perdika - Beograd (16 dana)</p>
                    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg">
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                            alt="Mapa Balkana"
                            className="w-full h-auto object-cover"
                            caption="Putovanje kroz istoriju, kulturu i prirodne lepote Balkana i Jonskog mora."
                        />
                    </div>
                    <p className="mt-8 text-lg leading-relaxed">
                        Ova 16-dnevna ekspedicija obećava neuporedivu kombinaciju istorijske dubine, živahne kulture i prelepih prirodnih pejzaža, protežući se od srca Srbije preko istorijskih raskrsnica Severne Makedonije, a kulminira u mirnoj lepoti grčke jonske obale. Putovanje je osmišljeno za putnike koji traže autentična iskustva, od drevnih ruševina i užurbanih bazara do mitskih reka i suncem okupanih plaža. Naglasak je na uranjanju u lokalne tradicije, uživanju u autentičnoj kuhinji i otkrivanju skrivenih dragulja Balkana i Jonskog mora.
                    </p>
                    <p className="mt-4 text-lg leading-relaxed">
                        Putovanje počinje u Beogradu, vodeći prema jugu do Bitolja za imerzivni noćni boravak u Severnoj Makedoniji. Glavni deo putovanja odvija se tokom 15 noćenja u zapanjujućoj regiji Perdika u Grčkoj, nudeći savršenu bazu za istraživanje skrivenih dragulja Jonskog mora. Povratak će uključivati pažljivo odabrano zaustavljanje duž rute E75 u južnoj Srbiji, osiguravajući tako celovitu i nezaboravnu petlju putovanja.
                    </p>
                </header>

                {/* Day 1 Section */ }
                <section id="day1" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 1: Beograd (Srbija) do Bitolja (Severna Makedonija)</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Istorijsko srce Severne Makedonije (1 noćenje)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutarnja vožnja: Od srpskih ravnica do makedonskih planina</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop"
                                alt="Autoput u Srbiji"
                                className="w-full h-auto object-cover"
                                caption="Vožnja od Beograda do Bitolja (oko 567 km, ~5h 51min)."
                            />
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
                            <OptimizedImage
                                src="https://www.politika.rs/thumbs//upload/PhotoGallery/Image/2022_09///1014z570_Bitolj-Aleksandar-Makedonski-spomenik-Nikola-Trklja.jpg?text=Slide-0"
                                alt="Širok Sokak, Bitolj"
                                className="w-full h-auto object-cover"
                                caption="Dobrodošli u Bitolj, grad bogate istorije i kulture."
                            />
                        </div>
                        <p className="text-gray-700 mb-4">
                            Bitolj, drugi po veličini grad u Severnoj Makedoniji, nosi počasnu titulu "Grada konzula", što svedoči o njegovoj istorijskoj važnosti kao diplomatskog i trgovačkog centra tokom osmanskog perioda. Njegova istorija seže u 4. vek pre Hrista, obeležena osnivanjem Herakleje Linkestidske od strane Filipa II. Makedonskog.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Grad je igrao značajnu ulogu u raznim carstvima, uključujući period pod srpskom vlašću u 14. veku tokom pohoda kralja Stefana Dušana, a kasnije je postao deo Kraljevine Srba, Hrvata i Slovenaca nakon Prvog svetskog rata. Bitolj je bogat kulturnim spomenicima i istorijskom baštinom.
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Obavezno posetiti znamenitosti:</h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Herakleja Linkestidska:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://yusundials.com/wp-content/uploads/2015/07/10-Herakleja-Linkestidska-3.jpg"
                                        alt="Mozaici u Herakleji Linkestidskoj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Drevno arheološko nalazište sa rimskim i vizantijskim ostacima.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Širok Sokak:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://bitola.info/wp-content/uploads/2017/02/Shirok_sokak_Bitola.jpg"
                                        alt="Širok Sokak noću"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Živahna pešačka ulica, srce modernog Bitolja.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Sahat-kula (Saat Kula):</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://media-cdn.tripadvisor.com/media/photo-s/02/2c/79/7d/bitola.jpg"
                                        alt="Sahat-kula, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Istaknuti simbol Bitolja iz 16. veka.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Crkva sv. Dimitrija:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://bitola.info/wp-content/uploads/2018/02/sv-dimitrij-bitola.jpg"
                                        alt="Crkva sv. Dimitrija, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Značajno versko nasleđe, poznata po freskama.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Stari bazar (Stara Čaršija):</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://i0.wp.com/cineculture.gaussinstitute.org/wp-content/uploads/2020/10/stara-carsija-618.jpg?fit=900%2C572&ssl=1"
                                        alt="Stari bazar, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Istorijska tržnica sa lokalnim rukotvorinama i proizvodima.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Day 2 Section */ }
                <section id="day2" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 2: Bitolj (Severna Makedonija) do Perdike (Grčka)</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Putovanje do Jonskog mora (1 noćenje)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutarnja vožnja: Od planina do mora</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://nikana.gr/images/5643/put-kolima-do-grke-kako-najbolje-planirati-putovanje-do-mora-blog-blog-3.jpg"
                                alt="Planinski put"
                                className="w-full h-auto object-cover"
                                caption="Vožnja od Bitolja do Perdike (oko 180 km, ~3h)."
                            />
                        </div>
                        <p className="text-gray-700">
                            Putovanje od Bitolja do Perdike vodi kroz prelepe planinske krajolike i male gradove, nudeći uvid u lokalni život i kulturu. Ruta je dobro održavana i nudi prelepe poglede na prirodu.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Perdika: Vaš dom na Jonskom moru</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://www.greeka.com/village_beach/photos/180/perdika-top-1-1280.jpg"
                                alt="Perdika plaža"
                                className="w-full h-auto object-cover"
                                caption="Dobrodošli u Perdiku, vašu bazu za istraživanje Jonskog mora."
                            />
                        </div>
                        <p className="text-gray-700 mb-4">
                            Perdika je mirno mesto na obali Jonskog mora, poznato po svojim prelepim plažama i autentičnoj grčkoj atmosferi. Ovo mesto će biti vaša baza za sledećih 15 dana, omogućavajući vam da istražujete sve što Jonsko more ima da ponudi.
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Obavezno posetiti u Perdiki:</h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Karavostasi:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://www.perdika.info/images/_Karavostasi_Beach_Hotel/_large/_0000364%20copy.jpg"
                                        alt="Karavostasi plaža"
                                        className="w-full h-full object-cover"
                                        caption="Prelepa Karavostasi plaža u Perdiki"
                                    />
                                </div>
                                Prelepa plaža sa kristalno čistom vodom i peščanim dnom.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Arilas:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://www.visit-thesprotia.gr/wp-content/uploads/2014/07/arilla-aerial2.jpg"
                                        alt="Arilas plaža"
                                        className="w-full h-full object-cover"
                                        caption="Prelepa Arilas plaža u Perdiki"
                                    />
                                </div>
                                Prelepa plaža sa finim, lepljivim peskom.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Agia Paraskevi:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/145929450.jpg?k=b5b2bac9d22d0570cc14294ac2b9b0f9a955fa408fa835b9e64ba269cbe771a6&o=&hp=1"
                                        alt="Agia Paraskevi plaža"
                                        className="w-full h-full object-cover"
                                        caption="Prelepa Agia Paraskevi plaža u Perdiki"
                                    />
                                </div>
                                Prelepa plaža sa finim pesakom i oblutci.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Lokalne taverne:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://weloveaegina.com/wp-content/uploads/2021/06/antonis-perdika-front-03-1704x800.jpeg"
                                        alt="Lokalna taverna"
                                        className="w-full h-full object-cover"
                                        caption="Lokalna taverna u Perdiki"
                                    />
                                </div>
                                Probajte autentičnu grčku kuhinju u lokalnim tavernama.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Mali pristan:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://c8.alamy.com/comp/2KKHADD/the-small-port-of-perdika-in-aegina-greece-a-common-stop-over-port-on-sailing-holidays-in-the-saronic-gulf-2KKHADD.jpg"
                                        alt="Mali pristan u Perdiki"
                                        className="w-full h-full object-cover"
                                        caption="Mali pristan u Perdiki"
                                    />
                                </div>
                                Slikovit pristan sa tradicionalnim ribarskim čamcima.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Days 3-15 Section */ }
                <section id="days3-15" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dani 3-15: Jonski dragulji</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Istraživanje Jonskog mora (15 noćenja)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Istraživanje Jonskih ostrva</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://www.halotours.rs/core/media/Jonska-ostrva-620x245.jpg"
                                alt="Jonska ostrva"
                                className="w-full h-auto object-cover"
                                caption="Istražite prelepa Jonska ostrva tokom vašeg boravka."
                            />
                        </div>
                        <p className="text-gray-700">
                            Tokom vašeg 15-dnevnog boravka u Perdiki, imaćete priliku da istražite prelepa Jonska ostrva i njihove znamenitosti. Svako ostrvo ima svoju jedinstvenu priču i lepotu koju treba otkriti.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Obavezno posetiti mesta:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Korfu:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://www.ponte.rs/UPLOADS-PONTE/2023/02/KRF-OSTRVO.jpg"
                                        alt="Korfu grad"
                                        className="w-full h-full object-cover"
                                        caption="Korfu grad"
                                    />
                                </div>
                                Istorijski grad sa utvrđenjima i prelepim plažama.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Zakintos:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://maestral.co.rs/wp-content/uploads/2023/11/Ostrvo-Zakintos-Grcka-2.jpg"
                                        alt="Zakintos plaža"
                                        className="w-full h-full object-cover"
                                        caption="Zakintos plaža"
                                    />
                                </div>
                                Poznat po svojim plavim pećinama i prelepim plažama.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Kefalonija:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://www.mediteraneo.rs/pic/Kefalonija-01.jpg"
                                        alt="Kefalonija pejzaž"
                                        className="w-full h-full object-cover"
                                        caption="Kefalonija pejzaž"
                                    />
                                </div>
                                Najveće Jonsko ostrvo sa prelepim pejzažima.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Itaka:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://grckikutak.com/wp-content/uploads/2020/06/itaka.png"
                                        alt="Itaka zaliv"
                                        className="w-full h-full object-cover"
                                        caption="Itaka zaliv"
                                    />
                                </div>
                                Dom legendarnog Odiseja sa prelepim zalivima.
                            </li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Aktivnosti i doživljaji:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Ronjenje:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://d2p1cf6997m1ir.cloudfront.net/media/thumbnails/1d/09/1d09f7541afd9d6fbc7b50775b87288b.webp"
                                        alt="Ronjenje u Jonskom moru"
                                        className="w-full h-full object-cover"
                                        caption="Ronjenje u Jonskom moru"
                                    />
                                </div>
                                Istražite podvodni svet Jonskog mora.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Vožnja čamcem:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://dynamic-media.tacdn.com/media/photo-o/2e/e7/3c/1f/caption.jpg?w=800&h=600&s=1"
                                        alt="Vožnja čamcem"
                                        className="w-full h-full object-cover"
                                        caption="Vožnja čamcem"
                                    />
                                </div>
                                Posetite skrivene plaže i zalive.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Lokalna kuhinja:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.squarespace-cdn.com/content/v1/5e484ab628c78d6f7e602d73/c185f22e-bfed-4486-bb0b-749b8491a69d/traditional-greek-dishes.jpg"
                                        alt="Grčka kuhinja"
                                        className="w-full h-full object-cover"
                                        caption="Grčka kuhinja"
                                    />
                                </div>
                                Probajte autentične grčke specijalitete.
                            </li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Plaže u Perdiki</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-6 text-left">Naziv plaže</th>
                                        <th className="py-3 px-6 text-left">Sastav obale</th>
                                        <th className="py-3 px-6 text-left">Dubina vode</th>
                                        <th className="py-3 px-6 text-left">Organizacija</th>
                                        <th className="py-3 px-6 text-left">Dostupni sadržaji</th>
                                        <th className="py-3 px-6 text-left">Prikladnost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-6">Karavostasi</td>
                                        <td className="py-3 px-6">Fini pesak i oblutci</td>
                                        <td className="py-3 px-6">Duboka</td>
                                        <td className="py-3 px-6">Organizovana</td>
                                        <td className="py-3 px-6">Ležaljke, suncobrani, kafići, taverne, spasilac</td>
                                        <td className="py-3 px-6">Opšte opuštanje</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-6">Arilas</td>
                                        <td className="py-3 px-6">Fini, lepljivi pesak</td>
                                        <td className="py-3 px-6">Plitka</td>
                                        <td className="py-3 px-6">Organizovana</td>
                                        <td className="py-3 px-6">Ležaljke, suncobrani, vodeni bicikli, tuševi, taverne</td>
                                        <td className="py-3 px-6">Porodice sa decom</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-6">Agia Paraskevi</td>
                                        <td className="py-3 px-6">Fini pesak i oblutci</td>
                                        <td className="py-3 px-6">Tirkizna, čista</td>
                                        <td className="py-3 px-6">Organizovana</td>
                                        <td className="py-3 px-6">Ležaljke, suncobrani, vodeni bicikli, kanui, spasilac</td>
                                        <td className="py-3 px-6">Slikovito, opuštanje</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Preporučeni restorani u Perdiki</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h5 className="text-lg font-semibold text-blue-700 mb-2">Nontas Fish Restaurant</h5>
                                <div className="relative w-full h-80 mb-4 rounded-lg overflow-hidden">
                                    <OptimizedImage
                                        src="https://nontasfishrestaurant.gr/wp-content/uploads/2022/01/drz-antzi-studios_Q1A8346-Copy.jpg"
                                        alt="Nontas Fish Restaurant"
                                        className="w-full h-full object-cover"
                                        caption="Nontas Fish Restaurant"
                                    />
                                </div>
                                <p className="text-gray-700">
                                    Renomirana, porodična tradicionalna taverna koja posluje od 1936. godine.
                                    Specijalizovana za svežu morsku hranu i ribu koju love lokalni ribari.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h5 className="text-lg font-semibold text-blue-700 mb-2">The Crabs Tavern</h5>
                                <div className="relative w-full h-80 mb-4 rounded-lg overflow-hidden">
                                    <OptimizedImage
                                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/15/65/18/the-crabs.jpg?w=800&h=400&s=1"
                                        alt="The Crabs Tavern"
                                        className="w-full h-full object-cover"
                                        caption="The Crabs Tavern"
                                    />
                                </div>
                                <p className="text-gray-700">
                                    Visoko preporučena zbog izuzetne kvaliteta hrane, sa svežom morskom hranom
                                    i dnevnim promenljivim jelovnikom sa jedinstvenim specijalitetima.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jednodnevni izleti iz Perdike</h4>

                        {/* Parga Section */ }
                        <div className="mb-6">
                            <h5 className="text-lg font-semibold text-blue-700 mb-2">Parga: Slikoviti grad i zapanjujuće uvale</h5>
                            <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://www.greeka.com/photos/epirus/parga/hero/parga-1280.jpg"
                                    alt="Parga"
                                    className="w-full h-auto object-cover"
                                    caption="Približno 30-40 minuta vožnje od Perdike"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h6 className="font-semibold mb-2">Znamenitosti:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Venecijanski dvorac (9-19h, besplatno)</li>
                                        <li>Plaža Valtos (2 km od centra)</li>
                                        <li>Plaža Lihnos</li>
                                        <li>Plaža Sarakiniko</li>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="font-semibold mb-2">Restorani:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>The Captain's Restaurant</li>
                                        <li>Fish Taverna Suli</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Sivota Section */ }
                        <div className="mb-6">
                            <h5 className="text-lg font-semibold text-blue-700 mb-2">Sivota: "Karibi Grčke"</h5>
                            <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/56/5e/47/caption.jpg?w=500&h=400&s=1"
                                    alt="Sivota"
                                    className="w-full h-auto object-cover"
                                    caption="Približno 15-20 minuta vožnje od Perdike"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h6 className="font-semibold mb-2">Plaže:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Bela Vraka plaža</li>
                                        <li>Pisina plaža (Plava laguna)</li>
                                        <li>Mega Amos plaža</li>
                                        <li>Mikri Amos plaža</li>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="font-semibold mb-2">Restorani:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Ionion Fish Restaurant</li>
                                        <li>Oliva Beach Bar-Seafood Restaurant</li>
                                        <li>Taverna Stavros</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Aheron River Section */ }
                        <div className="mb-6">
                            <h5 className="text-lg font-semibold text-blue-700 mb-2">Reka Aheron: Mitske vode i avanture</h5>
                            <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://lucina-potepanja.com/wp-content/uploads/2019/07/acheron-river-2-1140x660.jpg"
                                    alt="Reka Aheron"
                                    className="w-full h-auto object-cover"
                                    caption="Približno 30-45 minuta vožnje od Perdike do Glikija"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h6 className="font-semibold mb-2">Aktivnosti:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Rafting</li>
                                        <li>Kajak</li>
                                        <li>Jahanje kroz plitke vode</li>
                                        <li>Rekarski trekking</li>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="font-semibold mb-2">Znamenitosti:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Nekromanteion Aherona (ulaznica ~6€)</li>
                                        <li>Izvori Aherona u Glikiju</li>
                                    </ul>
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
                                    <h6 className="font-semibold mb-2">Festivali:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Festival Epirus Music Village (Pogoniji, avgust)</li>
                                        <li>Kanaria Festival (Parga, 14. avgusta)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="font-semibold mb-2">Lokalne taverne sa muzikom:</h6>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Tavern Grill Ksaderfos (blizu Perdike)</li>
                                        <li>Lokalne taverne u Pargi i Sivoti</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Day 16 Section */ }
                <section id="day16" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 16: E75 povratak kući</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Povratak u Beograd</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Povratak kroz prirodne lepote</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBSDQ7sJqwj5Ai0vvkL16tqsJ2oWpEEy9PNw&s"
                                alt="E75 put"
                                className="w-full h-auto object-cover"
                                caption="Povratak kući kroz prelepe prirodne pejzaže."
                            />
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
                <section id="practical" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Praktična razmatranja</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Saveti za putovanje</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Priprema za putovanje</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://innsbrookvacations.com/wp-content/uploads/2024/06/Packing-List-Tips-for-Your-Summer-Vacation.jpg"
                                alt="Priprema za putovanje"
                                className="w-full h-auto object-cover"
                                caption="Saveti za pripremu vašeg putovanja."
                            />
                        </div>
                        <p className="text-gray-700">
                            Pre polaska na putovanje, proverite sve potrebne dokumente, rezervišite smeštaj i pripremite se za različite vremenske uslove. Takođe, obratite pažnju na lokalne običaje i kulture koje ćete upoznati tokom putovanja.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Saveti za putovanje:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Dokumenti:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://europeanwesternbalkans.com/wp-content/uploads/2024/03/342301934_253874793759224_803575013896565759_n-960x540-1.jpeg"
                                        alt="Putnički dokumenti"
                                        className="w-full h-full object-cover"
                                        caption="Putnički dokumenti"
                                    />
                                </div>
                                Proverite sve potrebne dokumente pre polaska.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Smeštaj:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://www.lareserve-ramatuelle.com/wp-content/uploads/2020/11/lrr_accomodation_junior-suite_bygregoiregardette_6463_bd.jpg"
                                        alt="Smeštaj"
                                        className="w-full h-full object-cover"
                                        caption="Smeštaj"
                                    />
                                </div>
                                Rezervišite smeštaj unapred za sve destinacije.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Vremenske prilike:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.squarespace-cdn.com/content/v1/62b42acaae8de47236dbc8f2/abc61c8d-96b4-49c1-b492-7652236f7dc3/pexels-daniel-jurin-1835718.jpg"
                                        alt="Vremenske prilike"
                                        className="w-full h-full object-cover"
                                        caption="Vremenske prilike"
                                    />
                                </div>
                                Proverite vremenske prilike za svaku destinaciju.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Conclusion Section */ }
                <section id="conclusion" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Zaključak</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Nezaboravno putovanje</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Zaključna razmišljanja</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://cdn.prod.website-files.com/670e0ce761868ff9e8915a06/671658291a1e7c3b91d6b4d0_90_Quoteson_Vacation_Endingto_Relive_Memories_a80050bd0c.webp"
                                alt="Zaključak putovanja"
                                className="w-full h-auto object-cover"
                                caption="Nezaboravno putovanje kroz Balkan i Jonsko more."
                            />
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

export default App; 