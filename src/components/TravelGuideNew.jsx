import React, { useState, useEffect, useRef } from 'react';

// Image component with loading state
const OptimizedImage = ( { src, alt, className, caption } ) => {
    const [ isLoading, setIsLoading ] = useState( true );

    return (
        <div className="relative w-full">
            { isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
            ) }
            <img
                src={ src }
                alt={ alt }
                className={ `${ className } ${ isLoading ? 'opacity-0' : 'opacity-100' } transition-opacity duration-300` }
                onLoad={ () => setIsLoading( false ) }
            />
            { caption && (
                <p className="absolute bottom-1 left-0 right-0 text-white text-xs bg-black bg-opacity-50 p-1">
                    { caption }
                </p>
            ) }
        </div>
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

        sections.forEach( ( { id } ) => {
            const element = document.getElementById( id );
            if ( element ) {
                observer.observe( element );
                sectionRefs.current[ id ] = element;
            }
        } );

        return () => {
            sections.forEach( ( { id } ) => {
                const element = sectionRefs.current[ id ];
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
                            Balkanska Odiseja
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
                        <p className="text-gray-700">
                            Ova ruta nudi brz i slikovit prelaz iz srpskih ravnica u planinske krajolike Severne Makedonije. Za putnike koji žele maksimalno iskoristiti ograničeno vreme u Bitolju, efikasnost na granici je ključna.
                        </p>
                        <p className="font-bold text-blue-600 mt-2">
                            Savet za prelazak granice: Koristite granični prelaz Medžitlija-Niki za brži i lakši prelazak.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Bitolj: Grad konzula i drevnih odjeka</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Širok Sokak, Bitolj"
                                className="w-full h-auto object-cover"
                                caption="Dobrodošli u Bitolj, grad bogate istorije i kulture."
                            />
                        </div>
                        <p className="text-gray-700 mb-4">
                            Bitolj, drugi po veličini grad u Severnoj Makedoniji, nosi počasnu titulu "Grada konzula", što svedoči o njegovoj istorijskoj važnosti kao diplomatskog i trgovačkog centra tokom osmanskog perioda.
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Obavezno posetiti znamenitosti:</h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Herakleja Linkestidska:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
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
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
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
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
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
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
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
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Stari bazar, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Istorijska tržnica sa lokalnim rukotvorinama i proizvodima.
                            </li>
                        </ul>
                    </div>

                    {/* Rest of the sections remain unchanged */ }
                </section>
            </div>
        </div>
    );
};

export default App; 